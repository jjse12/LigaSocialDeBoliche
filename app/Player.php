<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    public function fullName(): string {
        return "$this->first_name $this->last_name";
    }

    public function team(): Team{
        return $this->hasOne(Team::class, 'id', "id")->first();
    }

    public function allSeasonPlayers(): Collection {
        return $this->hasMany(SeasonPlayer::class, 'player_id', 'id')->get();
    }

    public function seasonPlayer(int $season_id): ?SeasonPlayer {
        foreach ($this->allSeasonPlayers() as $player) {
            if ($player->team()->season_id == $season_id){
                return $player->scores();
            }
        }

        return null;
    }

    public function seasonScores(int $season_id): ?Collection {
        $seasonPlayer = $this->seasonPlayer($season_id);
        return $seasonPlayer != null ? $seasonPlayer->scores() : null;
    }
    public function scores(): Collection{
        $scores = new Collection();
        foreach ($this->seasonsPlayer() as $player) {
            $scores = $scores->merge($player->scores());
        }

        return $scores;
    }

}
