<?php

namespace App\Http\Resources;

use App\SeasonPlayer;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonPlayerResource extends JsonResource
{
    private $onlyConcludedMatchesHandicap;
    /*TODO: Include condition for retrieving player information for creating new game scores
        This, implies that handicap should be retrieved not taking in count the current game.
    */
    public function __construct(SeasonPlayer $seasonPlayer, bool $newMatchHandicap = false)
    {
        $this->onlyConcludedMatchesHandicap = $newMatchHandicap;
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
            'gamesPlayed' => $this->gamesPlayed($this->onlyConcludedMatchesHandicap),
            'pinTotal' => $this->pinTotal($this->onlyConcludedMatchesHandicap),
            'average' => $this->average($this->onlyConcludedMatchesHandicap),
            'handicap' => $this->handicap($this->onlyConcludedMatchesHandicap),
        ];
    }
}
