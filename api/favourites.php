
<?php
// favourites.php
// GET    /api/favourites.php?album=5 -> check if an album is a favourite
// GET    /api/favourites.php?mine=1   -> get the logged user's favourite albums
// POST   /api/favourites.php          -> add an album to favourites
// DELETE /api/favourites.php?album=5  -> remove an album from favourites

require_once __DIR__ . '/config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ---------------------------------------------------------------------
// GET ?album=5 : check if one album is a favourite
// ---------------------------------------------------------------------
if ($method === 'GET' && isset($_GET['album'])) {
    $userId = requireLogin();

    $albumId = filter_var($_GET['album'], FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1]
    ]);

    if ($albumId === false) {
        sendError('Invalid album id.', 400);
    }

    $stmt = $pdo->prepare('
        SELECT album_id
        FROM favourites
        WHERE user_id = :user AND album_id = :album
    ');
    $stmt->execute([
        'user' => $userId,
        'album' => $albumId
    ]);

    sendJson(['is_favourite' => $stmt->fetch() !== false]);
}

// ---------------------------------------------------------------------
// GET ?mine=1 : get the logged user's favourite albums
// ---------------------------------------------------------------------
if ($method === 'GET' && isset($_GET['mine'])) {
    $userId = requireLogin();

    $stmt = $pdo->prepare('
        SELECT a.id, a.title,
               ar.name AS artist,
               g.name AS genre,
               YEAR(a.release_date) AS year,
               a.cover_image,
               ROUND(AVG(r.rating), 1) AS avg_rating,
               COUNT(r.id) AS review_count
        FROM favourites f
        JOIN albums a ON a.id = f.album_id
        JOIN artists ar ON ar.id = a.artist_id
        JOIN genres g ON g.id = a.genre_id
        LEFT JOIN reviews r ON r.album_id = a.id
        WHERE f.user_id = :user
        GROUP BY a.id
        ORDER BY f.created_at DESC
    ');
    $stmt->execute(['user' => $userId]);

    $albums = $stmt->fetchAll();

    foreach ($albums as &$album) {
        if ($album['avg_rating'] !== null) {
            $album['avg_rating'] = (float) $album['avg_rating'];
        }
        $album['id'] = (int) $album['id'];
        $album['year'] = (int) $album['year'];
        $album['review_count'] = (int) $album['review_count'];
    }
    unset($album);

    sendJson($albums);
}

// ---------------------------------------------------------------------
// POST : add an album to favourites
// Body (JSON): { album_id }
// ---------------------------------------------------------------------
if ($method === 'POST') {
    $userId = requireLogin();
    $data = getJsonBody();

    $albumId = filter_var($data['album_id'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1]
    ]);

    if ($albumId === false) {
        sendError('Invalid album id.', 400);
    }

    $check = $pdo->prepare('SELECT id FROM albums WHERE id = :id');
    $check->execute(['id' => $albumId]);

    if ($check->fetch() === false) {
        sendError('Album not found.', 404);
    }

    // INSERT IGNORE prevents duplicate favourites.
    $stmt = $pdo->prepare('
        INSERT IGNORE INTO favourites (user_id, album_id)
        VALUES (:user, :album)
    ');
    $stmt->execute([
        'user' => $userId,
        'album' => $albumId
    ]);

    sendJson(['album_id' => $albumId]);
}

// ---------------------------------------------------------------------
// DELETE ?album=5 : remove an album from favourites
// ---------------------------------------------------------------------
if ($method === 'DELETE') {
    $userId = requireLogin();

    $albumId = filter_var($_GET['album'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1]
    ]);

    if ($albumId === false) {
        sendError('Invalid album id.', 400);
    }

    $stmt = $pdo->prepare('
        DELETE FROM favourites
        WHERE user_id = :user AND album_id = :album
    ');
    $stmt->execute([
        'user' => $userId,
        'album' => $albumId
    ]);

    sendJson(['album_id' => $albumId]);
}

// No case above matched this request
sendError('Method not allowed.', 405);
