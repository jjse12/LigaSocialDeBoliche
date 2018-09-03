<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TeamCategory extends Model
{
    public function seasonTeams(int $seasonId) {
        return $this->hasMany(SeasonTeam::class, 'category_id', 'id')
            ->where('season_id', '=', ''.$seasonId)->get();
    }
}
