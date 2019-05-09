<?php

namespace App\Http\Controllers;

use App\Http\Requests\MatchTeamEndPhaseRequest;
use App\Http\Resources\MatchSummaryResource;
use App\Http\Resources\MatchResultsSummaryResource;
use App\Http\Resources\MatchScoreboardResource;
use App\Http\Resources\MatchTeamAvailablePlayersResource;
use App\Http\Resources\MatchTeamLastGamePlayersResource;
use App\Http\Resources\MatchTeamScoreboardResource;
use App\Http\Resources\MatchSeasonTeamEndPhaseResource;
use App\Match;
use App\Player;
use App\SeasonTeam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class MatchController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api')->only('teamEndPhase');
    }

    public function summary(Match $match): JsonResponse {
        return response()->json(new MatchSummaryResource($match));
    }

    public function scores(Match $match): JsonResponse {
        return response()->json($match->scores());
    }

    public function seasonTeamScoreboard(Match $match, SeasonTeam $seasonTeam): JsonResponse {
        return response()->json(new MatchTeamScoreboardResource($seasonTeam, $match->id));
    }

    public function scoreboards(Match $match): JsonResponse {
        return response()->json(new MatchScoreboardResource($match));
    }

    // Get a team's available players (those whom have not played any game yet in the given match)
    public function seasonTeamAvailablePlayers(Request $request): JsonResponse {
        return response()->json(new MatchTeamAvailablePlayersResource($request));
    }

    public function seasonTeamLastGamePlayers(Request $request): JsonResponse {
        return response()->json(new MatchTeamLastGamePlayersResource($request));
    }

    public function teamEndPhase(MatchTeamEndPhaseRequest $request): JsonResponse {
        return response()->json(new MatchSeasonTeamEndPhaseResource($request));
    }
}
