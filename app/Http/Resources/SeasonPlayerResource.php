<?php

namespace App\Http\Resources;

use App\SeasonPlayer;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonPlayerResource extends JsonResource
{
    private $withUnconcludedData;
    /*TODO: Include condition for retrieving player information for creating new game scores
        This, implies that handicap should be retrieved not taking in count the current game.
    */
    public function __construct(SeasonPlayer $seasonPlayer, bool $withUnconcludedData = false)
    {
        $this->withUnconcludedData= $withUnconcludedData;
        parent::__construct($seasonPlayer);
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'fullName' => $this->fullName(),
            'gender' => $this->gender(),
            'category' => $this->categoryName(),
            'gamesPlayed' => $this->gamesPlayed(),
            'pinTotal' => $this->pinTotal(),
            'average' => $this->average(),
            'handicap' => $this->handicap(),
            'unconcluded' => $this->withUnconcludedData ? [
                'gamesPlayed' => $this->gamesPlayed(false),
                'pinTotal' => $this->pinTotal(false),
                'average' => $this->average(false),
                'handicap' => $this->handicap(false),
            ] : null
        ];
    }
}
