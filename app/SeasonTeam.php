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

    public function playersMatchScores(int $match_id): Collection {
        $scores = new Collection();
        foreach ($this->players() as $player) {
            $scores = $scores->merge($player->matchScores($match_id));
        }
        return $scores;
    }

    public function matchGameTeamScore(int $match_id, int $game_number, bool $withHandicap = true): int{
        $scoreCollection = $game_number == 0 ?
            $this->playersMatchScores($match_id) :
            $this->playersMatchScores($match_id)->where('game_number', "$game_number");

        return $scoreCollection->sum('score') + ($withHandicap ? $scoreCollection->sum('handicap') : 0);
    }

    public function matches(): Collection {
        return $this->hasMany(Match::class, 'season_team1_id', 'id')->get()->merge(
            $this->hasMany(Match::class, 'season_team2_id', 'id')->get()
        );
    }

    public function match(int $matchId): ?Match {
        return $this->matches()->where('id', "$matchId")->first();
    }
}
