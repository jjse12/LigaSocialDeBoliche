<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'season'], function(){
    Route::group(['prefix' => '/{seasonId}'], function(){
        Route::group(['prefix' => '/scoreboards'], function(){
            Route::get('/category/{categoryId}/', 'SeasonController@categoryScoreboard');
            Route::get('/categories', 'SeasonController@allCategoriesScoreboards');
        });

        Route::get('/matchdays', 'SeasonController@matchdays');
    });

    Route::get('/next-matchday', 'SeasonController@nextMatchday');
    Route::get('/next-matchday-matches', 'SeasonController@nextMatchdayMatches');

    Route::get('/current', 'SeasonController@currentSeason');
    Route::get('/index', 'SeasonController@index');
});


Route::group(['prefix' => 'match'], function(){
    Route::get('/{id}', 'MatchController@get');
    Route::get('/{id}/scores', 'MatchController@scores');
    Route::get('/{id}/scoreboards', 'MatchController@scoreboards');
    Route::get('/{matchId}/scoreboard/team/{seasonTeamId}', 'MatchController@teamScoreboard');
});


Route::group(['prefix' => 'score'], function (){
    Route::get('/{id}', 'ScoreController@get');
    Route::post('/', 'ScoreController@store');
});
