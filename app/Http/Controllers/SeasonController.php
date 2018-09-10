<?php

namespace App\Http\Controllers;

use App\Http\Resources\SeasonCategoryTeamsScoreBoardResource;
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

    public function categoryScoreBoard(int $seasonId, int $categoryId): JsonResponse{
        return response()->json(new SeasonCategoryTeamsScoreBoardResource(Season::find($seasonId), $categoryId));
    }

    public function allCategoriesScoreBoards(int $seasonId): JsonResponse {

        $results = [];
        foreach (TeamCategory::all() as $category){
            $results[$category->name] = new SeasonCategoryTeamsScoreBoardResource(Season::find($seasonId), $category->id);
        }

        return response()->json($results);
    }
}
