<?php

namespace App\Http\Controllers;

use App\Match;
use Illuminate\Http\Request;


class MatchController extends Controller
{
    //
    public function scores(Request $request){
        return response()->json(Match::find($request->id)->scores());
    }
}
