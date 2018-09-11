<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Scalar\String_;

class SeasonPlayer extends Model
{
    public function player(): Player {
        return $this->belongsTo(Player::class, 'player_id', 'id')->first();
    }

    public function fullName(): string {
        return $this->player()->fullName();
    }

    public function gender(): string {
        return $this->player()->gender;
    }

    public function team(): SeasonTeam {
        return $this->belongsTo(SeasonTeam::class, 'season_team_id', 'id')->first();
    }

    public function teamName(): string {
        return $this->team()->name();
    }

    public function category(): PlayerCategory {
        return $this->belongsTo(PlayerCategory::class, 'category_id', 'id')->first();
    }

    public function categoryName(): string {
        return $this->category()->name;
    }

    public function scores(): Collection {
        return $this->hasMany(Score::class, 'season_player_id', 'id')->get();
    }

    public function linesPlayed(): int {
        return $this->scores()->count();
    }

    public function average(): float {
        if ($this->linesPlayed() == 0)
            return 0.0;

        return round($this->scores()->avg('score'),2);
    }

    public function handicap(): int {

        // Get handicap for first matchday of season
        if ($this->linesPlayed() == 0) {
            $prevSeasonId = $this->team()->season()->id - 1;
            $queryResult = Season::find($prevSeasonId);
            if ($queryResult != null) {
                $season = $queryResult->first();
                $queryResult = $season->players()->where('player_id', "$this->player_id");
                if ($queryResult != null){
                    $prevSeasonPlayer = $queryResult->first();
                    if ($prevSeasonPlayer->linesPlayed() >= 3)
                        return $prevSeasonPlayer->handicap();
                }
            }

            return -100;
        }

        // Calculate handicap based on players average
        $handicap = (config(getenv('HANDICAP_CALC_BASE_SCORE'), 200) - $this->average())
                    *config(getenv('HANDICAP_CALC_MULTIPLIER'), 0.8);
        if ($handicap > 80)
            return 80;

        if ($handicap < 0)
            return 0;

        return round($handicap);
    }

    public function matchScores(int $match_id): Collection {
        return $this->scores()->where('match_id', "$match_id");
    }

    public function matchGameScore(int $match_id, int $game_number): Score {
        return $this->matchScores($match_id)->where('game_number', "$game_number")->first();
    }
}
