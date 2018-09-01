<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Match extends Model
{
    //
    public function matchday() {
        return $this->belongsTo(Matchday::class, 'matchday_id', 'id');
    }

    public function scores() {
        return $this->hasMany(Score::class, 'score_id', 'id');
    }
}
