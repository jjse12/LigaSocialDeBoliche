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

    public function get(int $id): JsonResponse {
        return new MatchResultsSummaryResource(Match::find($id));
    }

    public function scores(Request $request): JsonResponse {
        return response()->json(Match::find($request->id)->scores());
    }

    public function teamScoreboard(int $matchId, int $seasonTeamId): JsonResponse {
        return response()->json(new MatchTeamScoreboardResource(SeasonTeam::find($matchId), $seasonTeamId));
    }

    public function scoreboards(int $id): JsonResponse {
        return response()->json(new MatchScoreboardResource(Match::find($id)));
    }
}
