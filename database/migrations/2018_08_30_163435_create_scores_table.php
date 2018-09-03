<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedTinyInteger('season_player_id');
            $table->unsignedSmallInteger('match_id');
            $table->unsignedSmallInteger('game_number');
            $table->unsignedSmallInteger('score');
            $table->unsignedTinyInteger('handicap');
            $table->unsignedSmallInteger('score_handicap');
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
        Schema::dropIfExists('scores');
    }
}
