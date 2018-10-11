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

    public function playerId(): int {
        return $this->player()->id;
    }

    public function fullName(): string {
        return $this->player()->fullName();
    }

    public function gender(): string {
        return $this->player()->gender;
    }

    public function seasonTeam(): SeasonTeam {
        return $this->belongsTo(SeasonTeam::class, 'season_team_id', 'id')->first();
    }

    public function teamName(): string {
        return $this->seasonTeam()->name();
    }

    public function category(): PlayerCategory {
        return $this->belongsTo(PlayerCategory::class, 'category_id', 'id')->first();
    }

    public function categoryName(): string {
        return $this->category()->name;
    }

    public function scores(bool $onlyConcludedMatches = true): Collection {
        $scores = $this->hasMany(Score::class, 'season_player_id', 'id')->get();
        if ($onlyConcludedMatches){
            $season = $this->seasonTeam()->season();
            return $scores->whereIn('match_id', $season->matches()->where('concluded', '1')->pluck('id'));
        }

        return $scores;
    }

    public function gamesPlayed(bool $onlyConcludedMatches = true): int {
        return $this->scores($onlyConcludedMatches)->count();
    }

    public function pinTotal(bool $onlyConcludedMatches = true): int {
        return $this->scores($onlyConcludedMatches)->sum('score');
    }

    public function average(bool $onlyConcludedMatches = true): float {
        if ($this->gamesPlayed($onlyConcludedMatches) == 0)
            return 0.0;

        return round($this->scores($onlyConcludedMatches)->avg('score'),2);
    }

    public function handicap(bool $onlyConcludedMatches = true): ?int {

        // Get handicap for player's first matchday in season
        if ($this->gamesPlayed($onlyConcludedMatches) == 0) {
            $prevSeasonId = $this->seasonTeam()->season_id - 1;
            $queryResult = Season::find($prevSeasonId);
            if ($queryResult != null) {
                $season = $queryResult->first();
                $queryResult = $season->players()->where('player_id', "$this->player_id");
                if ($queryResult != null){
                    $prevSeasonPlayer = $queryResult->first();
                    if ($prevSeasonPlayer->gamesPlayed() >= 3)
                        return $prevSeasonPlayer->handicap();
                }
            }

            return null;
        }

        // Calculate handicap based on players average
        $handicap = (config('HANDICAP_CALC_BASE_SCORE',200) - $this->average($onlyConcludedMatches));
        $handicap =  $handicap*config('HANDICAP_CALC_MULTIPLIER', 0.8);

        $maxHandicap = config('HANDICAP_MAX', 80);
        if ($handicap > $maxHandicap)
            return $maxHandicap;

        $minHandicap= config('HANDICAP_MIN', 0);
        if ($handicap < $minHandicap)
            return $minHandicap;

        return round($handicap);
    }

    public function matchScores(int $match_id): Collection {
        $scores = $this->hasMany(Score::class, 'season_player_id', 'id')->get();
        return $scores->where('match_id', "$match_id");
    }

    public function matchGameScore(int $match_id, int $game_number): Score {
        return $this->matchScores($match_id)->where('game_number', "$game_number")->first();
    }
}
