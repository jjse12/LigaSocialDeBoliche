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
        foreach (Season::all() as $season) {
            $seasons[$season->name] = $season->year;
        }
        return $seasons;
    }
}
