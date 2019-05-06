<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlayerResource;
use App\Player;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PlayerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function authenticatedPlayer(): JsonResponse {
        return response()->json(new PlayerResource(Auth::user()));
    }

    public function show(Player $player): JsonResponse {
        return response()->json(new PlayerResource($player));
    }
}
