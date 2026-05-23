<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'), // explicitly set password
        ]);

        // Seed a sample Quiz
        $quiz = \App\Models\Quiz::create([
            'title' => 'Kuis Pengetahuan Umum',
            'description' => 'Kuis santai menguji pengetahuan umum tentang geografi, sains, dan teknologi.',
        ]);

        // Seed questions
        $quiz->questions()->create([
            'type' => 'multiple_choice',
            'question_text' => 'Apa nama ibukota baru Indonesia?',
            'options' => [
                'A' => 'Jakarta',
                'B' => 'Bandung',
                'C' => 'Surabaya',
                'D' => 'Nusantara',
            ],
            'correct_answer' => 'D',
            'duration' => 20,
            'base_point' => 100,
        ]);

        $quiz->questions()->create([
            'type' => 'multiple_choice',
            'question_text' => 'Planet terdekat dari Matahari adalah?',
            'options' => [
                'A' => 'Venus',
                'B' => 'Mars',
                'C' => 'Merkurius',
                'D' => 'Yupiter',
            ],
            'correct_answer' => 'C',
            'duration' => 15,
            'base_point' => 100,
        ]);

        $quiz->questions()->create([
            'type' => 'short_essay',
            'question_text' => 'Sebutkan layer protokol TCP/IP yang bertanggung jawab untuk pengiriman paket data (routing) antar host!',
            'options' => null,
            'correct_answer' => 'internet, network',
            'duration' => 30,
            'base_point' => 150,
        ]);

        $quiz->questions()->create([
            'type' => 'fast_click',
            'question_text' => 'Siapakah ilmuwan yang mengemukakan Teori Relativitas?',
            'options' => [
                'A' => 'Albert Einstein',
                'B' => 'Isaac Newton',
                'C' => 'Nikola Tesla',
                'D' => 'Galileo Galilei',
            ],
            'correct_answer' => 'A',
            'duration' => 10,
            'base_point' => 200,
        ]);
    }
}
