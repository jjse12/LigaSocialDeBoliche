<?php

namespace App\Http\Resources;

use App\Matchday;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchdayResource extends JsonResource
{
    /** @var bool $withMatches */
    private $withMatches;

    public function __construct(Matchday $matchday, bool $withMatches = false)
    {
        $this->withMatches = $withMatches;
        parent::__construct($matchday);
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $result = [
            'info' => [
                'id' => $this->id,
                'number' => $this->number,
                'date' => Carbon::createFromTimeString($this->date)->format('d/m/Y'),
                'isRedPinGame' => $this->red_pin === 1,
                'isVirtualGame' => $this->virtual === 1,
            ]
        ];
        if ($this->withMatches) $result['matches'] = new MatchesResources($this);
        return $result;
    }
}
