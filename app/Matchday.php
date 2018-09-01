<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Matchday extends Model
{
    //
    public function season() {
        return $this->belongsTo(Season::class, 'season_id', 'id')->first();
    }

    public function matches() {
        return $this->hasMany(Match::class, 'matchday_id', 'id')->get();
    }
}
