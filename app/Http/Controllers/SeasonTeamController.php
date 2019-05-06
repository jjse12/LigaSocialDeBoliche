<?php

namespace App\Http\Controllers;

use App\Http\Resources\SeasonTeamInfoResource;
use App\Http\Resources\SeasonTeamPlayersResource;
use App\SeasonTeam;
use Illuminate\Http\JsonResponse;

class SeasonTeamController extends Controller
{
    public function team(SeasonTeam $seasonTeam): JsonResponse{
        return response()->json(new SeasonTeamInfoResource($seasonTeam));
    }

    public function players(SeasonTeam $seasonTeam): JsonResponse {
        return response()->json(new SeasonTeamPlayersResource($seasonTeam));
    }
}
