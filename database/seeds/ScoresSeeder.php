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
            foreach ($p1->toBase()->merge($p2) as $p) {
                $cat = $p->category()->id;
                $handicap = 0;
                $score = 0;
                switch ($cat){
                    case 1:
                        if ($p->player()->gender == 'M'){
                            $score = rand(175, 240);
                            $handicap = rand(0, 15);
                        }
                        else {
                            $score = rand(155, 215);
                            $handicap = rand(0, 25);
                        }
                        break;
                    case 2:
                        if ($p->player()->gender == 'M'){
                            $score = rand(150, 210);
                            $handicap = rand(15, 32);
                        }
                        else {
                            $score = rand(130, 180);
                            $handicap = rand(20, 40);
                        }
                        break;
                    case 3:
                        if ($p->player()->gender == 'M'){
                            $score = rand(125, 165);
                            $handicap = rand(30, 52);
                        }
                        else {
                            $score = rand(115, 145);
                            $handicap = rand(45, 65);
                        }
                        break;
                    case 4:
                        if ($p->player()->gender == 'M'){
                            $score = rand(90, 130);
                            $handicap = rand(55, 80);
                        }
                        else {
                            $score = rand(70, 120);
                            $handicap = rand(65, 80);
                        }
                        break;
                }

                DB::table('scores')->insert([
                    'season_player_id' => $p->id,
                    'match_id' => 1,
                    'game_number' => $i,
                    'score' => $score,
                    'handicap' => $handicap,
                    'score_handicap' => $score + $handicap,
                    'created_at' => Carbon::now()->format('Y-m-d H:i:s')
                ]);
            }
        }
    }
}
