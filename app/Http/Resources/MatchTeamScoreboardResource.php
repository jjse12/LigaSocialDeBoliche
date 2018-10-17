<?php

namespace App\Http\Resources;

use App\Match;
use App\SeasonTeam;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchTeamScoreboardResource extends JsonResource
{
    private $matchId;

    public function __construct(SeasonTeam $resource, int $matchId)
    {
        parent::__construct($resource);
        $this->matchId = $matchId;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $result = [];
        $match = Match::find($this->matchId);
        $allScores = $this->seasonPlayersMatchScores($this->matchId);
        $firstGameScores = $allScores->where('game_number', '1')->sortBy('turn_number');
        $secondGameScores = $allScores->where('game_number', '2')->sortBy('turn_number');
        $thirdGameScores = $allScores->where('game_number', '3')->sortBy('turn_number');

        $playersScores = [];
//        $firstGame = [];
//        $secondGame = [];
//        $thirdGame = [];


        $playersId = [];
        foreach ($firstGameScores as $score) {
            /*
            $firstGame["p$score->turn_number"] = [
                'id' => $score->id,
                'seasonPlayerId' => $score->season_player_id,
                'playerName' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score,
            ];*/

            $playersScores[count($playersScores)] = [
                'seasonPlayerId' => $score->season_player_id,
                'playerName' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'firstGame' => [
                    'score' => $score->score,
                    'scoreId' => $score->id,
                    'turnNumber' => $score->turn_number,
                ],
                'total' => $score->score
            ];
            array_push($playersId, $score->season_player_id);
        }

//        $firstGame['scoresTotal'] = $firstGameScores->sum('score');
//        $firstGame['handicapTotal'] = $firstGameScores->sum('handicap');
//        $firstGame['scoresPlusHandicapsTotal'] = $firstGameScores->sum('score') + $firstGameScores->sum('handicap');

        foreach ($secondGameScores as $score) {
           /* $secondGame["p$score->turn_number"] = [
                'id' => $score->id,
                'seasonPlayerId' => $score->season_player_id,
                'playerName' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score
            ];*/

            if (!in_array($score->season_player_id, $playersId)){
                $playersScores[(count($playersScores))] = [
                    'seasonPlayerId' => $score->season_player_id,
                    'playerName' => $score->playerFullName(),
                    'handicap' => $score->handicap,
                    'secondGame' => [
                        'score' => $score->score,
                        'scoreId' => $score->id,
                        'turnNumber' => $score->turn_number,
                    ],
                    'total' => $score->score
                ];
                array_push($playersId, $score->season_player_id);
            }
            else {
                $index = array_search($score->season_player_id, $playersId);
                $playersScores[$index]['secondGame'] = [
                    'score' => $score->score,
                    'scoreId' => $score->id,
                    'turnNumber' => $score->turn_number,
                ];
                $playersScores[$index]['total'] += $score->score;
            }
        }
        /*$secondGame['scoresTotal'] = $secondGameScores->sum('score');
        $secondGame['handicapTotal'] = $secondGameScores->sum('handicap');
        $secondGame['scoresPlusHandicapsTotal'] = $secondGameScores->sum('score') + $secondGameScores->sum('handicap');*/

        foreach ($thirdGameScores as $score) {
            /*$thirdGame["p$score->turn_number"] = [
                'id' => $score->id,
                'seasonPlayerId' => $score->season_player_id,
                'playerName' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score
            ];*/

            if (!in_array($score->season_player_id, $playersId)){
                $playersScores[(count($playersScores))] = [
                    'seasonPlayerId' => $score->season_player_id,
                    'playerName' => $score->playerFullName(),
                    'handicap' => $score->handicap,
                    'thirdGame' => [
                        'score' => $score->score,
                        'scoreId' => $score->id,
                        'turnNumber' => $score->turn_number,
                    ],
                    'total' => $score->score
                ];
            }
            else {
                $index = array_search($score->season_player_id, $playersId);
                $playersScores[$index]['thirdGame'] = [
                    'score' => $score->score,
                    'scoreId' => $score->id,
                    'turnNumber' => $score->turn_number,
                ];
                $playersScores[$index]['total'] += $score->score;
            }
        }
        /*$thirdGame['scoresTotal'] = $thirdGameScores->sum('score');
        $thirdGame['handicapTotal'] = $thirdGameScores->sum('handicap');
        $thirdGame['scoresPlusHandicapsTotal'] = $thirdGameScores->sum('score') + $thirdGameScores->sum('handicap');*/

        $gamesTotals = [];
        $gamesTotals[0]['title'] = 'Pin neto';
        $gamesTotals[0]['firstGame'] = $firstGameScores->sum('score');
        $gamesTotals[0]['secondGame'] = $secondGameScores->sum('score');
        $gamesTotals[0]['thirdGame'] = $thirdGameScores->sum('score');
        $gamesTotals[0]['total'] = $allScores->sum('score');
        $gamesTotals[1]['title'] = 'Handicap';
        $gamesTotals[1]['firstGame'] = $firstGameScores->sum('handicap');
        $gamesTotals[1]['secondGame'] = $secondGameScores->sum('handicap');
        $gamesTotals[1]['thirdGame'] = $thirdGameScores->sum('handicap');
        $gamesTotals[1]['total'] = $allScores->sum('handicap');
        $gamesTotals[2]['title'] = 'Total';
        $gamesTotals[2]['firstGame'] = $firstGameScores->sum('score') + $firstGameScores->sum('handicap');
        $gamesTotals[2]['secondGame'] = $secondGameScores->sum('score') + $secondGameScores->sum('handicap');
        $gamesTotals[2]['thirdGame'] = $thirdGameScores->sum('score') + $thirdGameScores->sum('handicap');
        $gamesTotals[2]['total'] = $allScores->sum('score') + $allScores->sum('handicap');


        // Add BLIND scores (if used):
        $blindGames = $match->getTeamByIdGamesWithBlind($this->id);
        if ($blindGames !== null){
            $scoresCount = count($playersScores);
            $playersScores[$scoresCount] = [
                'seasonPlayerId' => 0,
                'playerName' => 'BLIND',
                'handicap' => 0,
                'total' => strlen($blindGames)*100
            ];

            if (strpos($blindGames, '1') !== FALSE){
                $playersScores[$scoresCount]['firstGame'] = [
                    'score' => 100,
                ];
                $gamesTotals[0]['firstGame'] += 100;
                $gamesTotals[0]['total'] += 100;
                $gamesTotals[2]['firstGame'] += 100;
                $gamesTotals[2]['total'] += 100;
            }
            if (strpos($blindGames, '2') !== FALSE){
                $playersScores[$scoresCount]['secondGame'] = [
                    'score' => 100,
                ];
                $gamesTotals[0]['secondGame'] += 100;
                $gamesTotals[0]['total'] += 100;
                $gamesTotals[2]['secondGame'] += 100;
                $gamesTotals[2]['total'] += 100;
            }
            if (strpos($blindGames, '3') !== FALSE){
                $playersScores[$scoresCount]['thirdGame'] = [
                    'score' => 100,
                ];
                $gamesTotals[0]['thirdGame'] += 100;
                $gamesTotals[0]['total'] += 100;
                $gamesTotals[2]['thirdGame'] += 100;
                $gamesTotals[2]['total'] += 100;
            }
        }


        /*$result['firstGame'] = $fistGame;
        $result['secondGame'] = $secondGame;
        $result['thirdGame'] = $thirdGame;*/

        $result['playersScores'] = $playersScores;
        $result['gamesTotals'] = $gamesTotals;
        return $result;
    }
}
