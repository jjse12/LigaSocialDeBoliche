<?php

namespace App\Http\Requests;

use App\Match;
use App\Season;
use App\SeasonTeam;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class MatchSeasonTeamEndPhaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if (SeasonTeam::where('id', $this->seasonTeamId)->exists()){
            $team = SeasonTeam::find($this->seasonTeamId);
            return $team->hasPlayer(Auth::id());
        }

        return false;
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
            'match' => 'numeric|required|'.Rule::in(Match::all()->pluck('id')->toArray()),
            'seasonTeamId' => 'required|numeric|min:0|'.Rule::in(Season::currentSeason()->seasonTeams()->pluck('id')->toArray()),
            'phase' => 'required|string|in:"warming","firstGame","secondGame","thirdGame"',
        ];
    }
}
