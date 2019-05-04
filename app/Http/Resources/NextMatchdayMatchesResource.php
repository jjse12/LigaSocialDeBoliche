<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NextMatchdayMatchesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $result = [];
        foreach ($this->matches()->sortBy('team1_lane') as $match) {
            $result[] = new NextMatchCardResource($match);
        }
        return $result;
    }
}
