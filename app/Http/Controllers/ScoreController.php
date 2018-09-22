<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScoreStoreRequest;
use App\Http\Requests\ScoreUpdateRequest;
use App\Http\Resources\ScoreResource;
use App\Score;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Psy\Util\Json;

class ScoreController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->except('show');
    }

    public function show(Score $score): JsonResponse {
        return response()->json(new ScoreResource($score));
    }

    /**
     * Store a new score.
     *
     * @param  Request  $score
     * @return JsonResponse
     */
    public function store(ScoreStoreRequest $score): JsonResponse {
        $newScore = Score::create($score->all());
        return response()->json($newScore, 201);
    }

    public function update(ScoreUpdateRequest $scoreRequest): JsonResponse {
        $score = Score::find($scoreRequest->id);
        $score->update($scoreRequest->all());
        $score->save();
        return response()->json($score);
    }

    public function delete(Score $score): JsonResponse {
        $score->delete();
        return response()->json();
    }
}
