<?php

namespace App\Http\Resources;

use App\Score;
use Illuminate\Http\Resources\Json\JsonResource;

class CreateNewGameScoresResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        foreach ($request->scores as $score) {
            $score = new Score($score);
            $score->save();
        }

        return [
            'status' => 'success'
        ];
    }
}
