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
            $table->unsignedTinyInteger('game_number');
            $table->unsignedTinyInteger('turn_number');
            $table->unsignedSmallInteger('score');
            $table->unsignedTinyInteger('handicap');
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
