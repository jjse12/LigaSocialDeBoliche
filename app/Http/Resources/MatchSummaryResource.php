<?php

namespace App\Http\Resources;

use App\Matchday;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchSummaryResource extends JsonResource
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
        $matchday = $this->matchday();
        return [
            'id' => $this->id,
            'statusData' => $statusData,
            'date' => $matchday->date,
            'matchdayNumber' => $matchday->number,
            'isRedPinGame' => $matchday->red_pin === 1,
            'isVirtualGame' => $matchday->virtual === 1,
            'results' => [
                'team1' => [
                    'name' => $this->team1Name(),
                    'category' => $this->team1CategoryName(),
                    'points' => $this->team1Points(),
                    'pins' => $this->team1PinTotal(),
                    'lane' => $this->team1_lane,
                ],
                'team2' => [
                    'name' => $this->team2Name(),
                    'category' => $this->team2CategoryName(),
                    'points' => $this->team2Points(),
                    'pins' => $this->team2PinTotal(),
                    'lane' => $this->team2_lane,
                ],
            ]
        ];
    }
}
