<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Scalar\String_;

class SeasonPlayer extends Model
{
    //

    public function player(): Player {
        return $this->belongsTo(Player::class, 'player_id', 'id')->first();
    }

    public function name(): string {
        return $this->player()->first_name;
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
        $scores = $this->scores();
        if ($scores->count() == 0)
            return 0;

        return round($scores->avg('score'),2);
    }

    public function handicap(): int {
        $handicap = (config(getenv('HANDICAP_CALC_BASE_SCORE'), 200) - $this->average())
                    *config(getenv('HANDICAP_CALC_MULTIPLIER'), 0.8);
        if ($handicap > 80)
            return 80;

        if ($handicap < 0)
            return 0;

        return round($handicap);
    }

    public function matchScores(int $match_id): Collection {
        return $this->scores()->where('match_id', '=', "$match_id");
    }

    public function matchGameScore(int $match_id, $game_number): Score {
        return $this->matchScores($match_id)->where('game_number', '=', "$game_number")->first();
    }

    public function matchScoresArray(int $match_id): array {
        $scores = $this->matchScores($match_id);
        return [
            'first_game' => $scores->where('game_number', '=', '1')->first()->score_handicap,
            'second_game' => $scores->where('game_number', '=', '2')->first()->score_handicap,
            'third_game' => $scores->where('game_number', '=', '3')->first()->score_handicap,
            'total' => $scores->sum('score_handicap')
        ];
    }
}
