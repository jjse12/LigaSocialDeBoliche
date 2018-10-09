<?php

namespace App\Http\Controllers;

use App\Http\Requests\MatchSeasonTeamEndPhaseRequest;
use App\Http\Resources\MatchResultsSummaryResource;
use App\Http\Resources\MatchScoreboardResource;
use App\Http\Resources\MatchTeamScoreboardResource;
use App\Http\Resources\MatchSeasonTeamEndPhaseResource;
use App\Http\Resources\SeasonTeamPlayersResource;
use App\Match;
use App\Player;
use App\SeasonTeam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


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

    public function playerSeasonTeamId(Match $match, Player $player): JsonResponse {
        $team1 = $match->team1();
        if ($team1->hasPlayer($player->id))
            return response()->json(['seasonTeamId' => $team1->id]);

        $team2 = $match->team2();
        if ($team2->hasPlayer($player->id))
            return response()->json(['seasonTeamId' => $team2->id]);

        return response()->json(['seasonTeamId' => 0]);
    }

    public function seasonTeamEndPhase(MatchSeasonTeamEndPhaseRequest $request): JsonResponse {

        return response()->json(new MatchSeasonTeamEndPhaseResource($request));
    }

    // Get a team's available players (those whom have not played any game yet in the current match)
    public function seasonTeamAvailablePlayers(Match $match, SeasonTeam $seasonTeam): JsonResponse {
        $players = new SeasonTeamPlayersResource($seasonTeam);
        $playersId = $match->scores()->pluck('season_player_id')->toArray();
        $availablePlayers = [];
        foreach ($players->toArray(null) as $player) {
            if (!in_array($player['id'], $playersId)){
                array_push($availablePlayers, $player);
            }
        }

        return response()->json($availablePlayers);
    }
}
