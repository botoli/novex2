<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController
{
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users",
            "password" => "required|min:6",
            "status" => "required|string",
            "subscription_id" => "sometimes|exists:subscriptions,id",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Validation failed",
                    "errors" => $validator->errors()->all(),
                ],
                422,
            );
        }

        try {
            if (!$request->has("subscription_id")) {
                $defaultSubscription = \App\Models\Subscription::where(
                    "is_default",
                    true,
                )->first();
                if ($defaultSubscription) {
                    $subscriptionId = $defaultSubscription->id;
                } else {
                    $firstSubscription = \App\Models\Subscription::first();
                    $subscriptionId = $firstSubscription
                        ? $firstSubscription->id
                        : null;
                }
            } else {
                $subscriptionId = $request->subscription_id;
            }

            $user = User::create([
                "name" => $request->name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
                "status" => $request->status,
                "subscription_id" => $subscriptionId,
            ]);

            $user->load("subscription");

            return response()->json(
                [
                    "success" => true,
                    "message" => "User registered successfully",
                    "user" => [
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "subscription" => $user->subscription,
                    ],
                ],
                201,
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Server error: " . $e->getMessage(),
                    "errors" => ["server_error" => $e->getMessage()],
                ],
                500,
            );
        }
    }

    public function checkUser(Request $request)
    {
        $email = $request->query("email");
        $name = $request->query("name");

        $emailExists = User::where("email", $email)->exists();
        $nameExists = User::where("name", $name)->exists();

        return response()->json([
            "email_exists" => $emailExists,
            "name_exists" => $nameExists,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required|min:6",
        ]);

        $user = User::with("subscription")
            ->where("email", $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(
                [
                    "success" => false,
                    "error" => "Неверный email или пароль",
                ],
                401,
            );
        }

        return response()->json([
            "success" => true,
            "message" => "Вход выполнен успешно",
            "user" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "subscription" => $user->subscription,
            ],
        ]);
    }

    public function getAllUsers(Request $request)
    {
        try {
            $query = User::with("subscription");

            if ($request->has("search")) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where("name", "like", "%{$search}%")->orWhere(
                        "email",
                        "like",
                        "%{$search}%",
                    );
                });
            }

            if ($request->has("status")) {
                $query->where("status", $request->status);
            }

            if ($request->has("subscription_id")) {
                $query->where("subscription_id", $request->subscription_id);
            }

            $perPage = $request->get("per_page", 15);
            $users = $query->orderBy("created_at", "desc")->paginate($perPage);

            return response()->json([
                "success" => true,
                "users" => $users,
                "total" => $users->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Ошибка при получении пользователей: " .
                        $e->getMessage(),
                ],
                500,
            );
        }
    }

    public function getUser($id)
    {
        try {
            $user = User::with("subscription")->find($id);

            if (!$user) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "Пользователь не найден",
                    ],
                    404,
                );
            }

            return response()->json([
                "success" => true,
                "user" => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Ошибка при получении пользователя: " .
                        $e->getMessage(),
                ],
                500,
            );
        }
    }

    public function updateUser(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "name" => "sometimes|string|max:255",
            "email" => "sometimes|email|unique:users,email," . $id,
            "status" => "sometimes|string",
            "subscription_id" => "sometimes|exists:subscriptions,id",
            "password" => "sometimes|min:6",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Validation failed",
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "Пользователь не найден",
                    ],
                    404,
                );
            }

            $updateData = $request->only([
                "name",
                "email",
                "status",
                "subscription_id",
            ]);

            if ($request->has("password")) {
                $updateData["password"] = Hash::make($request->password);
            }

            $user->update($updateData);
            $user->load("subscription");

            return response()->json([
                "success" => true,
                "message" => "Пользователь успешно обновлен",
                "user" => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Ошибка при обновлении пользователя: " .
                        $e->getMessage(),
                ],
                500,
            );
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "Пользователь не найден",
                    ],
                    404,
                );
            }

            $user->delete();

            return response()->json([
                "success" => true,
                "message" => "Пользователь успешно удален",
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Ошибка при удалении пользователя: " . $e->getMessage(),
                ],
                500,
            );
        }
    }
}
