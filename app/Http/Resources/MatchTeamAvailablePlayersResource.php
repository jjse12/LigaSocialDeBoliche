<?php

namespace App\Http\Resources;

use App\Match;
use App\SeasonTeam;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class MatchTeamAvailablePlayersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $match = Match::find($request->match);
        $seasonTeam = SeasonTeam::find($request->seasonTeam);
        $teamName = $seasonTeam->name();
        $gamesConfirmed = $match->getTeamByIdGamesConfirmed($seasonTeam->id);
        if ($gamesConfirmed === null)
            throw new BadRequestHttpException("¡El equipo $teamName no es participante de este juego!" );

        $availablePlayers = [];
        if ($gamesConfirmed <= -1)
            throw new BadRequestHttpException("¡El equipo $teamName aún está en la fase de calentamiento de este juego !" );
        else if ($gamesConfirmed === 0 || $gamesConfirmed === 1){
            $availablePlayers = (new SeasonTeamPlayersResource($seasonTeam))->toArray(null);
        } else if ($gamesConfirmed === 2){
            $players = (new SeasonTeamPlayersResource($seasonTeam))->toArray(null);
            $teamScores = $match->scores()->whereIn('season_player_id', $seasonTeam->seasonPlayers()->pluck('id'));

            foreach ($players as $player) {
                if (!in_array($player['id'], $teamScores->pluck('season_player_id')->toArray()) ||
                    in_array($player['id'], $teamScores->where('game_number', '2')->pluck('season_player_id')->toArray())) {
                    array_push($availablePlayers, $player);
                }
            }
        } else {
            throw new BadRequestHttpException("¡El equipo $teamName ya ha concluido este juego!" );
        }

        return $availablePlayers;
    }
}
