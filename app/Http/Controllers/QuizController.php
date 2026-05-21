<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuizRequest;
use App\Http\Requests\QuestionRequest;
use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    /**
     * Display a listing of the quizzes.
     */
    public function index(): Response
    {
        return Inertia::render('quizzes/QuizIndex', [
            'quizzes' => Quiz::withCount('questions')->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new quiz.
     */
    public function create(): Response
    {
        return Inertia::render('quizzes/QuizForm', [
            'quiz' => null,
        ]);
    }

    /**
     * Store a newly created quiz in storage.
     */
    public function store(QuizRequest $request): RedirectResponse
    {
        Quiz::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Paket kuis berhasil dibuat.')
        ]);

        return to_route('quizzes.index');
    }

    /**
     * Show the form for editing the specified quiz.
     */
    public function edit(Quiz $quiz): Response
    {
        return Inertia::render('quizzes/QuizForm', [
            'quiz' => $quiz,
        ]);
    }

    /**
     * Update the specified quiz in storage.
     */
    public function update(QuizRequest $request, Quiz $quiz): RedirectResponse
    {
        $quiz->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Paket kuis berhasil diperbarui.')
        ]);

        return to_route('quizzes.index');
    }

    /**
     * Remove the specified quiz from storage.
     */
    public function destroy(Quiz $quiz): RedirectResponse
    {
        $quiz->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Paket kuis berhasil dihapus.')
        ]);

        return to_route('quizzes.index');
    }

    /**
     * Show the page to manage questions in a quiz.
     */
    public function manageQuestions(Quiz $quiz): Response
    {
        return Inertia::render('quizzes/QuestionBuilder', [
            'quiz' => $quiz,
            'questions' => $quiz->questions()->latest()->get(),
        ]);
    }

    /**
     * Store a newly created question in the quiz.
     */
    public function storeQuestion(QuestionRequest $request, Quiz $quiz): RedirectResponse
    {
        $quiz->questions()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Soal berhasil ditambahkan.')
        ]);

        return back();
    }

    /**
     * Update the specified question in the quiz.
     */
    public function updateQuestion(QuestionRequest $request, Quiz $quiz, Question $question): RedirectResponse
    {
        $question->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Soal berhasil diperbarui.')
        ]);

        return back();
    }

    /**
     * Remove the specified question from the quiz.
     */
    public function destroyQuestion(Quiz $quiz, Question $question): RedirectResponse
    {
        $question->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Soal berhasil dihapus.')
        ]);

        return back();
    }
}
