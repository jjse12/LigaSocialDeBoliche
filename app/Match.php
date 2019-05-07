<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Match extends Model
{
    static function previousMatch(Match $match): ?Match {
        $matchday = $match->matchday();
//        if ($m)
    }

    //
    public function matchday(): Matchday {
        return $this->belongsTo(Matchday::class, 'matchday_id', 'id')->first();
    }

    public function team1(): SeasonTeam {
        return $this->belongsTo(SeasonTeam::class, 'season_team1_id', 'id')->first();
    }

    public function team2(): SeasonTeam {
        return $this->belongsTo(SeasonTeam::class, 'season_team2_id', 'id')->first();
    }

    public function team1Name(): string {
        return $this->team1()->name();
    }

    public function team2Name(): string {
        return $this->team2()->name();
    }

    public function team1CategoryName(): string {
        return $this->team1()->categoryName();
    }

    public function team2CategoryName(): string {
        return $this->team2()->categoryName();
    }

    public function statusData(): array {
        $date = Carbon::createFromTimeString($this->matchday()->date);
        $today = Carbon::now();
        $minutesDiff = $today->diffInMinutes($date, false);
        $statusData = [
            'status' => '',
        ];
        if ($minutesDiff > 0){
            $statusData['status'] = 'inactive';
            $date->setLocale('es');
            $statusData['diffForHumans'] = $date->diffForHumans();
            if ($minutesDiff >= 60){
                $hoursDiff = $today->diffInHours($date, false);
                if ($hoursDiff >= 24) {
                    $daysDiff = $today->diffInDays($date, false);
                    $statusData['timeUnit'] = 'days';
                    $statusData['daysRemaining'] = $daysDiff;
                } else {
                    $statusData['timeUnit'] = 'hours';
                    $statusData['hoursRemaining'] = $hoursDiff;
                    if ($hoursDiff < 4){
                        $statusData['minutesRemaining'] = $minutesDiff - $hoursDiff*60;
                    }
                }
            }
            else {
                $statusData['timeUnit'] = 'minutes';
                $statusData['minutesRemaining'] = $minutesDiff;
            }
        } else if ($this->team1_games_confirmed == 3 &&
            $this->team2_games_confirmed == 3) {
            $statusData = [
                'status' => 'concluded'
            ];
        } else {
            $statusData = [
                'status' => 'active',
                'phase' => $this->matchPhase(),
            ];
        }

        return $statusData;
    }

    public function matchPhase(): ?string {
        if ($this->team1_games_confirmed === $this->team2_games_confirmed){
            if ($this->team1_games_confirmed === null)
                return 'warming';
            if ($this->team1_games_confirmed === 0)
                return 'firstGame';
            if ($this->team1_games_confirmed === 1)
                return 'secondGame';
            if ($this->team1_games_confirmed === 2)
                return 'thirdGame';
            if ($this->team1_games_confirmed === 3)
                return 'concluded';
        } else if ($this->team1_games_confirmed + $this->team2_games_confirmed > 0) {
            $minorGameConfirmed =
                $this->team1_games_confirmed === null ? $this->team1_games_confirmed :
                $this->team2_games_confirmed === null ? $this->team2_games_confirmed :
                $this->team1_games_confirmed < $this->team2_games_confirmed ?
                $this->team1_games_confirmed : $this->team2_games_confirmed;

            if ($minorGameConfirmed === null)
                return 'warming';
            if ($minorGameConfirmed === 0)
                return 'firstGame';
            if ($minorGameConfirmed === 1)
                return 'secondGame';
            if ($minorGameConfirmed === 2)
                return 'thirdGame';
        }

        return null;
    }

    public function scores(): Collection {
        return $this->hasMany(Score::class, 'match_id', 'id')->get();
    }

    public function gameScores(int $game_number = 0): Collection {
        if ($game_number == 0)
            return $this->scores();

        return $this->scores()->where('game_number', "$game_number");
    }


    public function team1PinTotal(): int {
        return $this->team1()->matchGameTeamScore($this->id, 0);
    }

    public function team2PinTotal(): int {
        return $this->team2()->matchGameTeamScore($this->id, 0);
    }

    public function getTeamById(int $season_team_id): ?SeasonTeam {
        if ($this->team1()->id == $season_team_id)
            return $this->team1();
        if ($this->team2()->id == $season_team_id)
            return $this->team2();

        return null;
    }

    public function getTeamByIdGamesWithBlind(int $season_team_id): ?string{
        if ($this->team1()->id == $season_team_id)
            return $this->team1_games_with_blind;
        else if ($this->team2()->id == $season_team_id)
            return $this->team2_games_with_blind;

        return null;
    }

    public function setTeamByIdGamesWithBlind(int $season_team_id, int $gamesWithBlind): ?bool {
        if ($this->team1()->id == $season_team_id)
            $this->team1_games_with_blind = $gamesWithBlind;
        else if ($this->team2()->id == $season_team_id)
            $this->team2_games_with_blind = $gamesWithBlind;
        else return null;

        return $this->update();
    }

    public function getTeamByIdGamesConfirmed(int $season_team_id): ?int {
        if ($this->team1()->id == $season_team_id)
            return $this->team1_games_confirmed;
        else if ($this->team2()->id == $season_team_id)
            return $this->team2_games_confirmed;

        return -1;
    }

    public function setTeamByIdGamesConfirmed(int $season_team_id, int $gamesConfirmed): ?bool {
        if ($this->team1()->id == $season_team_id)
            $this->team1_games_confirmed = $gamesConfirmed;
        else if ($this->team2()->id == $season_team_id)
            $this->team2_games_confirmed = $gamesConfirmed;
        else return null;

        return $this->update();
    }

    public function team1Points(): int {
        $team1Points = 0;
        $phase = $this->matchPhase();
        if ($phase === null || $phase === 'warming' || $phase === 'firstGame')
            return $team1Points;

        $team1 = $this->team1();
        $team2 = $this->team2();
        $team1FirstGameScore = $team1->matchGameTeamScore($this->id, 1);
        $team2FirstGameScore = $team2->matchGameTeamScore($this->id, 1);
        if ($team1FirstGameScore > $team2FirstGameScore)
            $team1Points += 2;
        else if ($team1FirstGameScore == $team2FirstGameScore)
            $team1Points++;
        if ($phase === 'secondGame')
            return $team1Points;

        $team1SecondGameScore = $team1->matchGameTeamScore($this->id, 2);
        $team2SecondGameScore = $team2->matchGameTeamScore($this->id, 2);
        if ($team1SecondGameScore > $team2SecondGameScore)
            $team1Points += 2;
        else if ($team1SecondGameScore == $team2SecondGameScore)
            $team1Points++;
        if ($phase === 'thirdGame')
            return $team1Points;

        $team1ThirdGameScore = $team1->matchGameTeamScore($this->id, 3);
        $team1TotalGameScore = $team1->matchGameTeamScore($this->id, 0);
        $team2ThirdGameScore = $team2->matchGameTeamScore($this->id, 3);
        $team2TotalGameScore = $team2->matchGameTeamScore($this->id, 0);

        if ($team1ThirdGameScore > $team2ThirdGameScore)
            $team1Points += 2;
        else if ($team1ThirdGameScore == $team2ThirdGameScore)
            $team1Points++;
        if ($team1TotalGameScore > $team2TotalGameScore)
            $team1Points += 2;
        else if ($team1TotalGameScore == $team2TotalGameScore)
            $team1Points++;

        return $team1Points;
    }

    public function team2Points(): int {
        $points = [
            '' => 0,
            'warming' => 0,
            'firstGame' => 0,
            'secondGame' => 2,
            'thirdGame' => 4,
            'concluded' => 8
        ];

        return $points[$this->matchPhase()] - $this->team1Points();
    }
}
