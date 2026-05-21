<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'type' => ['required', 'string', Rule::in(['multiple_choice', 'short_essay', 'fast_click'])],
            'question_text' => ['required', 'string'],
            'duration' => ['required', 'integer', 'min:5', 'max:3600'],
            'base_point' => ['required', 'integer', 'min:0', 'max:10000'],
        ];

        if (in_array($this->type, ['multiple_choice', 'fast_click'])) {
            $rules['options'] = ['required', 'array'];
            $rules['options.A'] = ['required', 'string', 'max:1000'];
            $rules['options.B'] = ['required', 'string', 'max:1000'];
            $rules['options.C'] = ['required', 'string', 'max:1000'];
            $rules['options.D'] = ['required', 'string', 'max:1000'];
            $rules['correct_answer'] = ['required', 'string', 'in:A,B,C,D'];
        } else {
            // For short essay, options are completely ignored and correct_answer can be any string
            $rules['correct_answer'] = ['required', 'string'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'options.required_if' => 'Pilihan jawaban wajib diisi untuk tipe soal pilihan ganda atau jawab cepat.',
            'options.A.required_if' => 'Pilihan A wajib diisi.',
            'options.B.required_if' => 'Pilihan B wajib diisi.',
            'options.C.required_if' => 'Pilihan C wajib diisi.',
            'options.D.required_if' => 'Pilihan D wajib diisi.',
            'correct_answer.in' => 'Kunci jawaban pilihan ganda harus berupa A, B, C, atau D.',
        ];
    }
}
