<?php

use App\Http\Controllers\AcceptanceController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FundController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('acceptances/suggestions', [AcceptanceController::class, 'getRisSuggestions']);
    Route::get('categories/suggestions', [CategoryController::class, 'getCategorySuggestions']);
    Route::get('offices/suggestions', [OfficeController::class, 'getOfficeSuggestions']);
    Route::get('items/suggestions', [ItemController::class, 'getItemSuggestions']);
    Route::get('funds/suggestions', [FundController::class, 'getFundSuggestions']);
    
    Route::get('acceptances/get-by-ris', [AcceptanceController::class, 'getDataByRIS']);

    Route::resource('categories', CategoryController::class);
    Route::resource('funds', FundController::class);
    Route::resource('offices', OfficeController::class);
    Route::resource('items', ItemController::class);
    Route::resource('acceptances', AcceptanceController::class);
    Route::resource('reports', ReportController::class);
    Route::resource('users',UserController::class);
    // Route::resource('users',UserController::class)->middleware('role:admin');
    // Route::resource('categories', CategoryController::class)->middleware('can:categories');
    
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
