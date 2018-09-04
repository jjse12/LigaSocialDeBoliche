<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    public function matchdays(): Collection {
        return $this->hasMany(Matchday::class, 'season_id', 'id')->get();
    }

    public function teams(): Collection {
        return $this->hasMany(SeasonTeam::class, 'season_id', 'id')->get();
    }

    public function players(): Collection {
        return $this->hasMany(SeasonPlayer::class, 'season_id', 'id')->get();
    }
}
