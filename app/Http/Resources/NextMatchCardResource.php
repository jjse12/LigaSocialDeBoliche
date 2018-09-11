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
            'team1Category' => $this->team1Lane(),
            'team2Category' => $this->team2Lane(),
            'team1Lane' => $this->team1Lane(),
            'team2Lane' => $this->team2Lane()
        ];
    }
}
