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
            'active' => $this->active,
            'date' => Carbon::createFromTimeString($this->matchday()->date)->format('d/M/Y'),
            'matchdayNumber' => $this->matchday()->number,
            'redPinGame' => $this->matchday()->is_red_pin_game,
            'team1' => [
                'name' => $team1->name(),
                'lane_number' => $this->team1_lane,
                'results' => new MatchTeamScoreboardResource($team1, $this->id),
                'points' => $this->team1Points(),
                'comments' => $this->team1_comments
            ],
            'team2' => [
                'name' => $team2->name(),
                'lane_number' => $this->team2_lane,
                'results' => new MatchTeamScoreboardResource($team2, $this->id),
                'points' => $this->team2Points(),
                'comments' => $this->team2_comments
            ]
        ];
    }
}
