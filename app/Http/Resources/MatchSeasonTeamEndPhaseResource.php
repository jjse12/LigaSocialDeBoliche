<?php

namespace App\Http\Resources;

use App\Match;
use App\SeasonTeam;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class MatchSeasonTeamEndPhaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     * @throws ValidationException
     */
    public function toArray($request)
    {
        $match = Match::find($request->match);
        $teamName = SeasonTeam::find($request->seasonTeamId)->first()->name();
        $gamesConfirmed = $match->getTeamByIdGamesConfirmed($request->seasonTeamId);
        if ($gamesConfirmed === -1)
            throw new BadRequestHttpException("¡El equipo $teamName no es participante de este juego!" );

        $exceptionMessage = '';
        if ($request->phase == 'warming' && $gamesConfirmed !== null)
            $exceptionMessage = "¡El calentamiento de este juego ya ha concluido para el equipo $teamName!";
        if ($request->phase == 'firstGame' && $gamesConfirmed >= 1)
            $exceptionMessage = "¡La primera linea de este juego ya ha concluido para el equipo $teamName!";
        if ($request->phase == 'secondGame' && $gamesConfirmed >= 2)
            $exceptionMessage = "¡La segunda linea de este juego ya ha concluido para el equipo $teamName!";
        if ($request->phase == 'thirdGame' && $gamesConfirmed >= 3)
            $exceptionMessage = "¡La tercera linea de este juego ya ha concluido para el equipo $teamName!";
        if ($exceptionMessage != '')
            throw new BadRequestHttpException($exceptionMessage);

        if ($gamesConfirmed === null)
            $gamesConfirmed = 0;
        else $gamesConfirmed++;
        $updateSucceed = $match->setTeamByIdGamesConfirmed($request->seasonTeamId, $gamesConfirmed);
        if (!$updateSucceed)
            throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');

        return [];
    }
}
