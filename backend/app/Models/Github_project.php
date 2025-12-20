<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Github_project extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "user_id",
        "owner_github_id",
        "owner_login",
        "owner_name",
        "owner_avatar_url",
        "owner_html_url",
        "owner_type",
        "github_id",
        "name",
        "full_name",
        "private",
        "description",
        "html_url",
        "clone_url",
        "ssh_url",
        "homepage",
        "language",
        "stargazers_count",
        "watchers_count",
        "forks_count",
        "open_issues_count",
        "size",
        "github_created_at",
        "github_updated_at",
        "github_pushed_at",
        "fork",
        "archived",
        "disabled",
        "template",
        "default_branch",
        "topics",
        "license",
        "raw_data",
        "status",
        "tags",
    ];

    protected $casts = [
        "private" => "boolean",
        "fork" => "boolean",
        "archived" => "boolean",
        "disabled" => "boolean",
        "template" => "boolean",
        "topics" => "array",
        "license" => "array",
        "raw_data" => "array",
        "tags" => "array",
        "github_created_at" => "datetime",
        "github_updated_at" => "datetime",
        "github_pushed_at" => "datetime",
        "created_at" => "datetime",
        "updated_at" => "datetime",
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, "github_project_user")
            ->withPivot("role", "permissions")
            ->withTimestamps();
    }

    public function scopeForUser($query, $userId)
    {
        return $query
            ->where("user_id", $userId)
            ->orWhereHas("users", function ($q) use ($userId) {
                $q->where("user_id", $userId);
            });
    }

    public function scopePublic($query)
    {
        return $query->where("private", false)->where("status", "active");
    }

    public function scopeWithTags($query, array $tags)
    {
        return $query->whereJsonContains("tags", $tags);
    }

    protected function displayOwnerName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->owner_name ??
                ($this->owner?->name ?? "Unknown"),
        );
    }

    protected function displayAvatar(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->owner_avatar_url ??
                ($this->owner?->avatar ?? null),
        );
    }
}
