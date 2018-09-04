<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Matchday extends Model
{
    //
    public function season(): Season {
        return $this->belongsTo(Season::class, 'season_id', 'id')->first();
    }

    public function matches(): Collection {
        return $this->hasMany(Match::class, 'matchday_id', 'id')->get();
    }
}
