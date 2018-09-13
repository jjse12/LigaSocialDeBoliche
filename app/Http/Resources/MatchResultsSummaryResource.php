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
            'team1Points' => $this->team1Points(),
            'team2Points' => $this->team2Points(),
            'team1Pins' => $this->team1PinTotal(),
            'team2Pins' => $this->team2PinTotal(),
            'team1Lane' => $this->team1_lane,
            'team2Lane' => $this->team2_lane,
        ];
    }
}
