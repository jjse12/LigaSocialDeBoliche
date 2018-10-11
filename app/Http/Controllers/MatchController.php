<?php

namespace App\Http\Controllers;

use App\Http\Requests\MatchSeasonTeamEndPhaseRequest;
use App\Http\Resources\MatchResultsSummaryResource;
use App\Http\Resources\MatchScoreboardResource;
use App\Http\Resources\MatchTeamAvailablePlayersResource;
use App\Http\Resources\MatchTeamScoreboardResource;
use App\Http\Resources\MatchSeasonTeamEndPhaseResource;
use App\Match;
use App\Player;
use App\SeasonTeam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


class MatchController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api')->only('seasonTeamEndPhase');
    }

    public function results(Match $match): JsonResponse {
        return response()->json(new MatchResultsSummaryResource($match));
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

    public function loggedInPlayerSeasonTeamId(Match $match, Player $player): JsonResponse {
        $team = $match->getTeamById($player->seasonPlayer($match->matchday()->season()->id)->seasonTeam()->id);
        if ($team !== null && $team->hasPlayer($player->id))
            return response()->json(['seasonTeamId' => $team->id]);

        return response()->json(['seasonTeamId' => 0]);
    }

    // Get a team's available players (those whom have not played any game yet in the current match)
    public function seasonTeamAvailablePlayers(Request $request): JsonResponse {
        return response()->json(new MatchTeamAvailablePlayersResource($request));
    }

    public function seasonTeamEndPhase(MatchSeasonTeamEndPhaseRequest $request): JsonResponse {
        return response()->json(new MatchSeasonTeamEndPhaseResource($request));
    }
}
