<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchdayResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $matches = new NextMatchdayMatchesResource($this);
        return [
            'info' => [
                'number' => $this->number,
                'date' => Carbon::createFromTimeString($this->date)->format('d/m/Y'),
                'isRedPinGame' => $this->red_pin == 1,
                'isVirtualGame' => $this->virtual == 1,
            ],
            'matches' => $matches
        ];

    }
}
