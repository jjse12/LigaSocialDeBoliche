<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class PlayerCategory extends Model
{
    //
    public function seasonPlayers(int $seasonId): Collection{
        return $this->hasMany(SeasonPlayer::class, 'category_id', 'id')
            ->get()->where('season_id', "$seasonId");
    }
}
