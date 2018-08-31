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
        return $this->hasMany();
    }
}
