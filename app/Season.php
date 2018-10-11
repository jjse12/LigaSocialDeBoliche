<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    public static function currentSeason(): Season {
        return static::all()->last();
    }

    public function matchdays(): Collection {
        return $this->hasMany(Matchday::class, 'season_id', 'id')->get()->sortBy('date');
    }

    public function nextMatchday(): ?Matchday {
        $now = Carbon::now();
        return $this->matchdays()->filter(function ($item) use ($now) {
            return (new \DateTime($item->date) > new \DateTime($now));
        })->first();
    }

    public function seasonTeams(): Collection {
        return $this->hasMany(SeasonTeam::class, 'season_id', 'id')->get();
    }

    public function categorySeasonTeams(int $category_id): Collection {
        return $this->seasonTeams()->where('category_id', "$category_id");
    }

    public function seasonPlayers(): Collection {
        $players = new Collection();
        foreach ($this->seasonTeams() as $team) {
            $players = $players->merge($team->seasonPlayers());
        }
        return $players;
    }

    public function matches(): Collection {
        $matches= new Collection();
        foreach ($this->matchdays() as $matchday) {
            $matches = $matches->merge($matchday->matches());
        }

        return $matches;
    }

    public function scores(): Collection {
        $scores = new Collection();
        foreach ($this->seasonPlayers() as $player) {
            $scores = $scores->merge($player->scores(false));
        }
        return $scores;
    }
}
