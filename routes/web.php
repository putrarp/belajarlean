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
Route::get('/training/tpm', 'PagesController@tpm');
Route::get('/training/sixsigma', 'PagesController@sixsigma');
Route::get('/training/apps', 'PagesController@crossword');
Route::get('/kanboard', function () {
    //return view('welcome');
    return redirect()->away('http://belajarlean.com/kanboard/');
});
Route::get('/crossword/lean1', function () {
    //return view('welcome');
    return redirect()->away('http://belajarlean.com/crossword/?puzzle=lean1');
});
Route::get('/crossword/lean2', function () {
    //return view('welcome');
    return redirect()->away('http://belajarlean.com/crossword/?puzzle=lean2');
});
