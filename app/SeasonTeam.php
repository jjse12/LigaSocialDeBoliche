<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class SeasonTeam extends Model
{
    public function team(): Team {
        return $this->belongsTo(Team::class, 'team_id', 'id')->first();
    }

    public function name(): string {
        return $this->team()->name;
    }

    public function players(): Collection {
        return $this->hasMany(SeasonPlayer::class, 'season_team_id', 'id')->get();
    }

    public function category(): TeamCategory {
        return $this->belongsTo(TeamCategory::class, 'category_id', 'id')->first();
    }

    public function categoryName(): string {
        return $this->category()->name;
    }

    public function season(): Season {
        return $this->belongsTo(Season::class, 'season_id', 'id')->first();
    }

    public function matchGameTeamScore($match_id, $game_number, $withHandicap = true){
        $score = 0;
        foreach ($this->players() as $player) {
            if ($game_number == 0){
                $score += $player->matchScores($match_id)->sum('score' . ($withHandicap ? '_handicap' : ''));
            }
            else {
                $score += $withHandicap ? $player->matchGameScore($match_id, $game_number)->score_handicap :
                    $player->matchGameScore($match_id, $game_number)->score;
            }
        }

        return $score;
    }

    public function matches(): Collection {
        return $this->hasMany(Match::class, 'season_team1_id', 'id')->get()->merge(
            $this->hasMany(Match::class, 'season_team2_id', 'id')->get()
        );
    }
}
