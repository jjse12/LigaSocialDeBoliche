<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class TeamCategory extends Model
{
    public function seasonTeams(int $seasonId): Collection {
        return $this->hasMany(SeasonTeam::class, 'category_id', 'id')
            ->get()->where('season_id',  "$seasonId");
    }
}
