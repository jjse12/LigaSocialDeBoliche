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
        return $this->seasonPlayer(Season::currentSeason()->id);
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

    public function info(): array {
        return [
            'id' => $this->id,
            'gender' => $this->gender,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'birthday' => $this->birthday,
            'created_at' => $this->created_at
        ];
    }

    public function currentSeasonData(): array {
        /** @var SeasonPlayer $seasonPlayer*/
        $seasonPlayer = $this->currentSeasonPlayer();
        if ($seasonPlayer !== null){
            $currentSeasonAverage = $seasonPlayer->average();
            $currentSeasonCategory = $seasonPlayer->categoryName();
            $currentSeasonGamesPlayed = $seasonPlayer->gamesPlayed();
            $currentSeasonPinTotal = $seasonPlayer->pinTotal();
            $currentSeasonHandicap = $seasonPlayer->handicap();

            /** @var SeasonTeam $seasonTeam */
            $seasonTeam = $this->currentSeasonPlayer()->seasonTeam();
            $seasonTeamId = $seasonTeam->id;
            $seasonTeamName = $seasonTeam->name();

            return [
                'category' => $currentSeasonCategory,
                'gamesPlayed' => $currentSeasonGamesPlayed,
                'pinTotal' => $currentSeasonPinTotal,
                'average' => $currentSeasonAverage,
                'handicap' => $currentSeasonHandicap,
                'team' => [
                    'id' => $seasonTeamId,
                    'name' => $seasonTeamName,
                ]
            ];
        }
        return [];
    }

    public function allSeasonsData(): array {
        $allScores = $this->scores();
        $seasonsPlayed = $this->allSeasonPlayers()->count();
        $gamesPlayed = $allScores->count();
        $pinTotal = $allScores->sum('score');
        $average = $allScores->average('score');
        $highestScore = $allScores->max('score');
        return [
            'seasonsPlayed' => $seasonsPlayed,
            'gamesPlayed' => $gamesPlayed,
            'pinTotal' => $pinTotal,
            'average' => $average,
            'highestScore' => $highestScore,
        ];
    }
}
