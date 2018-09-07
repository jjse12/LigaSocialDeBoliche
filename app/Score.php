<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $guarded = ['id'];

    public function player(): SeasonPlayer {
        return $this->belongsTo(SeasonPlayer::class, 'season_player_id','id')->first();
    }

    public function playerFullName(): string {
        return $this->player()->fullName();
    }

    public function playerGender() {
        return $this->player()->gender();
    }

    public function match(): Match {
        return $this->belongsTo(Match::class, 'match_id', 'id')->first();
    }
}
