<?php

namespace App\Http\Resources;

use App\Score;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

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
        $success = true;
        foreach ($request->scores as $score) {
            $score = new Score($score);
            $success = $success && $score->save();
        }

        //TODO: If any of the scores failed to be stored in DB, delete the scores that succeed to be stored.
        if (!$success){
            if (!$success)
                throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');
        }

        return [
            'status' => 'success'
        ];
    }
}
