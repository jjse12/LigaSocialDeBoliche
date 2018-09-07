<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScoreStoreRequest;
use App\Score;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    /**
     * Store a new score.
     *
     * @param  Request  $score
     * @return JsonResponse
     */
    public function store(ScoreStoreRequest $score){
        $newScore = Score::create($score->all());
        return response()->json($newScore, 201);
    }
}
