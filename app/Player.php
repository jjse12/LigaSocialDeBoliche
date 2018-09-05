<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    public function fullName(): string {
        return "$this->first_name $this->last_name";
    }

    public function team(): Team{
        return $this->hasOne(Team::class, 'id', "id")->first();
    }

    public function scores(): Collection{
        return $this->hasMany(Score::class, 'player_id', 'id')->get();
    }

    /*
    public function seasonScores(int $seasonId){
        return $this->scores()->get()->where('', '=', $seasonId)->get();
    }
    */
}
