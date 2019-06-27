<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            TeamsSeeder::class,
            PlayersSeeder::class,
            TeamCategoriesSeeder::class,
            PlayerCategoriesSeeder::class,
            SeasonsSeeder::class,
            MatchdaysSeeder::class,
            SeasonTeamsSeeder::class,
            SeasonPlayersSeeder::class,
            MatchesSeeder::class,
            ScoresSeeder::class,
            OauthClientsSeeder::class,
        ]);
    }
}
