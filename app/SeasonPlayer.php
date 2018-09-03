<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SeasonPlayer extends Model
{
    //
    public function player() {
        return $this->belongsTo(Player::class, 'player_id', 'id')->first();
    }

    public function team() {
        return $this->belongsTo(SeasonTeam::class, 'season_team_id', 'id')->first();
    }

    public function category() {
        return $this->belongsTo(PlayerCategory::class, 'category_id', 'id')->first();
    }

    public function scores() {
        return $this->hasMany(Score::class, 'season_player_id', 'id')->get();
    }

    public function linesPlayed() {
        return $this->scores()->count();
    }

    public function average(): float {
        $scores = $this->scores();
        if ($scores->count() == 0)
            return 0;

        $sum = 0;
        foreach ($scores as $score) {
            $sum += $score->score;
        }

        return round($sum/$scores->count(),2);
    }

    public function handicap() {
        $handicap = (config(getenv('HANDICAP_CALC_BASE_SCORE'), 200) - $this->average())
                    *config(getenv('HANDICAP_CALC_MULTIPLIER'), 0.8);
        if ($handicap > 80)
            return 80;

        if ($handicap < 0)
            return 0;

        return round($handicap);
    }
}
