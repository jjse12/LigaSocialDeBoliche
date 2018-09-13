<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SeasonsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('seasons')->insert([
            [
                'year' => '2018',
                'name' => 'Torneo de Invierno 2018',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]]);
        /*,
            [
                'year' => '2019',
                'name' => 'Torneo de Verano 2019',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ],
            [
                'year' => '2019',
                'name' => 'Torneo de Invierno 2019',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]
        ]);*/
    }
}
