<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatchdaysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $date = Carbon::createFromTimeString('2018-06-13 00:00:00');
        for($i = 1; $i <= 8; $i++){
            DB::table('matchdays')->insert([
                'number' => $i,
                'date' => $date,
                'season_id' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);

            if ($i != 4) {
                $date = $date->addWeek();
            }
        }
    }
}
