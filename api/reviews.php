<?php
// reviews.php
// GET    /api/reviews.php?album=5  -> reviews of one album (anyone can read)
// GET    /api/reviews.php?mine=1   -> reviews of the logged user (My reviews tab)
// POST   /api/reviews.php          -> create a review (login needed)
// PUT    /api/reviews.php?id=3     -> edit own review (login needed)
// DELETE /api/reviews.php?id=3     -> delete own review (login needed)

require_once __DIR__ . '/config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ---------------------------------------------------------------------
// GET ?album=5 : reviews of one album
// ---------------------------------------------------------------------
if ($method === 'GET' && isset($_GET['album'])) {
    // Same check as albums.php: only a whole number of 1 or more
    $albumId = filter_var($_GET['album'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($albumId === false) {
        sendError('Invalid album id.', 400);
    }

    // JOIN users: the card shows who wrote the review.
    // We select only the username and avatar, never email or password_hash.
    $stmt = $pdo->prepare('
        SELECT r.id, r.rating, r.title, r.body, r.listened_at, r.created_at,
               u.id AS user_id, u.username, u.avatar
        FROM reviews r
        JOIN users u ON u.id = r.user_id
        WHERE r.album_id = :album
        ORDER BY r.created_at DESC
    ');
    $stmt->execute(['album' => $albumId]);

    sendJson($stmt->fetchAll());
}

// ---------------------------------------------------------------------
// GET ?mine=1 : reviews of the logged user (My reviews tab)
// ---------------------------------------------------------------------
if ($method === 'GET' && isset($_GET['mine'])) {
    // The user id comes from the session, never from the URL.
    // Otherwise anyone could type ?user=2 and see another user's list.
    $userId = requireLogin();

    // Here we JOIN albums and artists instead of users:
    // the My reviews card shows the album cover, title and artist.
    $stmt = $pdo->prepare('
        SELECT r.id, r.rating, r.title, r.body, r.listened_at, r.created_at,
               a.id AS album_id, a.title AS album_title, a.cover_image,
               ar.name AS artist
        FROM reviews r
        JOIN albums a   ON a.id = r.album_id
        JOIN artists ar ON ar.id = a.artist_id
        WHERE r.user_id = :user
        ORDER BY r.created_at DESC
    ');
    $stmt->execute(['user' => $userId]);

    sendJson($stmt->fetchAll());
}

// No case above matched this request
sendError('Method not allowed.', 405);