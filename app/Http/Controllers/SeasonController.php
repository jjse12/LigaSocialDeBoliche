<?php

namespace App\Http\Controllers;

use App\Http\Resources\NextMatchdayMatchesResource;
use App\Http\Resources\SeasonCategoryTeamsScoreboardResource;
use App\Http\Resources\SeasonsResource;
use App\Season;
use App\TeamCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeasonController extends Controller
{

    public function index(): JsonResponse {
        return response()->json(new SeasonsResource(Season::all()));
    }

    public function nextMatchdayMatches(int $id): JsonResponse {
        return response()->json(new NextMatchdayMatchesResource(Season::find($id)->nextMatchday()));
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
