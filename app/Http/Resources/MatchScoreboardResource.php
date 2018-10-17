<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchScoreboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $team1 = $this->team1();
        $team2 = $this->team2();
        $date = Carbon::createFromTimeString($this->matchday()->date);
        $statusData = $this->statusData();

        return [
            'statusData' => $statusData,
            'date' => $date->format('d/M/Y'),
            'matchdayNumber' => $this->matchday()->number,
            'redPin' => $this->matchday()->red_pin,
            'virtual' => $this->matchday()->virtual,
            'team1' => [
                'data' => [
                    'id' => $team1->id,
                    'name' => $team1->name(),
                    'laneNumber' => $this->team1_lane,
                    'gamesConfirmed' => $this->team1_games_confirmed,
                    'comments' => $this->team1_comments,
                    'points' => $this->team1Points(),
                ],
                'results' => new MatchTeamScoreboardResource($team1, $this->id),
            ],
            'team2' => [
                'data' => [
                    'id' => $team2->id,
                    'name' => $team2->name(),
                    'laneNumber' => $this->team2_lane,
                    'gamesConfirmed' => $this->team2_games_confirmed,
                    'comments' => $this->team2_comments,
                    'points' => $this->team2Points(),
                ],
                'results' => new MatchTeamScoreboardResource($team2, $this->id),
            ]
        ];
    }
}
