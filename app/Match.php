<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Match extends Model
{
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

    public function team1Points(): int {
        $team1 = $this->team1();
        $team2 = $this->team2();
        $team1FirstGameScore = $team1->matchGameTeamScore($this->id, 1);
        $team1SecondGameScore = $team1->matchGameTeamScore($this->id, 2);
        $team1ThirdGameScore = $team1->matchGameTeamScore($this->id, 3);
        $team1TotalGameScore = $team1->matchGameTeamScore($this->id, 0);
        $team2FirstGameScore = $team2->matchGameTeamScore($this->id, 1);
        $team2SecondGameScore = $team2->matchGameTeamScore($this->id, 2);
        $team2ThirdGameScore = $team2->matchGameTeamScore($this->id, 3);
        $team2TotalGameScore = $team2->matchGameTeamScore($this->id, 0);

        $team1Points = 0;
        if ($team1FirstGameScore > $team2FirstGameScore)
            $team1Points += 2;
        else if ($team1FirstGameScore == $team2FirstGameScore)
            $team1Points++;
        if ($team1SecondGameScore > $team2SecondGameScore)
            $team1Points += 2;
        else if ($team1SecondGameScore == $team2SecondGameScore)
            $team1Points++;
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
        $team1 = $this->team1();
        $team2 = $this->team2();
        $team1FirstGameScore = $team1->matchGameTeamScore($this->id, 1);
        $team1SecondGameScore = $team1->matchGameTeamScore($this->id, 2);
        $team1ThirdGameScore = $team1->matchGameTeamScore($this->id, 3);
        $team1TotalGameScore = $team1->matchGameTeamScore($this->id, 0);
        $team2FirstGameScore = $team2->matchGameTeamScore($this->id, 1);
        $team2SecondGameScore = $team2->matchGameTeamScore($this->id, 2);
        $team2ThirdGameScore = $team2->matchGameTeamScore($this->id, 3);
        $team2TotalGameScore = $team2->matchGameTeamScore($this->id, 0);

        $team2Points = 0;
        if ($team2FirstGameScore < $team2FirstGameScore)
            $team2Points += 2;
        else if ($team1FirstGameScore == $team2FirstGameScore)
            $team2Points++;
        if ($team1SecondGameScore < $team2SecondGameScore)
            $team2Points += 2;
        else if ($team1SecondGameScore == $team2SecondGameScore)
            $team2Points++;
        if ($team1ThirdGameScore < $team2ThirdGameScore)
            $team2Points += 2;
        else if ($team1ThirdGameScore == $team2ThirdGameScore)
            $team2Points++;
        if ($team1TotalGameScore < $team2TotalGameScore)
            $team2Points += 2;
        else if ($team1TotalGameScore == $team2TotalGameScore)
            $team2Points++;

        return $team2Points;
    }
}
