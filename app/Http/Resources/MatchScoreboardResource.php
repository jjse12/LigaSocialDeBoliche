<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchScoreboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $team1 = $this->team1();
        $team2 = $this->team2();
        $date = Carbon::createFromTimeString($this->matchday()->date);
//        $date->subDays(9);
//        $date->subHours(16);
//        $date->addMinutes(9);
        $today = Carbon::now();
        $minutesDiff = $today->diffInMinutes($date, false);
        $statusInfo = [];
        if ($minutesDiff > 0){
            $statusInfo['status'] = 'Sin Comenzar';
            if ($minutesDiff >= 60){
                $hoursDiff = $today->diffInHours($date, false);
                if ($hoursDiff >= 24) {
                    $daysDiff = $today->diffInDays($date, false);
                    $statusInfo['timeUnit'] = 'days';
                    $statusInfo['daysRemaining'] = $daysDiff;
                } else {
                    $statusInfo['timeUnit'] = 'hours';
                    $statusInfo['hoursRemaining'] = $hoursDiff;
                    if ($hoursDiff < 4){
                        $statusInfo['minutesRemaining'] = $minutesDiff - $hoursDiff*60;
                    }
                }
            }
            else {
                $statusInfo['timeUnit'] = 'minutes';
                $statusInfo['minutesRemaining'] = $minutesDiff;
            }
        } else if ($this->team1_games_confirmed == 3 &&
                $this->team2_games_confirmed == 3) {
            $statusInfo = [
                'status' => 'Finalizado'
            ];
        } else {
            $statusInfo = [
                'status' => 'En Progreso'
            ];
        }

        return [
            'status' => $statusInfo,
            'date' => $date->format('d/M/Y'),
            'matchdayNumber' => $this->matchday()->number,
            'redPin' => $this->matchday()->red_pin,
            'virtual' => $this->matchday()->virtual,
            'team1' => [
                'data' => [
                    'id' => $team1->id,
                    'name' => $team1->name(),
                    'laneNumber' => $this->team1_lane,
                    'gamesConfirmed' => $this->team1_games_confirmed,
                    'comments' => $this->team1_comments
                ],
                'points' => $this->team1Points(),
                'results' => new MatchTeamScoreboardResource($team1, $this->id),
            ],
            'team2' => [
                'data' => [
                    'id' => $team2->id,
                    'name' => $team2->name(),
                    'laneNumber' => $this->team2_lane,
                    'gamesConfirmed' => $this->team2_games_confirmed,
                    'comments' => $this->team2_comments
                ],
                'points' => $this->team2Points(),
                'results' => new MatchTeamScoreboardResource($team2, $this->id),
            ]
        ];
    }
}
