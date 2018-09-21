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

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/test', function (Request $request) {
        return response()->json(['name' => 'test']);
    });
});

Route::group(['prefix' => 'season'], function() {

    Route::get('/current', 'SeasonController@currentSeason');
    Route::get('/next-matchday', 'SeasonController@nextMatchday');
    Route::get('/next-matchday-matches', 'SeasonController@nextMatchdayMatches');

    Route::group(['prefix' => '/{season}'], function() {
        Route::group(['prefix' => '/scoreboards'], function() {
            Route::get('/category/{categoryId}/', 'SeasonController@categoryScoreboard');
            Route::get('/categories', 'SeasonController@allCategoriesScoreboards');
        });

        Route::get('/matchdays', 'SeasonController@matchdays');
    });



    Route::get('/index', 'SeasonController@index');
});

Route::group(['prefix' => 'team'], function() {
    Route::group(['prefix' => '/{seasonTeam}'], function() {
        Route::get('/players', 'SeasonTeamController@players');
    });
});

Route::group(['prefix' => 'match'], function() {
    Route::group(['prefix' => '/{match}'], function() {
        Route::get('/results', 'MatchController@results');
        Route::get('/scoreboards', 'MatchController@scoreboards');
        Route::get('/scoreboard/team/{seasonTeam}', 'MatchController@teamScoreboard');
        Route::get('/scores', 'MatchController@scores');
    });
});


Route::group(['prefix' => 'score'], function () {
    Route::get('/{score}', 'ScoreController@show');
    Route::post('/', 'ScoreController@store');
    Route::patch('/', 'ScoreController@update');
    Route::delete('/{score}', 'ScoreController@delete');
});
