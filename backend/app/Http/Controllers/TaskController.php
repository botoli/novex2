<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController
{

    public function index(Request $request)
    {
        $query = Task::with(['assignee', 'creator']);

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }


        if ($request->has('status')) {
            $query->where('status', $request->status);
        }


        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }


        if ($request->has('tags')) {
            $tags = explode(',', $request->tags);
            $query->whereJsonContains('tags', $tags);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $tasks = $query->paginate($perPage);

        return response()->json($tasks);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'priority' => 'required|string',
            'due_date' => 'nullable|date',
            'project_id' => 'nullable|integer|exists:projects,id',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'tags' => 'nullable|array',
            'created_by' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::create($request->all());

        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|string',
            'priority' => 'sometimes|string',
            'due_date' => 'nullable|date',
            'project_id' => 'nullable|integer|exists:projects,id',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'tags' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task->update($request->all());

        return response()->json($task);
    }


    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }


    public function complete($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json($task);
    }


    public function upcoming(Request $request)
    {
        $query = Task::with(['assignee', 'creator'])
                    ->where('due_date', '>=', now())
                    ->where('status', '!=', 'completed')
                    ->orderBy('due_date', 'asc');

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $perPage = $request->get('per_page', 10);
        $tasks = $query->paginate($perPage);

        return response()->json($tasks);
    }


    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = $request->get('query');

        $tasks = Task::with(['assignee', 'creator'])
                    ->where('title', 'LIKE', "%{$query}%")
                    ->orWhere('description', 'LIKE', "%{$query}%")
                    ->orWhereJsonContains('tags', [$query])
                    ->orderBy('created_at', 'desc')
                    ->paginate(15);

        return response()->json($tasks);
    }
}
