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
        $players = new Collection();
        foreach ($this->teams() as $team) {
            $players = $players->merge($team->players());
        }
        return $players;
    }
}
