<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists(__DIR__.'/../storage/framework/maintenance.php')) {
    require __DIR__.'/../storage/framework/maintenance.php';
}

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$request = Request::capture();
$response = $app->handleRequest($request);

if ($response !== null) {
    $response->send();
}

$app->terminate($request, $response ?? new \Illuminate\Http\Response());
