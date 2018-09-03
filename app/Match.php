<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Match extends Model
{
    //
    public function matchday() {
        return $this->belongsTo(Matchday::class, 'matchday_id', 'id')->first();
    }

    public function scores() {
        return $this->hasMany(Score::class, 'score_id', 'id')->get();
    }

    public function team1() {
        return $this->belongsTo(SeasonTeam::class, 'season_team1_id', 'id')->first();
    }

    public function team2() {
        return $this->belongsTo(SeasonTeam::class, 'season_team2_id', 'id')->first();
    }

    public function teamScores1() {
        $team1 = $this->team1();
        return null;
    }
}
