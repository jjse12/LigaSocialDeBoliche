<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SeasonTeamsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for($i = 1; $i <= 24; $i++) {
            DB::table('season_teams')->insert([
                'team_id' => $i,
                'season_id' => 1,
                'category_id' => rand(1, 3),
                'point_score' => 0,
                'pin_score' => 0,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }

        /*
        for($i = 1; $i <= 8; $i++) {
            DB::table('season_teams')->insert([

                'team_id' => $i,
                'season_id' => 2,
                'category_id' => rand(1, 3),
                'point_score' => 0,
                'pin_score' => 0,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }
        for($i = 1; $i <= 8; $i++) {
            DB::table('season_teams')->insert([
                'team_id' => $i,
                'season_id' => 3,
                'category_id' => rand(1, 3),
                'point_score' => 0,
                'pin_score' => 0,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }
        */
        $ch = App\SeasonTeam::first();
        $ch->category_id = 1;
        $ch->point_score = 49;
        $ch->save();
    }
}
