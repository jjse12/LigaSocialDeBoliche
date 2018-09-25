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
        return [
            'active' => $this->active == 1,
            'date' => Carbon::createFromTimeString($this->matchday()->date)->format('d/M/Y'),
            'matchdayNumber' => $this->matchday()->number,
            'redPin' => $this->matchday()->red_pin,
            'virtual' => $this->matchday()->virtual,
            'team1' => [
                'id' => $team1->id,
                'name' => $team1->name(),
                'laneNumber' => $this->team1_lane,
                'gamesConfirmed' => $this->team1_games_confirmed,
                'results' => new MatchTeamScoreboardResource($team1, $this->id),
                'points' => $this->team1Points(),
                'comments' => $this->team1_comments
            ],
            'team2' => [
                'id' => $team2->id,
                'name' => $team2->name(),
                'laneNumber' => $this->team2_lane,
                'gamesConfirmed' => $this->team2_games_confirmed,
                'results' => new MatchTeamScoreboardResource($team2, $this->id),
                'points' => $this->team2Points(),
                'comments' => $this->team2_comments
            ]
        ];
    }
}
