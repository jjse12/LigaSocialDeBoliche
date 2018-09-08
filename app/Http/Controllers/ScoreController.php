<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScoreStoreRequest;
use App\Http\Resources\ScoreResource;
use App\Score;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScoreController extends Controller
{

    public function get(int $id){
        return new ScoreResource(Score::find($id));
    }

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
