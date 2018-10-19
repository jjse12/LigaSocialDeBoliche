<?php

namespace App\Http\Resources;

use App\Score;
use Illuminate\Database\QueryException;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class ScoreUpdateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        try {
            DB::transaction(function () use ($request, &$success) {
                $score = Score::find($request->id);
                $score->update($request->all());
                $player = $score->seasonPlayer();
                if ($player->handicap() === null) {
                    Score::updateScoresForPartialHandicap($player, $score->match_id);
                }
            });
        }
        catch (\Exception $exception){
            if($exception instanceof QueryException ) {
                throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');
            }
        }

        return [
            'status' => 'success',
            'data' => null
        ];
    }
}
