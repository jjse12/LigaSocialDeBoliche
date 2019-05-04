<?php

namespace App\Http\Resources;

use App\Matchday;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $statusData = $this->statusData();
        /* @var Matchday $matchday */
        $matchday = $this->matchday();
        return [
            'statusData' => $statusData,
            'date' => $matchday->date,
            'matchdayNumber' => $matchday->number,
            'isRedPinGame' => $matchday->red_pin,
            'isVirtualGame' => $matchday->virtual,
        ];
    }
}
