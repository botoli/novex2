<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Project;
use App\Models\ProjectUser;
use App\Models\User;

class ProjectController
{
    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'tittle' => 'required|string|max:255',
            'description' => 'nullable|string',
            'owner_id' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();


            $project = Project::create([
                'tittle' => $request->tittle,
                'description' => $request->description,
                'owner_id' => $request->owner_id,
            ]);


            ProjectUser::create([
                'project_id' => $project->id,
                'user_id' => $request->owner_id,
                'role' => 'owner',
            ]);

            DB::commit();


            $project->load(['owner', 'users']);

            return response()->json([
                'success' => true,
                'message' => 'Проект успешно создан',
                'project' => $project,
                'owner' => $project->owner,
                'members' => $project->users
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при создании проекта: ' . $e->getMessage()
            ], 500);
        }
    }


    public function show(Request $request)
    {
        $userId = $request->input('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User ID is required'
            ], 400);
        }


        $projects = Project::whereHas('users', function($query) use ($userId) {
            $query->where('users.id', $userId);
        })->with(['owner', 'users'])->get();

        return response()->json([
            'success' => true,
            'user_id' => $userId,
            'projects' => $projects,
            'total' => $projects->count()
        ]);
    }
}
