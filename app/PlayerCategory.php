<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PlayerCategory extends Model
{
    //
    public function seasonPlayers(int $seasonId) {
        return $this->hasMany(SeasonPlayer::class, 'category_id', 'id')
            ->where('season_id', '=', ''.$seasonId)->get();
    }
}
