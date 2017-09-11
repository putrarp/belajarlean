<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'PagesController@index');
Route::get('/training', 'PagesController@training');
Route::get('/training/lean', 'PagesController@lean');
Route::get('/kanboard', function () {
    //return view('welcome');
    return redirect()->away('http://127.0.0.1/belajarlean/kanboard');
});