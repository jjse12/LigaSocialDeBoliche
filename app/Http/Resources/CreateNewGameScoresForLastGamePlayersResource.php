<?php

namespace App\Http\Resources;

use App\Match;
use App\Score;
use App\SeasonTeam;
use Illuminate\Database\QueryException;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class CreateNewGameScoresForLastGamePlayersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        try{
            DB::transaction(function () use ($request) {
                $matchId = $request->matchId;
                $seasonTeamId = $request->seasonTeamId;
                $match = Match::find($matchId);
                $seasonTeam = SeasonTeam::find($seasonTeamId);
                $gamesConfirmed = $match->getTeamByIdGamesConfirmed($seasonTeamId);
                $scores = $seasonTeam->seasonPlayersMatchGameScores($matchId, $gamesConfirmed);
                foreach ($scores as $previousScore) {
                    $attributes = [
                        'season_player_id' => $previousScore->season_player_id,
                        'match_id' => $previousScore->match_id,
                        'game_number' => $gamesConfirmed+1,
                        'turn_number' => $previousScore->turn_number,
                        'score' => 0,
                        'handicap' => $previousScore->handicap
                    ];

                    $newScore = new Score($attributes);
                    $newScore->save();
                    $player = $newScore->seasonPlayer();
                    if ($player->handicap() === null) {
                        Score::updateScoresForPartialHandicap($player, $newScore->match_id);
                    }
                }

                $gamesWithBlind = $match->getTeamByIdGamesWithBlind($seasonTeamId);
                if ($gamesWithBlind !== null){
                    if (strpos($gamesWithBlind, "$gamesConfirmed") !== FALSE){
                        $match->setTeamByIdGamesWithBlind($seasonTeamId, "$gamesWithBlind".($gamesConfirmed+1));
                    }
                }
            });
        } catch (\Exception $exception){
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
