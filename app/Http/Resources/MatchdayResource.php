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
        return [
            'number' => $this->number,
            'date' => Carbon::createFromTimeString($this->date)->format('d/m/Y'),
            'redPin' => $this->red_pin == 1,
            'virtual' => $this->virtual == 1
        ];

    }
}
