<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class IncomingMatchResource extends JsonResource
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
            'team1' => [
                'name' => $this->team1()->name(),
                'category' => $this->team1CategoryName(),
                'laneNumber' => $this->team1_lane,
            ],

            'team2' => [
                'name' => $this->team2()->name(),
                'category' => $this->team2CategoryName(),
                'laneNumber' => $this->team2_lane,
            ]
        ];
    }
}
