<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('team_categories')->insert([
            [
                'name' => 'AA',
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'name' => 'A',
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'name' => 'B',
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ]
        ]);
    }

}
