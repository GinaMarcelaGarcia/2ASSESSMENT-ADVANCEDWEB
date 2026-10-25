-- =====================================================================
-- TrackBack - database schema + sample data
-- INT1059 Advanced Web - Group Dragonfruit
--
-- How to use: phpMyAdmin -> Import -> choose this file -> Import.
-- WARNING: importing again deletes every table and starts from zero
-- (registered users and reviews are lost). Only re-import on purpose.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS trackback
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE trackback;

-- Drop in reverse order: tables that point to others go first
DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------
-- users: people who register and log in
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username      VARCHAR(30)  NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,          -- result of password_hash(), never the real password
    avatar        VARCHAR(255) NULL DEFAULT NULL, -- image file name, optional
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- genres: list used by the genre dropdown and the genre filter
-- ---------------------------------------------------------------------
CREATE TABLE genres (
    id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_genres_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- artists: one artist can have many albums
-- ---------------------------------------------------------------------
CREATE TABLE artists (
    id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name  VARCHAR(100) NOT NULL,
    style VARCHAR(100) NULL DEFAULT NULL,  -- short label under the name, e.g. "Singer-Songwriter"
    PRIMARY KEY (id),
    UNIQUE KEY uq_artists_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- albums: the collection (live dataset)
-- ---------------------------------------------------------------------
CREATE TABLE albums (
    id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title        VARCHAR(150) NOT NULL,
    artist_id    INT UNSIGNED NOT NULL,
    genre_id     INT UNSIGNED NOT NULL,
    release_date DATE         NOT NULL,
    writers      VARCHAR(255) NULL DEFAULT NULL,  -- "Writer" line on the detail page
    label        VARCHAR(100) NULL DEFAULT NULL,  -- record label
    description  TEXT         NULL,
    cover_image  VARCHAR(255) NOT NULL,           -- file name inside assets/images/albums/
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_albums_artist (artist_id),
    KEY idx_albums_genre (genre_id),
    KEY idx_albums_release_date (release_date),
    CONSTRAINT fk_albums_artist FOREIGN KEY (artist_id) REFERENCES artists (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_albums_genre FOREIGN KEY (genre_id) REFERENCES genres (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- reviews: created now, used in Assessment 3
-- One review per user per album (edit instead of posting twice).
-- The album star rating = AVG(rating) of its reviews, so albums has no rating column.
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
    id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED     NOT NULL,
    album_id    INT UNSIGNED     NOT NULL,
    rating      TINYINT UNSIGNED NOT NULL,
    title       VARCHAR(100)     NOT NULL,
    body        TEXT             NOT NULL,
    listened_at DATE             NULL DEFAULT NULL,  -- "Listened at" in the Create Review pop-up
    created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_reviews_user_album (user_id, album_id),
    KEY idx_reviews_album (album_id),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_reviews_album FOREIGN KEY (album_id) REFERENCES albums (id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- favourites: created now, used in Assessment 3
-- The pair (user, album) is the key, so the same album cannot be saved twice.
-- ---------------------------------------------------------------------
CREATE TABLE favourites (
    user_id    INT UNSIGNED NOT NULL,
    album_id   INT UNSIGNED NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, album_id),
    KEY idx_favourites_album (album_id),
    CONSTRAINT fk_favourites_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_favourites_album FOREIGN KEY (album_id) REFERENCES albums (id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SAMPLE DATA (all artists, albums and labels are made up)
-- =====================================================================

INSERT INTO genres (id, name) VALUES
    (1, 'Pop'),
    (2, 'Rock'),
    (3, 'Electronic'),
    (4, 'Hip-Hop'),
    (5, 'Metal'),
    (6, 'Indie Folk'),
    (7, 'R&B / Soul'),
    (8, 'Jazz');

INSERT INTO artists (id, name, style) VALUES
    (1,  'Luna Parker',    'Singer-Songwriter'),
    (2,  'Sophie Hunter',  'Producer'),
    (3,  'Noah Fletcher',  'Band'),
    (4,  'Ella Cooper',    'Singer'),
    (5,  'Evan Kingston',  'Rapper'),
    (6,  'Henry Lee',      'Pianist'),
    (7,  'Nina Smith',     'Singer'),
    (8,  'Jack Harrison',  'Band'),
    (9,  'Maya Sterling',  'Singer'),
    (10, 'Grace Lewis',    'Singer-Songwriter'),
    (11, 'Oscar Reyes',    'DJ / Producer'),
    (12, 'James Anderson', 'Band'),
    (13, 'Ruby Sinclair',  'Saxophonist'),
    (14, 'Chloe Bennett',  'Rapper'),
    (15, 'Emily Carson',   'Singer-Songwriter');

INSERT INTO albums (id, title, artist_id, genre_id, release_date, writers, label, description, cover_image) VALUES
    (1,  'Midnight Tea',          1,  6, '2019-03-15', 'Luna Parker, Tom Ashby',         'Ember & Oak Records',
         'A quiet late-night record built on fingerpicked guitar and soft harmonies. Songs about insomnia, old letters and small kitchens.', 'midnight-tea.jpg'),
    (2,  'Paper Lanterns',        1,  6, '2022-09-02', 'Luna Parker',                    'Ember & Oak Records',
         'Brighter and warmer than her debut, with banjo, strings and a children''s choir on the closing track.', 'paper-lanterns.jpg'),
    (3,  'Lunar Dust',            2,  3, '2021-11-19', 'Sophie Hunter',                  'Static Bloom',
         'Slow-building synth pieces inspired by night flights and empty airports. Best heard with headphones.', 'lunar-dust.jpg'),
    (4,  'Glass Harbour',         2,  3, '2016-05-06', 'Sophie Hunter, Kai Morton',      'Static Bloom',
         'Her first album mixes field recordings from a fishing port with soft drum machines and looping vocals.', 'glass-harbour.jpg'),
    (5,  'Subterranean',          3,  2, '2008-02-22', 'Noah Fletcher, Dan Hollis',      'Northside Music',
         'A loud, raw garage rock album recorded live in a basement in four days.', 'subterranean.jpg'),
    (6,  'Rust Belt Radio',       3,  2, '1994-08-12', 'Noah Fletcher',                  'Northside Music',
         'Heavy guitars and big choruses about small towns, night shifts and long drives.', 'rust-belt-radio.jpg'),
    (7,  'Angel',                 4,  1, '2017-06-30', 'Ella Cooper, Mia Grant',         'Harbour Lights Records',
         'A summer pop album full of hand claps, bright synths and catchy hooks.', 'angel.jpg'),
    (8,  'Sugar Static',          4,  1, '2023-04-14', 'Ella Cooper',                    'Harbour Lights Records',
         'A darker turn for Ella Cooper, with glitchy production and lyrics about life online.', 'sugar-static.jpg'),
    (9,  'Metropolitan',          5,  4, '2015-10-09', 'Evan Kingston, Leo Marsh',       'Concrete Records',
         'Sharp storytelling over jazzy samples, following one day in a busy city.', 'metropolitan.jpg'),
    (10, 'Concrete Gardens',      5,  4, '2020-07-24', 'Evan Kingston',                  'Concrete Records',
         'A personal record about growing up in public housing, with live bass and soul samples.', 'concrete-gardens.jpg'),
    (11, 'Subtle Shifts',         6,  8, '2012-01-27', 'Henry Lee',                      'Blue Lantern Records',
         'A piano trio album with long, calm pieces and plenty of space between the notes.', 'subtle-shifts.jpg'),
    (12, 'Blue Room Sessions',    6,  8, '1987-03-20', 'Henry Lee, Sam Okafor',          'Blue Lantern Records',
         'Recorded in one night at a small club. Warm, loose and full of crowd noise.', 'blue-room-sessions.jpg'),
    (13, 'Velvet Hours',          7,  7, '2018-02-09', 'Nina Smith, Andre Wells',        'Golden Hour Music',
         'Smooth neo-soul with live horns and a voice that carries every song.', 'velvet-hours.jpg'),
    (14, 'Honey & Smoke',         7,  7, '2010-11-05', 'Nina Smith',                     'Golden Hour Music',
         'A classic soul sound with a modern touch. Love songs, breakup songs and one long gospel finale.', 'honey-and-smoke.jpg'),
    (15, 'Iron Orchard',          8,  5, '2005-09-16', 'Jack Harrison, Ryan Cole',       'Black Anvil Records',
         'Fast, heavy and loud. Thrash riffs mixed with slower doom sections.', 'iron-orchard.jpg'),
    (16, 'Ashes of Tomorrow',     8,  5, '1999-04-23', 'Jack Harrison',                  'Black Anvil Records',
         'The band''s first album, a concept record about a city rebuilt after a fire.', 'ashes-of-tomorrow.jpg'),
    (17, 'Neon Postcards',        9,  1, '2014-08-01', 'Maya Sterling, Jade Ruiz',       'Harbour Lights Records',
         'Shiny 80s-style pop with big drums and lyrics about travelling and missing home.', 'neon-postcards.jpg'),
    (18, 'Satellite Hearts',      9,  1, '2024-02-16', 'Maya Sterling',                  'Harbour Lights Records',
         'A mature pop record mixing ballads with dance tracks, all about long-distance love.', 'satellite-hearts.jpg'),
    (19, 'Northbound',            10, 6, '2011-10-14', 'Grace Lewis',                    'Ember & Oak Records',
         'Recorded in a cabin during winter. Acoustic guitar, harmonica and a lot of honesty.', 'northbound.jpg'),
    (20, 'Wildflower Road',       10, 6, '2006-05-19', 'Grace Lewis, Ben Archer',        'Ember & Oak Records',
         'Warm folk songs about family, road trips and leaving home for the first time.', 'wildflower-road.jpg'),
    (21, 'Pulse Theory',          11, 3, '2013-03-08', 'Oscar Reyes',                    'Static Bloom',
         'Club-ready house tracks with Latin percussion and deep bass lines.', 'pulse-theory.jpg'),
    (22, 'Afterglow District',    11, 3, '2025-06-27', 'Oscar Reyes, Lina Duarte',       'Static Bloom',
         'A sunrise album: slower, melodic electronic music made for the end of the night.', 'afterglow-district.jpg'),
    (23, 'Thunder County',        12, 2, '1985-07-05', 'James Anderson, Rick Dalton',    'Northside Music',
         'Classic stadium rock with long guitar solos and sing-along choruses.', 'thunder-county.jpg'),
    (24, 'Electric Prairie',      12, 2, '1989-09-29', 'James Anderson',                 'Northside Music',
         'The band mixes country roots with hard rock on their most popular album.', 'electric-prairie.jpg'),
    (25, 'Cold Coffee Club',      13, 8, '2001-02-02', 'Ruby Sinclair',                  'Blue Lantern Records',
         'Relaxed saxophone jazz for slow mornings, with brushes on the drums and upright bass.', 'cold-coffee-club.jpg'),
    (26, 'Saxophone Weather',     13, 8, '1996-10-18', 'Ruby Sinclair, Paul Greer',      'Blue Lantern Records',
         'Each track is named after a type of weather, from light drizzle to full storm.', 'saxophone-weather.jpg'),
    (27, 'Second Floor Stories',  14, 4, '2003-05-30', 'Chloe Bennett',                  'Concrete Records',
         'A debut full of clever rhymes about neighbours, school and the first job.', 'second-floor-stories.jpg'),
    (28, 'Corner Store Poetry',   14, 4, '2009-12-04', 'Chloe Bennett, Marcus Hale',     'Concrete Records',
         'Boom-bap beats and sharp lyrics, recorded with a live band.', 'corner-store-poetry.jpg'),
    (29, 'Rosewater',             15, 7, '2016-04-08', 'Emily Carson',                   'Golden Hour Music',
         'Soft R&B with acoustic guitar and layered vocals about growing up and letting go.', 'rosewater.jpg'),
    (30, 'Slow Bloom',            15, 7, '2021-08-20', 'Emily Carson, Noel Hart',        'Golden Hour Music',
         'Her second album adds strings and slow grooves. A patient, warm record.', 'slow-bloom.jpg');

-- ---------------------------------------------------------------------
-- Test user: lets us test login before register is ready
--   email:    test@trackback.com
--   password: Test1234
-- The password is saved as a hash made with PHP password_hash(),
-- so login.php checks it with password_verify() like any other user.
-- ---------------------------------------------------------------------
INSERT INTO users (id, username, email, password_hash) VALUES
    (1, 'testuser', 'test@trackback.com', '$2y$10$lUxQPKFlP7OGkrhMJjVawuxD4XrCbl5xIubKI/CVlxtP.W7wD.SVC');
