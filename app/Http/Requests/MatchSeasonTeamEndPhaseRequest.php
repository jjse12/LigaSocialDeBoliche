<?php

namespace App\Http\Requests;

use App\Match;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class MatchSeasonTeamEndPhaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $msg = 'Ocurrió un error inesperado';
        if (Match::where('id', $this->match)->exists()){
            $match = Match::find($this->match);
            $status = $match->statusData()['status'];
            if ($status === 'active'){
                $team = $match->getTeamById($this->seasonTeamId);
                if ($team !== null)
                    return $team->hasPlayer(Auth::id());

                $msg = '¡El equipo no es participante de este juego!';
            }
            else if ($status === 'inactive')
                $msg = '¡El juego aún no ha comenzado!';
            else if ($status)
                $msg = '¡El juego ya ha terminado!';
        }
        else $msg = '¡El juego que intenta modificar no existe!';
        throw new BadRequestHttpException($msg);
    }

    protected function failedAuthorization()
    {
        throw new AuthorizationException('¡No tienes permisos para modificar este juego!');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'match' => 'numeric|required|exists:matches,id',//.Rule::in(Match::all()->pluck('id')->toArray()),
            'seasonTeamId' => 'required|numeric|exists:season_teams,id',//.Rule::in(Season::currentSeason()->seasonTeams()->pluck('id')->toArray()),
            'phase' => 'required|string|in:"warming","firstGame","secondGame","thirdGame"',
        ];
    }
}
