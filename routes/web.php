<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\QuizController;

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
});

require __DIR__.'/settings.php';
