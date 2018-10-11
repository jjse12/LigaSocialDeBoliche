<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMatchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->unsignedSmallInteger('matchday_id');
            $table->unsignedSmallInteger('season_team1_id');
            $table->unsignedSmallInteger('season_team2_id');
            $table->unsignedTinyInteger('team1_lane');
            $table->unsignedTinyInteger('team2_lane');
            $table->tinyInteger('team1_games_confirmed')->default(null)->nullable();
            $table->tinyInteger('team2_games_confirmed')->default(null)->nullable();
            $table->mediumText('team1_comments')->default(null)->nullable();
            $table->mediumText('team2_comments')->default(null)->nullable();
            $table->boolean('concluded')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('matches');
    }
}
