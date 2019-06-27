<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OauthClientsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('oauth_clients')->insert([
            [
                'name'                      => 'LigaSocial_OAuth2Client_Postman',
                'user_id'                   => null,
                'secret'                    => 'C7VzeVaBRBHTDifKmQsG76lYZCXtMSDzETEW1qU3',
                'redirect'                  => 'http://localhost',
                'personal_access_client'    => 0,
                'password_client'           => 1,
                'revoked'                   => 0
            ]
        ]);

    }
}
