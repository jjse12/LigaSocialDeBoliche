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
        $team = 1;
        for($i = 1; $i <= 32; $i++){
            DB::table('season_players')->insert([
                'player_id' => $i,
                'season_team_id' => $team,
                'category_id' => rand(1,4),
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);

            if ($i % 4 == 0)
                $team++;
        }
    }
}
