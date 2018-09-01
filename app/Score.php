<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    //

    public function player() {
        return $this->belongsTo(Player::class, 'player_id','id');
    }

    public function match() {
        return $this->belongsTo(Match::class, 'match_id', 'id');
    }
}
