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
        DB::table('players')->insert([
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'gender' => 'M',
            'first_name' => 'Jenner',
            'last_name' => 'Sánchez Estrada',
            'email' => 'sanchezjenner@hotmail.com',
            'phone' => '50199703',
            'birthday' => '1994-07-12',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('players')->insert([
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'gender' => 'M',
            'first_name' => 'Kevin',
            'last_name' => 'Sánchez Estrada',
            'email' => 'chevyn_8@hotmail.com',
            'phone' => '33120964',
            'birthday' => '1989-12-08',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('players')->insert([
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'gender' => 'F',
            'first_name' => 'Sofia',
            'last_name' => 'Sánchez Estrada',
            'email' => 'amysofia1234@hotmail.com',
            'phone' => '12730534',
            'birthday' => '2001-02-03',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('players')->insert([
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'gender' => 'M',
            'first_name' => 'Orlando',
            'last_name' => 'Sánchez De Leon',
            'email' => 'osanchez@bytews.com',
            'phone' => '57040544',
            'birthday' => '1962-08-11',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('players')->insert([
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'gender' => 'M',
            'first_name' => 'Guillermo',
            'last_name' => 'Abate',
            'email' => 'memo-abate@gmail.com',
            'phone' => '58371021',
            'birthday' => '1980-03-15',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('players')->insert([
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'gender' => 'M',
            'first_name' => 'Julio',
            'last_name' => 'Roa',
            'email' => 'julioroa@hotmail.com',
            'phone' => '55551530',
            'birthday' => '1954-01-19',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('players')->insert([
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'gender' => 'F',
            'first_name' => 'Perla',
            'last_name' => 'Quinto',
            'email' => 'perlaquinto123@hotmail.com',
            'phone' => '25412524',
            'birthday' => '1993-04-24',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        for ($i = 0; $i < 138; $i++){
            $fake = Faker::create('es_ES');
            $gender = $fake->randomElement(['M', 'F', 'M']);
            DB::table('players')->insert([
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'gender' => $gender,
                'first_name' => $gender == 'M' ? $fake->firstNameMale : $fake->firstNameFemale,
                'last_name' => $fake->lastName,
                'email' => $fake->email,
                'phone' => $fake->phoneNumber,
                'birthday' => $fake->dateTime,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }
    }
}
