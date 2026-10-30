<?php
// register.php
// POST /api/register.php   body: { "username": "...", "email": "...", "password": "..." }
// Creates a new account. If it works, the user is signed in straight away.

require_once __DIR__ . '/config.php';

// This endpoint only receives data
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed.', 405);
}

// 1. Read what React sent
$body = getJsonBody();
$username = trim($body['username'] ?? '');
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

// 2. Validate again in PHP (same rules as React)
if ($username === '' || $email === '' || $password === '') {
    sendError('Please fill in all the fields.', 400);
}

if (mb_strlen($username) > 30) {
    sendError('Username must have up to 30 characters.', 400); // users.username is VARCHAR(30)
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('Please enter a valid e-mail.', 400);
}

if (strlen($password) < 8) {
    sendError('Password must have at least 8 characters.', 400);
}

$pdo = getDB();

// 3. Username and e-mail must be unique
$stmt = $pdo->prepare('SELECT username, email FROM users WHERE username = ? OR email = ?');
$stmt->execute([$username, $email]);
$existing = $stmt->fetch();

if ($existing) {
    if (strcasecmp($existing['email'], $email) === 0) {
        sendError('This e-mail already has an account.', 409);
    }
    sendError('This username is already taken.', 409);
}

// 4. Save the user. The real password is never saved, only its hash.
$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
    $stmt->execute([$username, $email, $hash]);
} catch (PDOException $e) {
    // 23000 = duplicate value: someone took the same username/e-mail at the same moment
    if ($e->getCode() === '23000') {
        sendError('This username or e-mail is already taken.', 409);
    }
    throw $e; // any other error goes to the handler in config.php
}

$userId = (int) $pdo->lastInsertId();

// 5. Sign the new user in (same session keys as login.php)
session_regenerate_id(true);
$_SESSION['user_id'] = $userId;
$_SESSION['username'] = $username;

sendJson([
    'id' => $userId,
    'username' => $username,
], 201);