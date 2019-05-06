<?php

namespace App\Http\Controllers;

use App\Http\Resources\MatchdayResource;
use App\Http\Resources\MatchesResources;
use App\Http\Resources\SeasonCategoryTeamsScoreboardResource;
use App\Http\Resources\SeasonsResource;
use App\Season;
use App\TeamCategory;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeasonController extends Controller
{

    public function index(): JsonResponse {
        return response()->json(new SeasonsResource(null));
    }

    public function currentSeason(): JsonResponse {
        return response()->json(Season::currentSeason());
    }

    public function currentSeasonMatchdays(Request $request): JsonResponse {
        $currentSeason = Season::currentSeason();
        $withMatches = $request->get('withMatches') === 'true';
        $matchdays = [];
        foreach ($currentSeason->matchdays() as $matchday) {
            $matchdays[$matchday->number] = new MatchdayResource($matchday, $withMatches);
        }
        return response()->json($matchdays);
    }

    public function currentSeasonNextMatchday(): JsonResponse {
        //TODO: check if current season is still active and with matches to play
        $matchday = Season::currentSeason()->nextMatchday();
        return response()->json($matchday ? new MatchdayResource($matchday) : null);
    }

    public function currentSeasonNextMatchdayMatches(): JsonResponse {
        //TODO: check if current season is still active and with matches to play
        $matchday = Season::currentSeason()->nextMatchday();
        return response()->json($matchday ? new MatchesResources($matchday) : null);
    }

    public function matchdays(Season $season): JsonResponse {
        $matchdays = [];
        foreach ($season->matchdays() as $matchday) {
            $matchdays[$matchday->number] = new MatchdayResource($matchday);
        }
        return response()->json($matchdays);
    }

    public function categoryScoreboard(Season $season, int $categoryId): JsonResponse{
        return response()->json(new SeasonCategoryTeamsScoreboardResource($season, $categoryId));
    }

    public function allCategoriesScoreboards(Season $season): JsonResponse {

        $results = [];
        foreach (TeamCategory::all() as $category){
            $results[$category->name] = new SeasonCategoryTeamsScoreboardResource($season, $category->id);
        }

        return response()->json($results);
    }
}
