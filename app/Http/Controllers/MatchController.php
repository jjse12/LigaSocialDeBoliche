<?php

namespace App\Http\Controllers;

use App\Http\Resources\MatchResultsSummaryResource;
use App\Http\Resources\MatchScoreboardResource;
use App\Http\Resources\MatchTeamScoreboardResource;
use App\Match;
use App\SeasonTeam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class MatchController extends Controller
{

    public function results(Match $match): JsonResponse {
        return response()->json(new MatchResultsSummaryResource($match));
    }

    public function scores(Match $match): JsonResponse {
        return response()->json($match->scores());
    }

    public function teamScoreboard(Match $match, SeasonTeam $seasonTeam): JsonResponse {
        return response()->json(new MatchTeamScoreboardResource($seasonTeam, $match->id));
    }

    public function scoreboards(Match $match): JsonResponse {
        return response()->json(new MatchScoreboardResource($match));
    }
}
