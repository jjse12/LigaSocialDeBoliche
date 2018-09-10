<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NextMatchCardResource extends JsonResource
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
            'team1' => $this->team1()->name(),
            'team2' => $this->team2()->name(),
            'team1_lane' => $this->team1Lane(),
            'team2_lane' => $this->team2Lane()
        ];
    }
}
