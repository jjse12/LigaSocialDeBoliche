<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateNewGameScoresRequest;
use App\Http\Requests\ScoreStoreRequest;
use App\Http\Requests\ScoreUpdateRequest;
use App\Http\Resources\CreateNewGameScoresResource;
use App\Http\Resources\ScoreResource;
use App\Score;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Psy\Util\Json;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class ScoreController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->except('show, storeMatchNewGameScores');
    }

    public function show(Score $score): JsonResponse {
        return response()->json(new ScoreResource($score));
    }

    public function storeMatchNewGameScores(CreateNewGameScoresRequest $request): JsonResponse {
        return response()->json(new CreateNewGameScoresResource($request));
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
        $updated = $score->update($scoreRequest->all());
        if (!$updated)
            throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');

        $player = $score->seasonPlayer();
        if ($player->handicap() === null){
            $gameHandicap = $player->handicap(false);
            //TODO: Find if there is a DB startTransaction sentence
            foreach ($player->matchScores($score->match_id) as $matchScore) {
                $matchScore->handicap = $gameHandicap;
                $updated = $updated && $matchScore->update();
            }

            if (!$updated){
                //TODO: Find if there is a DB rollBackTransaction sentence
                throw new ServiceUnavailableHttpException(null, 'Ocurrió un error al intentar actualizar la base de datos.');
            }
            //TODO: Find if there is a DB endTransaction sentence
        }
        return response()->json($score);
    }

    public function delete(Score $score): JsonResponse {
        $score->delete();
        return response()->json();
    }
}
