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
        $gamesConfirmed = null;
        if ($match->team1()->id == $request->seasonTeamId){
            $gamesConfirmed = $match->team1_games_confirmed;
        } else if ($match->team2()->id == $request->seasonTeam){
            $gamesConfirmed = $match->team2_games_confirmed;
        } else {
            throw new BadRequestHttpException("¡El equipo $teamName no es participante de este juego!" );
        }
        
        switch ($request->phase){
            case 'warming':
                if ($gamesConfirmed > -1)
                    throw new BadRequestHttpException("¡El calentamiento de este juego ya ha concluido para el equipo $teamName!");

                break;
            case 'firstGame':
                if ($gamesConfirmed > 0)
                    throw new BadRequestHttpException("¡La primera linea de este juego ya ha concluido para el equipo $teamName!");
                break;
            case 'secondGame':
                if ($gamesConfirmed > 1)
                    throw new BadRequestHttpException("¡La segunda linea de este juego ya ha concluido para el equipo $teamName!");
                break;
            case 'thirdGame':
                if ($gamesConfirmed > 2)
                    throw new BadRequestHttpException("¡La tercera linea de este juego ya ha concluido para el equipo $teamName!");
                break;
            default:
                throw new BadRequestHttpException();
        }

        if ($match->team1()->id == $request->seasonTeamId){
            $match->team1_games_confirmed = $gamesConfirmed + 1;
        } else if ($match->team2()->id == $request->seasonTeam) {
            $match->team2_games_confirmed = $gamesConfirmed + 1;
        }

        $updateSucceed = $match->update();
        if (!$updateSucceed)
            throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');

        return [];
    }
}
