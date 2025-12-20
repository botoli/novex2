<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('project_user')) {
            Schema::create('project_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('role')->default('member');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('project_user')) {
            $count = DB::table('project_user')->count();
            if ($count === 0) {
                Schema::dropIfExists('project_user');
            }
        }
    }
};
