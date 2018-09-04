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
        $scoresTeam1 = $this->team1Scores();
        $scoresTeam2 = $this->team2Scores();

        $team1Points = 0;
        if ($scoresTeam1['first_game'] > $scoresTeam2['first_game'])
            $team1Points += 2;
        else if ($scoresTeam1['first_game'] == $scoresTeam2['first_game'])
            $team1Points++;
        if ($scoresTeam1['second_game'] > $scoresTeam2['second_game'])
            $team1Points += 2;
        else if ($scoresTeam1['second_game'] == $scoresTeam2['second_game'])
            $team1Points++;
        if ($scoresTeam1['third_game'] > $scoresTeam2['third_game'])
            $team1Points += 2;
        else if ($scoresTeam1['third_game'] == $scoresTeam2['third_game'])
            $team1Points++;
        if ($scoresTeam1['total'] > $scoresTeam2['total'])
            $team1Points += 2;
        else if ($scoresTeam1['total'] == $scoresTeam2['total'])
            $team1Points++;

        return $team1Points;
    }

    public function team2Points(): int {
        $scoresTeam1 = $this->team1Scores();
        $scoresTeam2 = $this->team2Scores();

        $team2Points = 0;
        if ($scoresTeam1['first_game'] < $scoresTeam2['first_game'])
            $team2Points += 2;
        else if ($scoresTeam1['first_game'] == $scoresTeam2['first_game'])
            $team2Points++;
        if ($scoresTeam1['second_game'] < $scoresTeam2['second_game'])
            $team2Points += 2;
        else if ($scoresTeam1['second_game'] == $scoresTeam2['second_game'])
            $team2Points++;
        if ($scoresTeam1['third_game'] < $scoresTeam2['third_game'])
            $team2Points += 2;
        else if ($scoresTeam1['third_game'] == $scoresTeam2['third_game'])
            $team2Points++;
        if ($scoresTeam1['total'] < $scoresTeam2['total'])
            $team2Points += 2;
        else if ($scoresTeam1['total'] == $scoresTeam2['total'])
            $team2Points++;

        return $team2Points;
    }
}
