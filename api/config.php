<?php
// config.php
// Every endpoint starts with: require_once __DIR__ . '/config.php';
// It sets the rules that apply to all requests.

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/db.php';

// 1. Never show raw PHP errors on the screen. They go to the log instead.
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

// Safety net: any exception nobody caught becomes a clean JSON error.
set_exception_handler(function ($e) {
    error_log($e->getMessage());
    sendError('Something went wrong on the server.', 500);
});

// 2. CORS: React runs on port 5173 and PHP on port 80.
// The browser blocks calls between different ports unless PHP allows it here.
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true'); // lets the session cookie travel with fetch
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Before a POST with JSON, the browser first sends an OPTIONS request to ask permission.
// We answer "ok" and stop, the real request comes right after.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 3. Session, used by login. The cookie cannot be read by JavaScript (httponly).
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();
