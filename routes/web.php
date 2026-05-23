<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\QuizController;
use App\Http\Controllers\LobbyController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Quiz CRUD
    Route::resource('quizzes', QuizController::class);

    // Quiz Questions CRUD
    Route::get('quizzes/{quiz}/questions', [QuizController::class, 'manageQuestions'])->name('quizzes.questions.manage');
    Route::post('quizzes/{quiz}/questions', [QuizController::class, 'storeQuestion'])->name('quizzes.questions.store');
    Route::put('quizzes/{quiz}/questions/{question}', [QuizController::class, 'updateQuestion'])->name('quizzes.questions.update');
    Route::delete('quizzes/{quiz}/questions/{question}', [QuizController::class, 'destroyQuestion'])->name('quizzes.questions.destroy');

    // Lobby Routes
    Route::get('lobbies', [LobbyController::class, 'index'])->name('lobbies.index');
    Route::get('lobbies/create', [LobbyController::class, 'create'])->name('lobbies.create');
    Route::post('lobbies', [LobbyController::class, 'store'])->name('lobbies.store');
    Route::get('lobbies/{pin}/host', [LobbyController::class, 'host'])->name('lobbies.host');
});

require __DIR__.'/settings.php';
