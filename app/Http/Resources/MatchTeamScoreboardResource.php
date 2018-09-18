<?php

namespace App\Http\Resources;

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

        $allScores = $this->playersMatchScores($this->matchId);
        $firstGameScores = $allScores->where('game_number', '1')->sortBy('turn_number');
        $secondGameScores = $allScores->where('game_number', '2')->sortBy('turn_number');
        $thirdGameScores = $allScores->where('game_number', '3')->sortBy('turn_number');

        $playersScores = [];
        $scoreTable = [];
        $playersId = [];
        foreach ($firstGameScores as $score) {
            $result['firstGame']["p$score->turn_number"] = [
                'id' => $score->season_player_id,
                'player' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score
            ];
            $playersScores[count($playersScores)] = [
                'id' => $score->season_player_id,
                'player' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'firstGame' => $score->score,
                'total' => $score->score
            ];
            array_push($playersId, $score->season_player_id);
        }
        $result['firstGame']['scoresTotal'] = $firstGameScores->sum('score');
        $result['firstGame']['handicapTotal'] = $firstGameScores->sum('handicap');
        $result['firstGame']['scoresPlusHandicapsTotal'] = $firstGameScores->sum('score_handicap');

        foreach ($secondGameScores as $score) {
            $result['secondGame']["p$score->turn_number"] = [
                'id' => $score->season_player_id,
                'player' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score
            ];

            if (!in_array($score->season_player_id, $playersId)){
                $playersScores[(count($playersScores))] = [
                    'id' => $score->season_player_id,
                    'player' => $score->playerFullName(),
                    'handicap' => $score->handicap,
                    'secondGame' => $score->score,
                    'total' => $score->score
                ];
                array_push($playersId, $score->season_player_id);
            }
            else {
                $index = array_search($score->season_player_id, $playersId);
                $playersScores[$index]['secondGame'] = $score->score;
                $playersScores[$index]['total'] += $score->score;
            }
        }
        $result['secondGame']['scoresTotal'] = $secondGameScores->sum('score');
        $result['secondGame']['handicapTotal'] = $secondGameScores->sum('handicap');
        $result['secondGame']['scoresPlusHandicapsTotal'] = $secondGameScores->sum('score_handicap');

        foreach ($thirdGameScores as $score) {
            $result['thirdGame']["p$score->turn_number"] = [
                'id' => $score->season_player_id,
                'player' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score
            ];

            if (!in_array($score->season_player_id, $playersId)){
                $playersScores[(count($playersScores))] = [
                    'id' => $score->season_player_id,
                    'player' => $score->playerFullName(),
                    'handicap' => $score->handicap,
                    'thirdGame' => $score->score,
                    'total' => $score->score
                ];
            }
            else {
                $index = array_search($score->season_player_id, $playersId);
                $playersScores[$index]['thirdGame'] = $score->score;
                $playersScores[$index]['total'] += $score->score;
            }
        }
        $result['thirdGame']['scoresTotal'] = $thirdGameScores->sum('score');
        $result['thirdGame']['handicapTotal'] = $thirdGameScores->sum('handicap');
        $result['thirdGame']['scoresPlusHandicapsTotal'] = $thirdGameScores->sum('score_handicap');
/*
        $playersScores['scoresTotal']['firstGame'] = $firstGameScores->sum('score');
        $playersScores['scoresTotal']['secondGame'] = $secondGameScores->sum('score');
        $playersScores['scoresTotal']['thirdGame'] = $thirdGameScores->sum('score');
        $playersScores['scoresTotal']['total'] = $allScores->sum('score');
        $playersScores['handicapsTotal']['firstGame'] = $firstGameScores->sum('handicap');
        $playersScores['handicapsTotal']['secondGame'] = $secondGameScores->sum('handicap');
        $playersScores['handicapsTotal']['thirdGame'] = $thirdGameScores->sum('handicap');
        $playersScores['handicapsTotal']['total'] = $allScores->sum('handicap');
        $playersScores['scoresPlusHandicapsTotal']['firstGame'] = $firstGameScores->sum('score_handicap');
        $playersScores['scoresPlusHandicapsTotal']['secondGame'] = $secondGameScores->sum('score_handicap');
        $playersScores['scoresPlusHandicapsTotal']['thirdGame'] = $thirdGameScores->sum('score_handicap');
        $playersScores['scoresPlusHandicapsTotal']['total'] = $allScores->sum('score_handicap');
*/
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
        $gamesTotals[2]['firstGame'] = $firstGameScores->sum('score_handicap');
        $gamesTotals[2]['secondGame'] = $secondGameScores->sum('score_handicap');
        $gamesTotals[2]['thirdGame'] = $thirdGameScores->sum('score_handicap');
        $gamesTotals[2]['total'] = $allScores->sum('score_handicap');

        $result['playersScores'] = $playersScores;
        $result['gamesTotals'] = $gamesTotals;
        return $result;
    }
}
