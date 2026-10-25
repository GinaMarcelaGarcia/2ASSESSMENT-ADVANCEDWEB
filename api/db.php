<?php
// db.php
// Opens the connection to the MySQL database with PDO.

function getDB()
{
    // XAMPP default settings (same on Windows and Mac)
    $host = 'localhost';
    $dbname = 'trackback';
    $user = 'root';
    $password = '';

    try {
        $pdo = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $user,
            $password,
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
