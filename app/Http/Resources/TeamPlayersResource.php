<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TeamPlayersResource extends JsonResource
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
        foreach ($this->players() as $player) {
            array_push($result, [
                'id' => $player->id,
                'fullName' => $player->fullName(),
                'category' => $player->categoryName(),
                'gamesPlayed' => $player->gamesPlayed(),
                'pinTotal' => $player->pinTotal(),
                'average' => $player->average(),
                'handicap' => $player->handicap(),
            ]);
        }
        return $result;
    }
}
