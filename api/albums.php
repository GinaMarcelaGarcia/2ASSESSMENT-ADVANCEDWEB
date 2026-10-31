<?php
// albums.php
// GET /api/albums.php            -> 8 random albums (Home page cards)
// GET /api/albums.php?genre=3    -> 8 random albums from one genre (genre filter)
// GET /api/albums.php?id=1       -> one album with all details (Album Detail page)

require_once __DIR__ . '/config.php';

// This endpoint only reads data
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed.', 405);
}

$pdo = getDB();

// MySQL returns AVG() as text (e.g. "4.3"), so we change it to a number for React.
// Albums with no reviews have avg_rating NULL, and we keep it null.
function fixRating($album)
{
    if ($album['avg_rating'] !== null) {
        $album['avg_rating'] = (float) $album['avg_rating'];
    }
    return $album;
}

// ---------------------------------------------------------------------
// One album: ?id=1
// ---------------------------------------------------------------------
if (isset($_GET['id'])) {
    // id comes from the URL, so the user can type anything.
    // filter_var() only accepts a whole number of 1 or more, otherwise it gives false.
    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false) {
        sendError('Invalid album id.', 400);
    }

    // LEFT JOIN reviews: the album still shows even when it has no reviews yet.
    // GROUP BY a.id: AVG and COUNT are calculated per album.
    $stmt = $pdo->prepare('
        SELECT a.id, a.title,
               ar.name  AS artist, ar.style AS artist_style,
               g.id     AS genre_id, g.name AS genre,
               a.release_date, a.writers, a.label, a.description, a.cover_image,
               ROUND(AVG(r.rating), 1) AS avg_rating,
               COUNT(r.id)             AS review_count
        FROM albums a
        JOIN artists ar     ON ar.id = a.artist_id
        JOIN genres g       ON g.id = a.genre_id
        LEFT JOIN reviews r ON r.album_id = a.id
        WHERE a.id = :id
        GROUP BY a.id
    ');
    $stmt->execute(['id' => $id]); // the value goes separately, never inside the SQL text
    $album = $stmt->fetch();

    // fetch() gives false when no row was found
    if ($album === false) {
        sendError('Album not found.', 404);
    }

    sendJson(fixRating($album));
}


// ---------------------------------------------------------------------
// Popular albums: ?popular=1&page=1 or ?popular=1&page=2
// ---------------------------------------------------------------------
if (isset($_GET['popular'])) {

    $page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 2]
    ]);

    if ($page === false) {
        sendError('Invalid page number.', 400);
    }

    $offset = ($page - 1) * 9;

    $stmt = $pdo->prepare('
        SELECT a.id, a.title,
               ar.name AS artist,
               g.name AS genre,
               YEAR(a.release_date) AS year,
               a.cover_image,
               ROUND(AVG(r.rating), 1) AS avg_rating,
               COUNT(r.id) AS review_count
        FROM albums a
        JOIN artists ar ON ar.id = a.artist_id
        JOIN genres g ON g.id = a.genre_id
        LEFT JOIN reviews r ON r.album_id = a.id
        GROUP BY a.id
        ORDER BY a.id ASC
        LIMIT 9 OFFSET :offset
    ');

    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $albums = $stmt->fetchAll();
    $albums = array_map('fixRating', $albums);

    sendJson($albums);
}

// ---------------------------------------------------------------------
// List of albums: genre filter or Home page
// ---------------------------------------------------------------------
if (isset($_GET['genre'])) {

    $genreId = filter_var($_GET['genre'], FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1]
    ]);

    if ($genreId === false) {
        sendError('Invalid genre id.', 400);
    }

    $stmt = $pdo->prepare('
        SELECT a.id, a.title,
               ar.name AS artist,
               g.name AS genre,
               YEAR(a.release_date) AS year,
               a.cover_image,
               ROUND(AVG(r.rating), 1) AS avg_rating,
               COUNT(r.id) AS review_count
        FROM albums a
        JOIN artists ar ON ar.id = a.artist_id
        JOIN genres g ON g.id = a.genre_id
        LEFT JOIN reviews r ON r.album_id = a.id
        WHERE a.genre_id = :genre
        GROUP BY a.id
        ORDER BY RAND()
        LIMIT 12
    ');

    $stmt->execute(['genre' => $genreId]);

} else {

    $stmt = $pdo->prepare('
        SELECT a.id, a.title,
               ar.name AS artist,
               g.name AS genre,
               YEAR(a.release_date) AS year,
               a.cover_image,
               ROUND(AVG(r.rating), 1) AS avg_rating,
               COUNT(r.id) AS review_count
        FROM albums a
        JOIN artists ar ON ar.id = a.artist_id
        JOIN genres g ON g.id = a.genre_id
        LEFT JOIN reviews r ON r.album_id = a.id
        GROUP BY a.id
        ORDER BY RAND()
        LIMIT 12
    ');

    $stmt->execute();
}

$albums = $stmt->fetchAll();
$albums = array_map('fixRating', $albums);

sendJson($albums);
