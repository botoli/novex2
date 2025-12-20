<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Project;
use App\Models\ProjectUser;
use App\Models\User;
use App\Models\Task;

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
                'title' => $request->tittle,
                'description' => $request->description,
                'user_id' => $request->owner_id,
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

    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|integer|exists:projects,id',
            'user_id' => 'required|integer|exists:users,id',
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

            $project = Project::findOrFail($request->project_id);

            if ($project->user_id != $request->user_id) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Только владелец может удалить проект'
                ], 403);
            }

            ProjectUser::where('project_id', $request->project_id)->delete();

            $project->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Проект успешно удален'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при удалении проекта: ' . $e->getMessage()
            ], 500);
        }
    }

    public function showById($id)
    {
        try {
            $project = Project::with(['owner', 'users', 'tasks'])->find($id);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            $taskStats = Task::where('project_id', $id)
                ->selectRaw('
                    COUNT(*) as total_tasks,
                    SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed_tasks,
                    SUM(CASE WHEN status = "in_progress" THEN 1 ELSE 0 END) as in_progress_tasks,
                    SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending_tasks
                ')
                ->first();

            return response()->json([
                'success' => true,
                'project' => $project,
                'statistics' => $taskStats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении проекта: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tittle' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|integer|exists:users,id',
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

            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            if ($project->user_id != $request->input('user_id')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Только владелец может обновить проект'
                ], 403);
            }

            $data = [];
            if ($request->has('tittle')) {
                $data['title'] = $request->tittle;
            }
            if ($request->has('description')) {
                $data['description'] = $request->description;
            }
            $project->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Проект успешно обновлен',
                'project' => $project
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при обновлении проекта: ' . $e->getMessage()
            ], 500);
        }
    }

    public function addMember(Request $request, $projectId)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'role' => 'required|string|in:member,manager,viewer',
            'added_by' => 'required|integer|exists:users,id',
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

            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            $adderRole = ProjectUser::where('project_id', $projectId)
                ->where('user_id', $request->added_by)
                ->value('role');

            if (!in_array($adderRole, ['owner', 'manager'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Недостаточно прав для добавления участников'
                ], 403);
            }

            $existingMember = ProjectUser::where('project_id', $projectId)
                ->where('user_id', $request->user_id)
                ->exists();

            if ($existingMember) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь уже является участником проекта'
                ], 400);
            }

            ProjectUser::create([
                'project_id' => $projectId,
                'user_id' => $request->user_id,
                'role' => $request->role,
            ]);

            DB::commit();

            $newMember = User::find($request->user_id);

            return response()->json([
                'success' => true,
                'message' => 'Участник успешно добавлен',
                'member' => $newMember,
                'role' => $request->role
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при добавлении участника: ' . $e->getMessage()
            ], 500);
        }
    }

    public function removeMember(Request $request, $projectId, $userId)
    {
        $validator = Validator::make($request->all(), [
            'removed_by' => 'required|integer|exists:users,id',
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

            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            $removerRole = ProjectUser::where('project_id', $projectId)
                ->where('user_id', $request->removed_by)
                ->value('role');

            $targetRole = ProjectUser::where('project_id', $projectId)
                ->where('user_id', $userId)
                ->value('role');

            if (!$targetRole) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь не найден в проекте'
                ], 404);
            }

            if ($removerRole != 'owner' && $targetRole == 'owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Нельзя удалить владельца проекта'
                ], 403);
            }

            if (!in_array($removerRole, ['owner', 'manager']) && $request->removed_by != $userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Недостаточно прав для удаления участников'
                ], 403);
            }

            ProjectUser::where('project_id', $projectId)
                ->where('user_id', $userId)
                ->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Участник успешно удален из проекта'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при удалении участника: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateMemberRole(Request $request, $projectId, $userId)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|in:member,manager,viewer',
            'updated_by' => 'required|integer|exists:users,id',
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

            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            $updaterRole = ProjectUser::where('project_id', $projectId)
                ->where('user_id', $request->updated_by)
                ->value('role');

            if ($updaterRole != 'owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Только владелец может изменять роли участников'
                ], 403);
            }

            $member = ProjectUser::where('project_id', $projectId)
                ->where('user_id', $userId)
                ->first();

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь не найден в проекте'
                ], 404);
            }

            if ($member->role == 'owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Нельзя изменить роль владельца'
                ], 403);
            }

            $member->update(['role' => $request->role]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Роль участника успешно обновлена',
                'user_id' => $userId,
                'new_role' => $request->role
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при обновлении роли: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTasks($projectId)
    {
        try {
            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            $tasks = Task::where('project_id', $projectId)
                ->with(['creator', 'assignee'])
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'project_id' => $projectId,
                'tasks' => $tasks
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении задач: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getStatistics($projectId)
    {
        try {
            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            $taskStats = Task::where('project_id', $projectId)
                ->selectRaw('
                    COUNT(*) as total_tasks,
                    SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed_tasks,
                    SUM(CASE WHEN status = "in_progress" THEN 1 ELSE 0 END) as in_progress_tasks,
                    SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending_tasks,
                    SUM(CASE WHEN priority = "high" THEN 1 ELSE 0 END) as high_priority,
                    SUM(CASE WHEN priority = "medium" THEN 1 ELSE 0 END) as medium_priority,
                    SUM(CASE WHEN priority = "low" THEN 1 ELSE 0 END) as low_priority,
                    AVG(TIMESTAMPDIFF(DAY, created_at, completed_at)) as avg_completion_days
                ')
                ->first();

            $memberStats = ProjectUser::where('project_id', $projectId)
                ->selectRaw('
                    COUNT(*) as total_members,
                    SUM(CASE WHEN role = "owner" THEN 1 ELSE 0 END) as owners,
                    SUM(CASE WHEN role = "manager" THEN 1 ELSE 0 END) as managers,
                    SUM(CASE WHEN role = "member" THEN 1 ELSE 0 END) as members,
                    SUM(CASE WHEN role = "viewer" THEN 1 ELSE 0 END) as viewers
                ')
                ->first();

            return response()->json([
                'success' => true,
                'project_id' => $projectId,
                'task_statistics' => $taskStats,
                'member_statistics' => $memberStats,
                'project' => [
                    'title' => $project->title,
                    'created_at' => $project->created_at,
                    'owner' => User::find($project->user_id)->name ?? 'Неизвестно'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении статистики: ' . $e->getMessage()
            ], 500);
        }
    }
}
