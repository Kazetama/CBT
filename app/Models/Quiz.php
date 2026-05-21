<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description'])]
class Quiz extends Model
{
    use HasFactory;

    /**
     * Get the questions associated with the quiz.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
