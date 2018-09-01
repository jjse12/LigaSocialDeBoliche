<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SeasonPlayer extends Model
{
    //
    public function player() {
        return $this->belongsTo(Player::class, 'player_id', 'id');
    }

    public function team() {
        return $this->belongsTo(SeasonTeam::class, 'season_team_id', 'id');
    }

    public function scores() {
        return $this->hasMany(Score::class, 'season_player_id', 'id');
    }

    public function category() {
        return $this->belongsTo(PlayerCategory::class, 'category_id', 'id');
    }
}
