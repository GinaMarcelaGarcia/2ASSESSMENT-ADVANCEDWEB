<?php
// me.php
// GET /api/me.php
// Tells React who is logged in right now.
// The Navbar calls this to decide between "Sign In" and the user's name.
//
// Agreement with the login (Emily): after a correct login, login.php saves
//   $_SESSION['user_id']  and  $_SESSION['username']

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed.', 405);
}

// Nobody logged in is not an error, so we answer success with data = null
if (!isset($_SESSION['user_id'])) {
    sendJson(null);
}

sendJson([
    'id' => (int) $_SESSION['user_id'],
    'username' => $_SESSION['username'],
]);
