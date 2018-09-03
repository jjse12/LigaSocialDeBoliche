<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    public function seasonTeams() {
        return $this->hasMany(SeasonTeam::class, 'season_id', 'id')->get();
    }

    public function playedSeasons() {
        $seasons = new Collection();
        $seasonTeams = $this->seasonTeams();
        foreach ($seasonTeams as $seasonTeam) {
            $seasons = $seasons->toBase()->merge($seasonTeam->season()->get());
        }

        return $seasons;
    }
}
