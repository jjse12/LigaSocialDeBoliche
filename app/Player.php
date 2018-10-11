<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class Player extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'players';
    protected $guarded = ['id'];
    protected $hidden = ['password', 'remember_token'];

    public function fullName(): string {
        return "$this->first_name $this->last_name";
    }

    public function currentSeasonPlayer(): ?SeasonPlayer {
        return $this->seasonPlayer(Season::find(Season::count())->id);
    }

    public function allSeasonPlayers(): Collection {
        return $this->hasMany(SeasonPlayer::class, 'player_id', 'id')->get();
    }

    public function seasonPlayer(int $season_id): ?SeasonPlayer {
        foreach ($this->allSeasonPlayers() as $player) {
            if ($player->seasonTeam()->season_id == $season_id){
                return $player;
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
        foreach ($this->allSeasonPlayers() as $player) {
            $scores = $scores->merge($player->scores());
        }

        return $scores;
    }
}
