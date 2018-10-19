<?php

namespace App\Http\Resources;

use App\SeasonTeam;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonTeamPlayersResource extends JsonResource
{
    private $withUnconcludedData;

    public function __construct(SeasonTeam $SeasonTeam, bool $withUnconcludedData = false)
    {
        $this->withUnconcludedData = $withUnconcludedData;
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
                (new SeasonPlayerResource($player, $this->withUnconcludedData))->toArray(null));
        }
        return $result;
    }
}
