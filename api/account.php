<?php
// account.php
// The logged-in user's account details (Account Settings tab).
//
// GET  /api/account.php   -> { id, username, email }
// POST /api/account.php   -> change one thing, chosen by "action":
//   { "action": "username", "username": "..." }
//   { "action": "email",    "email": "..." }
//   { "action": "password", "currentPassword": "...", "newPassword": "..." }

require_once __DIR__ . '/config.php';

// Only logged-in users can see or change an account
if (!isset($_SESSION['user_id'])) {
    sendError('Please sign in first.', 401);
}

$userId = (int) $_SESSION['user_id'];
$pdo = getDB();

// ---------- GET: show the account details ----------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT id, username, email FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError('Account not found.', 404);
    }

    sendJson([
        'id' => (int) $user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed.', 405);
}

// ---------- POST: change username, e-mail or password ----------
$body = getJsonBody();
$action = $body['action'] ?? '';

try {
    if ($action === 'username') {
        $username = trim($body['username'] ?? '');

        if ($username === '') {
            sendError('Please enter a username.', 400);
        }
        if (mb_strlen($username) > 30) {
            sendError('Username must have up to 30 characters.', 400); // users.username is VARCHAR(30)
        }

        // Nobody else can have the same username
        $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? AND id <> ?');
        $stmt->execute([$username, $userId]);
        if ($stmt->fetch()) {
            sendError('This username is already taken.', 409);
        }

        $stmt = $pdo->prepare('UPDATE users SET username = ? WHERE id = ?');
        $stmt->execute([$username, $userId]);

        $_SESSION['username'] = $username; // so the navbar shows the new name
        sendJson(['username' => $username]);
    }

    if ($action === 'email') {
        $email = trim($body['email'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendError('Please enter a valid e-mail.', 400);
        }

        // Nobody else can have the same e-mail
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
        $stmt->execute([$email, $userId]);
        if ($stmt->fetch()) {
            sendError('This e-mail already has an account.', 409);
        }

        $stmt = $pdo->prepare('UPDATE users SET email = ? WHERE id = ?');
        $stmt->execute([$email, $userId]);

        sendJson(['email' => $email]);
    }

    if ($action === 'password') {
        $currentPassword = $body['currentPassword'] ?? '';
        $newPassword = $body['newPassword'] ?? '';

        if ($currentPassword === '' || $newPassword === '') {
            sendError('Please fill in all the password fields.', 400);
        }
        if (strlen($newPassword) < 8) {
            sendError('New password must have at least 8 characters.', 400);
        }

        // The current password must be right (someone could be using an open session)
        $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
            sendError('Current password is incorrect.', 400);
        }

        $stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $stmt->execute([password_hash($newPassword, PASSWORD_DEFAULT), $userId]);

        session_regenerate_id(true); // new session id after a password change
        sendJson(null);
    }
} catch (PDOException $e) {
    // 23000 = duplicate value: someone took the same username/e-mail at the same moment
    if ($e->getCode() === '23000') {
        sendError('This username or e-mail is already taken.', 409);
    }
    throw $e; // any other error goes to the handler in config.php
}

sendError('Unknown action.', 400);