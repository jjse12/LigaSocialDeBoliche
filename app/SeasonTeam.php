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

    public function seasonPlayers(): Collection {
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

    public function seasonPlayersMatchScores(int $match_id): Collection {
        $scores = new Collection();
        foreach ($this->seasonPlayers() as $player) {
            $scores = $scores->merge($player->matchScores($match_id));
        }
        return $scores;
    }

    public function matchGameTeamScore(int $match_id, int $game_number, bool $withHandicap = true): int{
        $scoreCollection = $game_number == 0 ?
            $this->seasonPlayersMatchScores($match_id) :
            $this->seasonPlayersMatchScores($match_id)->where('game_number', "$game_number");

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

    public function hasPlayer(int $player_id): bool {
        foreach ($this->seasonPlayers() as $player) {
            if ($player->player()->id == $player_id)
                return true;
        }
        return false;
    }
}
