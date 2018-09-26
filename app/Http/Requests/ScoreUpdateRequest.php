<?php

namespace App\Http\Requests;

use App\Score;
use App\Season;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ScoreUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if (Score::where('id', $this->id)->exists()){
            $score = Score::find($this->id);
            return $score->seasonPlayer()->seasonTeam()->hasPlayer(Auth::id());
        }

        return false;
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
            'id' => 'numeric|required|'.Rule::in(Season::currentSeason()->scores()->pluck('id')->toArray()),
            'score' => 'numeric|min:0|max:300',
            'season_player_id' => 'numeric|min:0',
            'handicap' => 'numeric|min:0|max:80'
        ];
    }
}
