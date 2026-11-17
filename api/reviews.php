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

// Checks the fields of a review (used by POST and PUT).
// Sends a 400 error if something is wrong, otherwise returns the clean values.
function validateReview($data)
{
    $rating = filter_var($data['rating'] ?? null, FILTER_VALIDATE_INT,
        ['options' => ['min_range' => 1, 'max_range' => 5]]);
    if ($rating === false) {
        sendError('Rating must be a whole number from 1 to 5.', 400);
    }

    $title = trim((string) ($data['title'] ?? ''));
    if ($title === '' || mb_strlen($title) > 100) {
        sendError('Title is required (max 100 characters).', 400);
    }

    $body = trim((string) ($data['body'] ?? ''));
    if ($body === '' || mb_strlen($body) > 2000) {
        sendError('Review text is required (max 2000 characters).', 400);
    }

    // "Listened at" is optional. Empty means NULL in the database.
    $listenedAt = trim((string) ($data['listened_at'] ?? ''));
    if ($listenedAt === '') {
        $listenedAt = null;
    } else {
        // Only a real date like 2026-11-17, and not in the future
        $date = DateTime::createFromFormat('Y-m-d', $listenedAt);
        if ($date === false || $date->format('Y-m-d') !== $listenedAt || $listenedAt > date('Y-m-d')) {
            sendError('Listened at must be a valid date, not in the future.', 400);
        }
    }

    return [
        'rating' => $rating,
        'title' => $title,
        'body' => $body,
        'listened_at' => $listenedAt,
    ];
}

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

// ---------------------------------------------------------------------
// POST : create a review
// Body (JSON): { album_id, rating, title, body, listened_at (optional) }
// ---------------------------------------------------------------------
if ($method === 'POST') {
    $userId = requireLogin();
    $data = getJsonBody();

    $albumId = filter_var($data['album_id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($albumId === false) {
        sendError('Invalid album id.', 400);
    }
    $review = validateReview($data);

    // The album must exist. Gives a clear 404 instead of a database error.
    $check = $pdo->prepare('SELECT id FROM albums WHERE id = :id');
    $check->execute(['id' => $albumId]);
    if ($check->fetch() === false) {
        sendError('Album not found.', 404);
    }

    try {
        $stmt = $pdo->prepare('
            INSERT INTO reviews (user_id, album_id, rating, title, body, listened_at)
            VALUES (:user, :album, :rating, :title, :body, :listened_at)
        ');
        $stmt->execute([
            'user' => $userId, // from the session, never from the body
            'album' => $albumId,
            'rating' => $review['rating'],
            'title' => $review['title'],
            'body' => $review['body'],
            'listened_at' => $review['listened_at'],
        ]);
    } catch (PDOException $e) {
        // 23000 = the UNIQUE (user_id, album_id) rule broke:
        // this user already has a review for this album
        if ($e->getCode() === '23000') {
            sendError('You already reviewed this album. You can edit your review instead.', 409);
        }
        throw $e; // any other error goes to the safety net in config.php
    }

    // 201 = "created". We send back the new id.
    sendJson(['id' => (int) $pdo->lastInsertId()], 201);
}

// No case above matched this request
sendError('Method not allowed.', 405);