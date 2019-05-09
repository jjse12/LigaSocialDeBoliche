<?php

namespace App\Http\Resources;

use App\Match;
use App\SeasonTeam;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class MatchTeamLastGamePlayersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        /* @var Match $match */
        $match = Match::find($request->match);
        /* @var SeasonTeam $seasonTeam */
        $seasonTeam = SeasonTeam::find($request->seasonTeam);
        $teamName = $seasonTeam->name();
        $gamesConfirmed = $match->getTeamByIdGamesConfirmed($seasonTeam->id);
        if ($gamesConfirmed === -1)
            throw new BadRequestHttpException("¡El equipo $teamName no es participante de este juego!" );

        if ($gamesConfirmed === null)
            throw new BadRequestHttpException("¡El equipo $teamName aún está en la fase de calentamiento de este juego !" );
        else if ($gamesConfirmed > 0) {
            $scoresSeasonPlayersIds = $match->gameScores($gamesConfirmed)->pluck('season_player_id')->toArray();
            $players = $seasonTeam->seasonPlayers();
            $lastGamePlayers = $players->whereIn('id', $scoresSeasonPlayersIds);
            $result = [];
            foreach ($lastGamePlayers as $player) {
                $result[] = (new SeasonPlayerResource($player, true))->toArray(null);
            }
            return $result;
        }
        return [];
    }
}
