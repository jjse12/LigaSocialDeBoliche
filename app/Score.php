<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    //

    public function player(): Player {
        return $this->belongsTo(Player::class, 'player_id','id')->first();
    }

    public function match(): Match {
        return $this->belongsTo(Match::class, 'match_id', 'id')->first();
    }
}
