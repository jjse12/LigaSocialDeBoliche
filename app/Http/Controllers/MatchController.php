<?php

namespace App\Http\Controllers;

use App\Http\Resources\MatchResource;
use App\Match;
use Illuminate\Http\Request;


class MatchController extends Controller
{

    public function get(int $id){
        return new MatchResource(Match::find($id));
    }

    public function scores(Request $request){
        return response()->json(Match::find($request->id)->scores());
    }
}
