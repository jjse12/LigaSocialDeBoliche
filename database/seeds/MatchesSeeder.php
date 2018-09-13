<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatchesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i <= 24; $i++){
            for ($j = 1; $j <= 12; $j++){
                $tid = rand(1,24);
                DB::table('matches')->insert(
                [
                    'matchday_id' => $i,
                    'team1_lane' => ($j*2-1)+4,
                    'team2_lane' => ($j*2-1)+5,
                    'season_team1_id' => $tid,
                    'season_team2_id' => $tid != 24 ? $tid+1 : $tid - 1,
                    'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
                ]);
            }
        }

        $m = \App\Match::first();
        $m->season_team1_id = 1;
        $m->season_team2_id = 2;
        $m->update();
        /*
        DB::table('matches')->insert([
            [
                'matchday_id' => 1,
                'team1_lane' => 3,
                'team2_lane' => 4,
                'season_team1_id' => 1,
                'season_team2_id' => 2,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'matchday_id' => 1,
                'team1_lane' => 5,
                'team2_lane' => 6,
                'season_team1_id' => 3,
                'season_team2_id' => 4,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'matchday_id' => 1,
                'team1_lane' => 7,
                'team2_lane' => 8,
                'season_team1_id' => 5,
                'season_team2_id' => 6,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'matchday_id' => 1,
                'team1_lane' => 9,
                'team2_lane' => 10,
                'season_team1_id' => 7,
                'season_team2_id' => 8,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'matchday_id' => 9,
                'team1_lane' => 3,
                'team2_lane' => 4,
                'season_team1_id' => 9,
                'season_team2_id' => 10,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ]
        ]);
        */
    }
}
