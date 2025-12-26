<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Subscription;
use App\Models\User;

class SubscriptionController
{
  
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "code" => "required|string|unique:subscriptions,code",
            "description" => "nullable|string",
            "cost" => "required|numeric|min:0",
            "is_default" => "sometimes|boolean",
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
        
            if ($request->boolean("is_default")) {
                Subscription::where("is_default", true)->update([
                    "is_default" => false,
                ]);
            }

            $subscription = Subscription::create([
                "title" => $request->title,
                "code" => $request->code,
                "description" => $request->description,
                "cost" => $request->cost,
                "is_default" => $request->boolean("is_default", false),
            ]);

            return response()->json(
                [
                    "success" => true,
                    "message" => "Subscription created successfully",
                    "subscription" => $subscription,
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


    public function getAll(Request $request)
    {
        try {
            $query = Subscription::query();

            if ($request->has("search")) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where("title", "like", "%{$search}%")
                        ->orWhere("code", "like", "%{$search}%")
                        ->orWhere("description", "like", "%{$search}%");
                });
            }

            if ($request->has("min_cost")) {
                $query->where("cost", ">=", $request->min_cost);
            }

            if ($request->has("max_cost")) {
                $query->where("cost", "<=", $request->max_cost);
            }

            $perPage = $request->get("per_page", 15);
            $subscriptions = $query
                ->orderBy("created_at", "desc")
                ->paginate($perPage);

            return response()->json([
                "success" => true,
                "subscriptions" => $subscriptions,
                "total" => $subscriptions->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Error fetching subscriptions: " . $e->getMessage(),
                ],
                500,
            );
        }
    }


    public function get($id)
    {
        try {
            $subscription = Subscription::find($id);

            if (!$subscription) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "Subscription not found",
                    ],
                    404,
                );
            }

            return response()->json([
                "success" => true,
                "subscription" => $subscription,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Error fetching subscription: " . $e->getMessage(),
                ],
                500,
            );
        }
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "title" => "sometimes|string|max:255",
            "code" => "sometimes|string|unique:subscriptions,code," . $id,
            "description" => "nullable|string",
            "cost" => "sometimes|numeric|min:0",
            "is_default" => "sometimes|boolean",
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
            $subscription = Subscription::find($id);

            if (!$subscription) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "Subscription not found",
                    ],
                    404,
                );
            }


            if (
                $request->has("is_default") &&
                $request->boolean("is_default")
            ) {
                Subscription::where("is_default", true)
                    ->where("id", "!=", $id)
                    ->update(["is_default" => false]);
            }

            $subscription->update(
                $request->only([
                    "title",
                    "code",
                    "description",
                    "cost",
                    "is_default",
                ]),
            );

            return response()->json([
                "success" => true,
                "message" => "Subscription updated successfully",
                "subscription" => $subscription,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Error updating subscription: " . $e->getMessage(),
                ],
                500,
            );
        }
    }


    public function delete($id)
    {
        try {
            $subscription = Subscription::find($id);

            if (!$subscription) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "Subscription not found",
                    ],
                    404,
                );
            }


            $usersCount = User::where("subscription_id", $id)->count();

            if ($usersCount > 0) {
                return response()->json(
                    [
                        "success" => false,
                        "message" =>
                            "Cannot delete subscription. " .
                            $usersCount .
                            " user(s) are using it.",
                    ],
                    400,
                );
            }

 
            if ($subscription->is_default) {
                $newDefault = Subscription::where("id", "!=", $id)->first();
                if ($newDefault) {
                    $newDefault->update(["is_default" => true]);
                }
            }

            $subscription->delete();

            return response()->json([
                "success" => true,
                "message" => "Subscription deleted successfully",
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Error deleting subscription: " . $e->getMessage(),
                ],
                500,
            );
        }
    }


    public function getUsers($id)
    {
        try {
            $subscription = Subscription::with("users")->find($id);

            if (!$subscription) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "Subscription not found",
                    ],
                    404,
                );
            }

            return response()->json([
                "success" => true,
                "subscription" => $subscription,
                "users" => $subscription->users,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Error fetching subscription users: " .
                        $e->getMessage(),
                ],
                500,
            );
        }
    }


    public function getDefault()
    {
        try {
            $subscription = Subscription::where("is_default", true)->first();

            if (!$subscription) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "Default subscription not found",
                    ],
                    404,
                );
            }

            return response()->json([
                "success" => true,
                "subscription" => $subscription,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Error fetching default subscription: " .
                        $e->getMessage(),
                ],
                500,
            );
        }
    }
}
