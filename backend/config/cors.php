<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Paths
    |--------------------------------------------------------------------------
    |
    | URL paths that should be CORS-enabled. You can use wildcards like 'api/*'.
    |
    */
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'health'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | HTTP methods that are allowed for CORS requests. '*' allows all.
    |
    */
    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Exact origins that are allowed to make CORS requests.
    |
    */
    'allowed_origins' => [
        'https://novextask.ru',                              // Production
        'https://server-thinkpad-x220.tail44896d.ts.net',    // Tailscale / remote
        'http://localhost:3000',                             // Dev
        'http://localhost:5173',                             // Dev
        'http://127.0.0.1:5173',                             // Dev via 127.0.0.1
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins Patterns
    |--------------------------------------------------------------------------
    |
    | Regex patterns for origins. Useful for wildcard local ports.
    |
    */
    'allowed_origins_patterns' => [
        '/localhost:\d+/',       // любые локальные порты
        '/127\.0\.0\.1:\d+/',    // любые локальные порты через 127.0.0.1
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Headers that are allowed in CORS requests. '*' allows all headers.
    |
    */
    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Headers exposed to the browser.
    |
    */
    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | How long (in seconds) the results of a preflight request can be cached.
    |
    */
    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Must be true if frontend sends cookies or authentication headers.
    |
    */
    'supports_credentials' => true,

];
