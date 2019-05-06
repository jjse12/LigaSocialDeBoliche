<?php

namespace App\Http\Resources;

use App\SeasonTeam;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonTeamInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
//        $players = new SeasonTeamPlayersResource($this->resource);
        return [
            'name' => $this->name(),
            'category' => $this->categoryName(),
            'points' => $this->point_score,
            'pins' => $this->pin_score,
//            'players' => $players
        ];
    }
}
