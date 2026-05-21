<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // 'multiple_choice', 'short_essay', 'fast_click'
            $table->text('question_text');
            $table->json('options')->nullable(); // For multiple choice & fast click option sets (e.g. key-value format)
            $table->text('correct_answer'); // Store correct key (A, B, C, D) or comma-separated answers
            $table->integer('duration')->default(30); // in seconds
            $table->integer('base_point')->default(100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
