<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
//        if (auth()->check())
//            //dd(auth()->user()->name);
//            return view('layouts.app')->with([
//                'admin' => auth()->user()->owner,
//                'nombre' => auth()->user()->name
//            ]);
        return view('layouts.app');
    }

    public function redirectApp(){
        return redirect()->route('home');
    }
}
