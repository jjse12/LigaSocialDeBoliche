<?php

use App\Player;
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


Route::group(['prefix' => 'player'], function() {
    Route::get('/auth-player', 'PlayerController@authenticatedPlayer');
    Route::get('/{player}', 'PlayerController@show');
});


// Season and SeasonTeam related routes
Route::group(['prefix' => 'season'], function() {

    // SeasonTeam routes

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

Route::group(['prefix' => 'season-team'], function() {
    Route::group(['prefix' => '/{seasonTeam}'], function() {
        Route::get('/players', 'SeasonTeamController@players');
    });
});

Route::group(['prefix' => 'team'], function() {
//    Route::group(['prefix' => '/{seasonTeam}'], function() {
//        Route::get('/players', 'SeasonTeamController@players');
//    });
});

Route::group(['prefix' => 'match'], function() {
    Route::group(['prefix' => '/{match}'], function() {
        Route::get('/results', 'MatchController@results');
        Route::get('/scoreboards', 'MatchController@scoreboards');
        Route::get('/scores', 'MatchController@scores');

        Route::get('/player/{player}/season-team-id', 'MatchController@playerSeasonTeamId');

        Route::group(['prefix' => '/season-team/{seasonTeam}'], function() {
            Route::get('/scoreboard', 'MatchController@seasonTeamScoreboard');
            Route::get('/available-players', 'MatchController@seasonTeamAvailablePlayers');
        });
    });
    Route::post('season-team-end-phase', 'MatchController@seasonTeamEndPhase');
});


Route::group(['prefix' => 'score'], function () {
    Route::get('/{score}', 'ScoreController@show');
    Route::post('/', 'ScoreController@store');
    Route::patch('/', 'ScoreController@update');
    Route::delete('/{score}', 'ScoreController@delete');
});
