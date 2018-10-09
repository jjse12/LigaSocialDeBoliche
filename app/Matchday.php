<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Matchday extends Model
{
    public function matches(): Collection {
        return $this->hasMany(Match::class, 'matchday_id', 'id')->get();
    }

    public function gameWinnerPlayers(int $game_number): Collection {
        $scores = new Collection();
        foreach ($this->matches() as $match) {
            $scores = $scores->merge($match->gameScores($game_number));
        }

        $winners = new Collection();
        $malesMinimumScore = config('GAME_WINNERS_MALES_MINIMUM', 200);
        $femalesMinimumScore = config('GAME_WINNERS_FEMALES_MINIMUM', 160);
        foreach ($scores as $score) {
            if ($score->score >= $malesMinimumScore ||
                ($score->score >= $femalesMinimumScore &&
                 $score->playerGender() == 'F')){
                $winners = $winners->add($score);
            }
        }

        return $winners;
    }
    
    public function season(): Season {
        return $this->belongsTo(Season::class, 'season_id', 'id')->first();
    }
}
