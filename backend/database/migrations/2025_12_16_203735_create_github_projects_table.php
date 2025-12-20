<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('github_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
    
            $table->string('owner_github_id')->nullable();
            $table->string('owner_login');
            $table->string('owner_name')->nullable();
            $table->string('owner_avatar_url')->nullable();
            $table->string('owner_html_url')->nullable();
            $table->string('owner_type')->default('User');
            

            $table->string('github_id')->unique();
            $table->string('name');
            $table->string('full_name')->unique();
            $table->boolean('private')->default(false);
            $table->text('description')->nullable();
            $table->string('html_url');
            $table->string('clone_url');
            $table->string('ssh_url')->nullable();
            $table->string('homepage')->nullable();
            $table->string('language')->nullable();
            $table->integer('stargazers_count')->default(0);
            $table->integer('watchers_count')->default(0);
            $table->integer('forks_count')->default(0);
            $table->integer('open_issues_count')->default(0);
            $table->integer('size')->default(0);
   
            $table->timestamp('github_created_at');
            $table->timestamp('github_updated_at')->nullable();
            $table->timestamp('github_pushed_at')->nullable();
            
    
            $table->boolean('fork')->default(false);
            $table->boolean('archived')->default(false);
            $table->boolean('disabled')->default(false);
            $table->boolean('template')->default(false);
            
            $table->string('default_branch')->default('main');
            $table->json('topics')->nullable();
            $table->json('license')->nullable();
            $table->json('raw_data')->nullable();
            
       
            $table->enum('status', ['active', 'archived', 'hidden'])->default('active');
            
 
            $table->json('tags')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            

            $table->index('user_id');
            $table->index('owner_login');
            $table->index('language');
            $table->index('stargazers_count');
            $table->index('status');
            $table->index('github_created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('github_projects');
    }
};