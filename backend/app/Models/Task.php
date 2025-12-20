<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'project_id',
        'created_by',
        'assigned_to',
        'completed_at',
        'tags',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
        'tags' => 'array',
    ];


    public function attachments()
    {
        return $this->hasMany(Task_attachment::class, 'task_id');
    }


    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }


    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }


    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
