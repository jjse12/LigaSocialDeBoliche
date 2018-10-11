<?php

namespace App\Http\Requests;

use App\Score;
use App\Season;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ScoreUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     * @throws BadRequestHttpException
     */
    public function authorize()
    {
        $score = Score::find($this->id);
        $msg = 'Ocurrió un error inesperado';
        if ($score !== null){
            $status = $score->match()->statusData()['status'];
            if ($status === 'En Progreso')
                return $score->seasonPlayer()->seasonTeam()->hasPlayer(Auth::id());
            else if ($status === 'Sin Comenzar')
                $msg = '¡El juego aún no ha comenzado!';
            else if ($status)
                $msg = '¡El juego ya ha terminado!';
        }
        else $msg = '¡La puntuación que intenta modificar no existe!';

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
            'id' => 'numeric|required|exists:scores,id',//.Rule::in(Season::currentSeason()->scores()->pluck('id')->toArray()),
            'season_player_id' => 'numeric|exists:season_players,id',
            'score' => 'numeric|min:0|max:300',
        ];
    }
}
