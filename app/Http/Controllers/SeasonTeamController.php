<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeamPlayersResource;
use App\SeasonTeam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeasonTeamController extends Controller
{
    public function players(int $seasonTeamId): JsonResponse {
        return response()->json(new TeamPlayersResource(SeasonTeam::find($seasonTeamId)));
    }
}
