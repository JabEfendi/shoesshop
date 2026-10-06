<?php

return [
    'middleware' => [
        'class' => App\Http\Middleware\HandleInertiaRequests::class,
    ],
    'ssr' => [
        'enabled' => true,
        'url'     => 'http://127.0.0.1:13714/render',
        'bundle'  => base_path('public/build/ssr/ssr.js'),
    ],
    'testing' => [
        'ensure_pages_exist' => true,
    ],
];
