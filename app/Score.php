<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $guarded = ['id'];

    public function seasonPlayer(): SeasonPlayer {
        return $this->belongsTo(SeasonPlayer::class, 'season_player_id','id')->first();
    }

    public function playerFullName(): string {
        return $this->seasonPlayer()->fullName();
    }

    public function playerGender() {
        return $this->seasonPlayer()->gender();
    }

    public function match(): Match {
        return $this->belongsTo(Match::class, 'match_id', 'id')->first();
    }

    public static function updateScoresForPartialHandicap(SeasonPlayer $player, int $matchId): bool {

        $success = true;
        $gameHandicap = $player->handicap(false);
        foreach ($player->matchScores($matchId) as $matchScore) {
            $matchScore->handicap = $gameHandicap;
            $success = $success && $matchScore->update();
        }

        return $success;
    }
}
