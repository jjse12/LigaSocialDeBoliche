<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
        $this->app->bind(Carbon::class, function () {

            return new Carbon('CST');
            /*
            $tokenClient = new TokenClient();

            return new Client(['headers' => [
                'Authorization' => 'Bearer ' . $tokenClient->getToken(),
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],'base_uri' => env('CUSTOMER_URI'), 'verify' => env('ENABLE_CLIENT_SSL_VERIFICATION')]);*/

        });
    }
}
