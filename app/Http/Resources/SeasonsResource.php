<?php

namespace App\Http\Resources;

use App\Season;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $seasons = [];
        foreach (Season::all()->sort() as $season) {
            $seasons[$season->id] = [
                'id' => $season->id,
                'name' => $season->name,
                'year' => $season->year
            ];
        }
        return $seasons;
    }
}
