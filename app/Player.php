<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    //
    public function team(){
        return $this->hasOne(Team::class, 'id', "id");
    }

    public function scores(){
        return $this->hasMany(Score::class, 'player_id', 'id');
    }
    /*
    public function seasonScores(int $seasonId){
        return $this->scores()->get()->where('', '=', $seasonId)->get();
    }
    */
}
