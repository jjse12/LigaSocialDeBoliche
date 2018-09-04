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

    public function scores(): Collection {
        return $this->hasMany(Score::class, 'score_id', 'id')->get();
    }

    public function team1(): SeasonTeam {
        return $this->belongsTo(SeasonTeam::class, 'season_team1_id', 'id')->first();
    }

    public function team2(): SeasonTeam {
        return $this->belongsTo(SeasonTeam::class, 'season_team2_id', 'id')->first();
    }

    public function team1Scores(): array {
        $arr = [
            'first_game' => 0,
            'second_game' => 0,
            'third_game' => 0,
            'total' => 0,
        ];

        foreach ($this->team1()->players() as $player){
            $scores = $player->matchScoresArray($this->id);
            $arr['first_game'] += $scores['first_game'];
            $arr['second_game'] += $scores['second_game'];
            $arr['third_game'] += $scores['third_game'];
            $arr['total'] += $scores['total'];
        }

        return $arr;
    }

    public function team2Scores(): array {
        $arr = [
            'first_game' => 0,
            'second_game' => 0,
            'third_game' => 0,
            'total' => 0,
        ];

        foreach ($this->team2()->players() as $player){
            $scores = $player->matchScoresArray($this->id);
            $arr['first_game'] += $scores['first_game'];
            $arr['second_game'] += $scores['second_game'];
            $arr['third_game'] += $scores['third_game'];
            $arr['total'] += $scores['total'];
        }

        return $arr;
    }

    public function team1Points(): int {
        $team1 = $this->team1();
        $team2 = $this->team2();
        $team1FirstGameScore = $team1->matchGameTeamScore($this->id, 1);
        $team1SecondGameScore = $team1->matchGameTeamScore($this->id, 2);
        $team1ThirdGameScore = $team1->matchGameTeamScore($this->id, 3);
        $team1TotalGameScore = $team1->matchGameTeamScore($this->id, null);
        $team2FirstGameScore = $team2->matchGameTeamScore($this->id, 1);
        $team2SecondGameScore = $team2->matchGameTeamScore($this->id, 2);
        $team2ThirdGameScore = $team2->matchGameTeamScore($this->id, 3);
        $team2TotalGameScore = $team2->matchGameTeamScore($this->id, null);
        
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
        $team1TotalGameScore = $team1->matchGameTeamScore($this->id, null);
        $team2FirstGameScore = $team2->matchGameTeamScore($this->id, 1);
        $team2SecondGameScore = $team2->matchGameTeamScore($this->id, 2);
        $team2ThirdGameScore = $team2->matchGameTeamScore($this->id, 3);
        $team2TotalGameScore = $team2->matchGameTeamScore($this->id, null);

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
