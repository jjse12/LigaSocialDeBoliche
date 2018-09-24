<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SeasonPlayersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //


        DB::table('season_players')->insert([
            'player_id' => 1,
            'season_team_id' => 1,
            'category_id' => 2,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('season_players')->insert([
            'player_id' => 2,
            'season_team_id' => 1,
            'category_id' => 1,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('season_players')->insert([
            'player_id' => 3,
            'season_team_id' => 1,
            'category_id' => 1,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('season_players')->insert([
            'player_id' => 4,
            'season_team_id' => 1,
            'category_id' => 2,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('season_players')->insert([
            'player_id' => 5,
            'season_team_id' => 1,
            'category_id' => 2,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('season_players')->insert([
            'player_id' => 6,
            'season_team_id' => 1,
            'category_id' => 2,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        $team = 2;
        for($i = 7; $i <= 144; $i++){
            DB::table('season_players')->insert([
                'player_id' => $i,
                'season_team_id' => $team,
                'category_id' => rand(1,4),
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);

            if ($i % 6 == 0)
                $team++;
        }
    }
}
