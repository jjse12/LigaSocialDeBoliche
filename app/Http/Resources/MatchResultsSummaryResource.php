<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MatchResultsSummaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'team1' => $this->team1Name(),
            'team2' => $this->team2Name(),
            'team1_points' => $this->team1Points(),
            'team2_points' => $this->team2Points(),
            'team1_pins' => $this->team1PinTotal(),
            'team2_pins' => $this->team2PinTotal(),
            'team1_lane' => $this->team1_lane,
            'team2_lane' => $this->team2_lane,
        ];
    }
}
