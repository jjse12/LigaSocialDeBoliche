<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlayerCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('player_categories')->insert([
            [
                'name' => 'AA',
                'males_min' => 185,
                'males_max' => 255,
                'females_min' => 165,
                'females_max' => 255,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'name' => 'A',
                'males_min' => 155,
                'males_max' => 185,
                'females_min' => 135,
                'females_max' => 165,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'name' => 'B',
                'males_min' => 135,
                'males_max' => 155,
                'females_min' => 125,
                'females_max' => 135,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ],
            [
                'name' => 'C',
                'males_min' => 0,
                'males_max' => 135,
                'females_min' => 0,
                'females_max' => 125,
                'created_at' => Carbon::now(config('CARBON_TIMEZONE', 'CST'))->format('Y-m-d H:i:s')
            ]
        ]);
    }
}
