<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScoreUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
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
            'season_player_id' => 'numeric',
            'match_id' => 'numeric',
            'score' => 'numeric',
            'handicap' => 'numeric',
            'score_handicap' => 'numeric'
        ];
    }
}
