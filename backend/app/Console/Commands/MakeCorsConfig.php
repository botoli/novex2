<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeCorsConfig extends Command
{
    protected $signature = 'make:cors-config';
    protected $description = 'Create CORS configuration file';

    public function handle()
    {
        $corsContent = '<?php

return [
    \'paths\' => [\'api/*\', \'sanctum/csrf-cookie\'],
    \'allowed_methods\' => [\'*\'],
    \'allowed_origins\' => [\'http://localhost:5173\', \'http://127.0.0.1:5173\'],
    \'allowed_origins_patterns\' => [],
    \'allowed_headers\' => [\'*\'],
    \'exposed_headers\' => [],
    \'max_age\' => 0,
    \'supports_credentials\' => false,
];';

        File::put(config_path('cors.php'), $corsContent);
        $this->info('CORS config file created successfully!');
    }
}
