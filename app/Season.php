<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    //

    public function players() {
        return $this->teams(); //TODO: fix to obtain all team's players
    }

    public function teams() {
        return $this->hasMany(SeasonTeam::class, 'season_id', 'id');
    }

    public function matchdays() {
        return $this->hasMany(Matchday::class, 'season_id', 'id')->get();
    }
}
