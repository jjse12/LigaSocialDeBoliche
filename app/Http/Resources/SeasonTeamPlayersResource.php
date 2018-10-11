<?php

namespace App\Http\Resources;

use App\SeasonTeam;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonTeamPlayersResource extends JsonResource
{
    private $onlyConcludedMatchesHandicaps;

    public function __construct(SeasonTeam $SeasonTeam, bool $onlyConcludedMatchesHandicaps = false)
    {
        $this->onlyConcludedMatchesHandicaps = $onlyConcludedMatchesHandicaps;
        parent::__construct($SeasonTeam);
    }
    
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $result = [];
        foreach ($this->seasonPlayers() as $player) {
            array_push($result,
                (new SeasonPlayerResource($player, $this->onlyConcludedMatchesHandicaps))->toArray(null));
        }
        return $result;
    }
}
