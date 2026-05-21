<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_quizzes()
    {
        $response = $this->get(route('quizzes.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_create_quiz()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('quizzes.store'), [
            'title' => 'Kubernetes Basics',
            'description' => 'A basic quiz on Kubernetes core concepts.',
        ]);

        $response->assertRedirect(route('quizzes.index'));
        $this->assertDatabaseHas('quizzes', [
            'title' => 'Kubernetes Basics',
            'description' => 'A basic quiz on Kubernetes core concepts.',
        ]);
    }

    public function test_quiz_requires_a_title()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('quizzes.store'), [
            'title' => '',
        ]);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_can_add_multiple_choice_question_with_valid_options()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::create([
            'title' => 'Kubernetes Basics',
        ]);

        $response = $this->post(route('quizzes.questions.store', $quiz), [
            'type' => 'multiple_choice',
            'question_text' => 'What is a Pod?',
            'options' => [
                'A' => 'Smallest deployable unit in Kubernetes',
                'B' => 'A package manager',
                'C' => 'A networking bridge',
                'D' => 'A virtual machine manager'
            ],
            'correct_answer' => 'A',
            'duration' => 30,
            'base_point' => 100,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('questions', [
            'quiz_id' => $quiz->id,
            'type' => 'multiple_choice',
            'question_text' => 'What is a Pod?',
            'correct_answer' => 'A',
            'duration' => 30,
            'base_point' => 100,
        ]);
    }

    public function test_adding_multiple_choice_question_fails_if_options_missing()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::create([
            'title' => 'Kubernetes Basics',
        ]);

        $response = $this->post(route('quizzes.questions.store', $quiz), [
            'type' => 'multiple_choice',
            'question_text' => 'What is a Pod?',
            'options' => [
                'A' => 'Smallest deployable unit',
                'B' => '', // missing option B content
                'C' => 'A networking bridge',
                'D' => 'A virtual machine manager'
            ],
            'correct_answer' => 'A',
            'duration' => 30,
            'base_point' => 100,
        ]);

        $response->assertSessionHasErrors(['options.B']);
    }

    public function test_adding_essay_question_requires_correct_answer()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::create([
            'title' => 'Kubernetes Basics',
        ]);

        $response = $this->post(route('quizzes.questions.store', $quiz), [
            'type' => 'short_essay',
            'question_text' => 'What CLI is used to interact with Kubernetes?',
            'correct_answer' => 'kubectl',
            'duration' => 60,
            'base_point' => 200,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('questions', [
            'quiz_id' => $quiz->id,
            'type' => 'short_essay',
            'question_text' => 'What CLI is used to interact with Kubernetes?',
            'correct_answer' => 'kubectl',
        ]);
    }
}
