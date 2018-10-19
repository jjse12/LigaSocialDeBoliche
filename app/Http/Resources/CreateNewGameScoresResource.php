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
                    $match = Match::find($request->matchId);
                    $gameNumber= $match->getTeamByIdGamesConfirmed($request->seasonTeamId);
                    if ($gameNumber !== null){
                        $gameNumber++;
                        $gamesWithBlind = $match->getTeamByIdGamesWithBlind($request->seasonTeamId);
                        if ($gamesWithBlind === null)
                            $match->setTeamByIdGamesWithBlind($request->seasonTeamId, "$gameNumber");
                        else $match->setTeamByIdGamesWithBlind($request->seasonTeamId, "$gamesWithBlind$gameNumber");
                    }
                }
                else{
                    $newScore = new Score($score);
                    $newScore->save();
                    $player = $newScore->seasonPlayer();
                    if ($player->handicap() === null) {
                        Score::updateScoresForPartialHandicap($player, $newScore->match_id);
                    }
                }
            }
        });
        } catch (\Exception $e){
            throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');
        }

        return [
            'status' => 'success',
            'data' => null
        ];
    }
}
