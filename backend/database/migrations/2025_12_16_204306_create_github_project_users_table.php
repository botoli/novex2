<?php
// database/migrations/xxxx_create_github_project_user_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('github_project_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('github_project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['owner', 'contributor', 'watcher'])->default('contributor');
            $table->json('permissions')->nullable(); 
            $table->timestamps();
            
            $table->unique(['github_project_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('github_project_user');
    }
};