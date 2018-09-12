let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

const webpackConfig = {
    resolve: {
        alias: {
            services: path.resolve(__dirname, 'resources/assets/js/services'),
            store: path.resolve(__dirname, 'resources/assets/js/store'),
            components: path.resolve(__dirname, 'resources/assets/js/components'),
            reducers: path.resolve(__dirname, 'resources/assets/js/reducers'),
        }
    }
};

mix.js('resources/assets/js/app.jsx', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')
    .webpackConfig(webpackConfig);
