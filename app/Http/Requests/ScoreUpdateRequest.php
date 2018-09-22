<?php

namespace App\Http\Requests;

use App\Score;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ScoreUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $score = Score::find($this->request->get('id'));
        dd(Auth::user()->id, $score->player()->player()->id);
        return $score->seasonPlayer()->seasonTeam()->hasPlayer(Auth::user()->id);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id' => 'required',
            'score' => 'numeric',
            'season_player_id' => 'numeric',
            'handicap' => 'numeric'
        ];
    }
}
