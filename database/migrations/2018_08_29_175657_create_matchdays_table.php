<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMatchdaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matchdays', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('date');
            $table->unsignedTinyInteger('number');
            $table->unsignedTinyInteger('season_id');
            $table->boolean('red_pin')->default(false);
            $table->boolean('virtual')->default(false);
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
        Schema::dropIfExists('matchdays');
    }
}
