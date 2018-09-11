<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Player extends User
{
    use Notifiable;

    protected $table = 'players';
    protected $primaryKey = 'email';

    protected $guarded = ['id'];
    protected $hidden = array('password', 'remember_token');

    public function getAuthIdentifier()
    {
        return $this->email;
    }

    public function getAuthIdentifierName()
    {
        return "email";
    }

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
