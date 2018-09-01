<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class PlayersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 0; $i < 125; $i++){
            $fake = Faker::create('es_ES');
            DB::table('players')->insert([
                'name' => $fake->firstName,
                'last_name' => $fake->lastName,
                'email' => $fake->email,
                'phone' => $fake->phoneNumber,
                'birthday' => $fake->dateTime,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }
    }
}
