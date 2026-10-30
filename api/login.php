<?php
// login.php
// POST /api/login.php   body: { "email": "...", "password": "..." }
// Checks the e-mail and password. If they are right, starts the session.
//
// Agreement with me.php (Vinny): after a correct login we save
//   $_SESSION['user_id']  and  $_SESSION['username']

require_once __DIR__ . '/config.php';

// This endpoint only receives data
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed.', 405);
}

// 1. Read what React sent
$body = getJsonBody();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

// 2. Validate again in PHP (React validates too, but JavaScript can be turned off)
if ($email === '' || $password === '') {
    sendError('Please enter your e-mail and password.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('Please enter a valid e-mail.', 400);
}

// 3. Look for the user by e-mail (prepared statement: no SQL injection)
$pdo = getDB();
$stmt = $pdo->prepare('SELECT id, username, password_hash FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

// 4. Check the password against the hash saved in the database.
// Same message for "e-mail not found" and "wrong password",
// so nobody can use the login to find out which e-mails have an account.
if (!$user || !password_verify($password, $user['password_hash'])) {
    sendError('Incorrect e-mail or password.', 401);
}

// 5. Login is correct: new session id (prevents session fixation) and save the user
session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];
$_SESSION['username'] = $user['username'];

sendJson([
    'id' => (int) $user['id'],
    'username' => $user['username'],
]);