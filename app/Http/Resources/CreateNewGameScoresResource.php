<?php

namespace App\Http\Resources;

use App\Match;
use App\Score;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
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
        try{

        DB::transaction(function () use ($request) {
            foreach ($request->scores as $score) {
                if ($score['season_player_id'] === null){
                    $match = Match::find($request->match);
                    if ($match->team1()->id === $request->seasonTeamId &&
                        $match->team1_games_confirmed !== null) {
                        $match->team1_games_with_blind .= ($match->team1_games_confirmed+1);
                        $match->update();
                    } else if ($match->team2_games_confirmed !== null) {
                        $match->team2_games_with_blind .= ($match->team2_games_confirmed+1);
                        $match->update();
                    }
                }
                else{
                    $score = new Score($score);
                    $score->save();
                }
//                $success = $success && $score->save();
            }
        });
        } catch (\Exception $e){
            throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');
        }

        //TODO: If any of the scores failed to be stored in DB, delete the scores that succeed to be stored.
//        if (!$success){
//            if (!$success)
//                throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');
//        }

        return [
            'status' => 'success'
        ];
    }
}
