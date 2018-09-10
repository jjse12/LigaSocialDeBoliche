<?php

namespace App\Http\Resources;

use App\Season;
use App\TeamCategory;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonCategoryTeamsScoreBoardResource extends JsonResource
{
    private $categoryId;

    public function __construct(Season $resource, int $categoryId)
    {
        parent::__construct($resource);
        $this->categoryId = $categoryId;
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
        $teamPoints = [];
        $teamPins = [];
        foreach ($this->categoryTeams($this->categoryId) as $categoryTeam) {
            $teamPoints[$categoryTeam->name()] = $categoryTeam->point_score + rand(2,12);
            $teamPins[$categoryTeam->name()] = $categoryTeam->pin_score + rand(600, 12);
        }

        arsort($teamPoints);;
        $result['points'] = $teamPoints;
        arsort($teamPins);
        $result['pins'] = $teamPins;
        return $result;
    }
}
