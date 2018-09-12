<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    public function matchdays(): Collection {
        return $this->hasMany(Matchday::class, 'season_id', 'id')->get()->sortBy('date');
    }

    public function nextMatchday(): ?Matchday {
        $now = time();
        return $this->matchdays()->filter(function ($item) use ($now) {
            return (strtotime("$item->date") - $now) > 0;
        })->first();
    }

    public function teams(): Collection {
        return $this->hasMany(SeasonTeam::class, 'season_id', 'id')->get();
    }

    public function categoryTeams(int $category_id): Collection {
        return $this->teams()->where('category_id', "$category_id");
    }

    public function players(): Collection {
        $players = new Collection();
        foreach ($this->teams() as $team) {
            $players = $players->merge($team->players());
        }
        return $players;
    }
}
