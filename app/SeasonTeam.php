<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SeasonTeam extends Model
{
    public function team() {
        return $this->belongsTo(Team::class, 'team_id', 'id')->first();
    }

    public function players() {
        return $this->hasMany(SeasonPlayer::class, 'season_team_id', 'id')->get();
    }

    public function category() {
        return $this->belongsTo(TeamCategory::class, 'category_id', 'id')->first();
    }

    public function season() {
        return $this->belongsTo(Season::class, 'season_id', 'id')->first();
    }

    public function matches() {
        return $this->hasMany(Match::class, 'season_team1_id', 'id')->get()->merge(
            $this->hasMany(Match::class, 'season_team2_id', 'id')->get()
        );
    }
}
