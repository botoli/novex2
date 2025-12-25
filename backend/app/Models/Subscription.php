<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    protected $fillable = [
        "title",
        "code",
        "description",
        "cost",
        "is_default",
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
