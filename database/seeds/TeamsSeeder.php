<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class TeamsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i <= 24; $i++){
            DB::table('teams')->insert([
                'name' => Faker::create('es_ES')->company,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ]);
        }
        $ch = App\Team::first();
        $ch->name = "Chiribiscos Bowling";
        $ch->update();
    }
}
