<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SeasonTeam extends Model
{
    //
    public function players() {
        return $this->hasMany(SeasonPlayer::class, 'season_team_id', 'id');
    }

    public function category() {
        return $this->belongsTo(TeamCategory::class, 'category_id', 'id');
    }

    public function season() {
        return $this->belongsTo(Season::class, 'season_id', 'id');
    }
}
