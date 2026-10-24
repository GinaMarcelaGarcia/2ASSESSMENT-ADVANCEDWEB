<?php
// genres.php
// GET /api/genres.php
// Returns all genres, used by the genre dropdown on the Home page.

require_once __DIR__ . '/config.php';

// This endpoint only reads data
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed.', 405);
}

$pdo = getDB();

// No user input in this query, so a plain query() is safe here.
// Any query with user input (id, search, email) must use prepare() + execute().
$stmt = $pdo->query('SELECT id, name FROM genres ORDER BY name');
$genres = $stmt->fetchAll();

sendJson($genres);
