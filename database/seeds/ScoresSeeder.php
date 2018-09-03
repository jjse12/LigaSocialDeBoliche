<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;

use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class ScoresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $t1 = App\Match::first()->team1();
        $t2 = App\Match::first()->team2();

        $p1 = $t1->players();
        $p2 = $t2->players();

        $fake = Faker::create('es_ES');
        for($i = 1; $i <= 3; $i++){
            foreach ($p1 as $p) {
                DB::table('scores')->insert([
                    'season_player_id' => $p->id,
                    'match_id' => 1,
                    'game_number' => $i,
                    'score' => rand(160, 220),
                    'handicap' => rand(0, 25),
                    'score_handicap' => rand(160, 235),
                    'created_at' => Carbon::now()->format('Y-m-d H:i:s')
                ]);
            }

            foreach ($p2 as $p) {
                DB::table('scores')->insert([
                    'season_player_id' => $p->id,
                    'match_id' => 1,
                    'game_number' => $i,
                    'score' => rand(120, 170),
                    'handicap' => rand(30, 70),
                    'score_handicap' => rand(150, 190),
                    'created_at' => Carbon::now()->format('Y-m-d H:i:s')
                ]);
            }
        }
    }
}
