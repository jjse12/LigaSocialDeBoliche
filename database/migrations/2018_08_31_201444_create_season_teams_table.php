<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeasonTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('season_teams', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->unsignedTinyInteger('team_id');
            $table->unsignedTinyInteger('season_id');
            $table->unsignedTinyInteger('category_id');
            $table->unsignedTinyInteger('point_score');
            $table->unsignedSmallInteger('pin_score');
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
        Schema::dropIfExists('season_teams');
    }
}
