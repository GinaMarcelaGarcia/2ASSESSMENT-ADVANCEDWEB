<?php
// db.php
// Opens the connection to the MySQL database with PDO.
// The details (host, user, password) come from db.local.php,
// so XAMPP and the live server can use different values.

function getDB()
{
    $configFile = __DIR__ . '/db.local.php';

    // Missing file: clear message in the log, generic message for the user
    if (!file_exists($configFile)) {
        error_log('db.local.php is missing. Copy db.example.php to db.local.php.');
        sendError('Could not connect to the database.', 500);
    }

    // require (not require_once): it returns the array every time getDB() is called
    $db = require $configFile;

    try {
        $pdo = new PDO(
            "mysql:host={$db['host']};dbname={$db['dbname']};charset=utf8mb4",
            $db['user'],
            $db['password'],
            [
                // Any SQL error becomes an exception we can catch
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                // Rows come back as ['title' => '...'] instead of numbered columns
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                // Use real prepared statements in MySQL, not a PHP imitation
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        // The real error goes to the server log, never to the user
        error_log('Database connection failed: ' . $e->getMessage());
        sendError('Could not connect to the database.', 500);
    }
}