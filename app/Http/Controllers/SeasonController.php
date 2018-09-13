<?php

namespace App\Http\Controllers;

use App\Http\Resources\MatchdayResource;
use App\Http\Resources\NextMatchdayMatchesResource;
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

    public function matchdays(int $id): JsonResponse {
        $matchdays = [];
        foreach (Season::find($id)->matchdays() as $matchday) {
            $matchdays[$matchday->number] = new MatchdayResource($matchday);
        }
        return response()->json($matchdays);
    }

    public function nextMatchday(): JsonResponse {
        //TODO: check if current season is still active and with matches to play
        return response()->json(new MatchdayResource(Season::currentSeason()->nextMatchday()));
    }

    public function nextMatchdayMatches(): JsonResponse {
        //TODO: check if current season is still active and with matches to play
        return response()->json(new NextMatchdayMatchesResource(Season::currentSeason()->nextMatchday()));
    }

    public function categoryScoreboard(int $seasonId, int $categoryId): JsonResponse{
        return response()->json(new SeasonCategoryTeamsScoreboardResource(Season::find($seasonId), $categoryId));
    }

    public function allCategoriesScoreboards(int $seasonId): JsonResponse {

        $results = [];
        foreach (TeamCategory::all() as $category){
            $results[$category->name] = new SeasonCategoryTeamsScoreboardResource(Season::find($seasonId), $category->id);
        }

        return response()->json($results);
    }
}
