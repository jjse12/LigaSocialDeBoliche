<?php

namespace App\Http\Controllers;

use App\Http\Resources\SeasonTeamPlayersResource;
use App\SeasonTeam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeasonTeamController extends Controller
{
    public function players(SeasonTeam $seasonTeam): JsonResponse {
        return response()->json(new SeasonTeamPlayersResource($seasonTeam));
    }
}
