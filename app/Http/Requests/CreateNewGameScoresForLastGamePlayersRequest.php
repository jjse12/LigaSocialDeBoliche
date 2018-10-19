<?php

namespace App\Http\Requests;

use App\Match;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CreateNewGameScoresForLastGamePlayersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
 */
    public function authorize()
    {
        $msg = 'Ocurrió un error inesperado';
        if (Match::where('id', $this->matchId)->exists()){
            $match = Match::find($this->matchId)->first();
            $status = $match->statusData()['status'];
            if ($status === 'En Progreso'){
                $team = $match->getTeamById($this->seasonTeamId);
                if ($team !== null)
                    return $team->hasPlayer(Auth::id());

                $msg = '¡El equipo no es participante de este juego!';
            }
            else if ($status === 'Sin Comenzar')
                $msg = '¡El juego aún no ha comenzado!';
            else if ($status)
                $msg = '¡El juego ya ha terminado!';
        }
        else $msg = '¡El juego que intenta modificar no existe!';
        throw new BadRequestHttpException($msg);
    }

    protected function failedAuthorization()
    {
        throw new AuthorizationException('¡No tienes permisos para editar estos marcadores!');
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'matchId' => 'required|numeric|exists:matches,id',
            'seasonTeamId' => 'required|numeric|exists:season_teams,id'
        ];
    }
}
