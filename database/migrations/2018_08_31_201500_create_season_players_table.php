<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeasonPlayersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('season_players', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->unsignedSmallInteger('player_id');
            $table->unsignedSmallInteger('season_team_id');
            $table->unsignedTinyInteger('category_id');
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
        Schema::dropIfExists('season_players');
    }
}
