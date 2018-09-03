<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    public function matchdays() {
        return $this->hasMany(Matchday::class, 'season_id', 'id')->get();
    }

    public function teams() {
        return $this->hasMany(SeasonTeam::class, 'season_id', 'id')->get();
    }

    public function players() {
        return $this->hasMany(SeasonPlayer::class, 'season_id', 'id')->get();
    }
}
