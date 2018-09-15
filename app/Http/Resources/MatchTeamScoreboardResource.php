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
        $totalOfTotals = [];

        $generalPlayerPositions = [];
        $playersId = [];
        foreach ($firstGameScores as $score) {
            $result['game1']["p$score->turn_number"] = [
                'id' => $score->season_player_id,
                'name' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score
            ];
            $generalPlayerPositions['p'.(count($generalPlayerPositions)+1)] = [
                'id' => $score->season_player_id,
                'name' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'game1' => $score->score,
                'total' => $score->score
            ];
            array_push($playersId, $score->season_player_id);
        }
        $result['game1']['scoresTotal'] = $firstGameScores->sum('score');
        $result['game1']['handicapTotal'] = $firstGameScores->sum('handicap');
        $result['game1']['scoresPlusHandicapsTotal'] = $firstGameScores->sum('score_handicap');

        foreach ($secondGameScores as $score) {
            $result['game2']["p$score->turn_number"] = [
                'id' => $score->season_player_id,
                'name' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score
            ];

            if (!in_array($score->season_player_id, $playersId)){
                $generalPlayerPositions['p'.(count($generalPlayerPositions)+1)] = [
                    'id' => $score->season_player_id,
                    'name' => $score->playerFullName(),
                    'handicap' => $score->handicap,
                    'game2' => $score->score
                ];
                array_push($playersId, $score->season_player_id);
            }
            else {
                $generalPlayerPositions['p'.
                (array_search($score->season_player_id, $playersId)+1)]['game2'] = $score->score;
            }
        }
        $result['game2']['scoresTotal'] = $secondGameScores->sum('score');
        $result['game2']['handicapTotal'] = $secondGameScores->sum('handicap');
        $result['game2']['scoresPlusHandicapsTotal'] = $secondGameScores->sum('score_handicap');

        foreach ($thirdGameScores as $score) {
            $result['game3']["p$score->turn_number"] = [
                'id' => $score->season_player_id,
                'name' => $score->playerFullName(),
                'handicap' => $score->handicap,
                'score' => $score->score
            ];

            if (!in_array($score->season_player_id, $playersId)){
                $generalPlayerPositions['p'.(count($generalPlayerPositions)+1)] = [
                    'id' => $score->season_player_id,
                    'name' => $score->playerFullName(),
                    'handicap' => $score->handicap,
                    'game3' => $score->score
                ];
            }
            else {
                $generalPlayerPositions['p'.
                (array_search($score->season_player_id, $playersId)+1)]['game3'] = $score->score;
            }
        }
        $result['game3']['scoresTotal'] = $thirdGameScores->sum('score');
        $result['game3']['handicapTotal'] = $thirdGameScores->sum('handicap');
        $result['game3']['scoresPlusHandicapsTotal'] = $thirdGameScores->sum('score_handicap');

        $totalOfTotals['scoresTotal'] = $allScores->sum('score');
        $totalOfTotals['handicapTotal'] = $allScores->sum('handicap');
        $totalOfTotals['scoresPlusHandicapsTotal'] = $allScores->sum('score_handicap');

        $playersTotal = [];
        $scoresByPlayers = $allScores->groupBy('season_player_id');
        foreach ($scoresByPlayers as $scores) {
            $playersTotal["".$scores->first()->season_player_id] = [
                'id' => $scores->first()->season_player_id,
                'total' => $scores->sum('score')
            ];
        }
        $totalOfTotals['playerTotals'] = $playersTotal;
        $result['positions'] = $generalPlayerPositions;
        $result['totals'] = $totalOfTotals;
        return $result;
    }
}
