import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router";
import "./HomeTrack.css";
import RandomAlbums from "./RandomAlbums";
import { apiGet, IMAGES_URL } from "../api";
import type { Album, Genre } from "../types";

function Home() {
  // Carousel: random albums, always without filter (discovery)
  const [exploreAlbums, setExploreAlbums] = useState<Album[]>([]);
  // Gallery: albums of the chosen genre (or random if no genre)
  const [albums, setAlbums] = useState<Album[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  // The genre lives in the URL (/?genre=3), so the Navbar menu
  // and the dropdown on this page always show the same thing
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = searchParams.get("genre") ?? "";

  // Load once: carousel albums + full genre list from the database
  useEffect(() => {
    apiGet<Album[]>("albums.php")
      .then((data) => setExploreAlbums(data))
      .catch((err: Error) => setError(err.message));

    apiGet<Genre[]>("genres.php")
      .then((data) => setGenres(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  // Load the gallery again every time the genre in the URL changes
  useEffect(() => {
    const path = genreId ? `albums.php?genre=${genreId}` : "albums.php";

    apiGet<Album[]>(path)
      .then((data) => {
        setAlbums(data);
        setArtist(""); // old artist/year may not exist in the new genre
        setYear("");
        setError("");
      })
      .catch((err: Error) => setError(err.message));
  }, [genreId]);

  // Changing the dropdown only changes the URL; the effect above does the rest
  const changeGenre = (value: string) => {
    setSearchParams(value ? { genre: value } : {});
  };

  // Artist and year options come from the albums already loaded (client-side)
  const artists = [...new Set(albums.map((album) => album.artist))].sort();
  const years = [...new Set(albums.map((album) => album.year))].sort(
    (a, b) => b - a
  );

  const filteredAlbums = albums.filter((album) => {
    return (
      (!artist || album.artist === artist) &&
      (!year || album.year === Number(year))
    );
  });

  return (
    <>
      <section className="home-banner">
        <div className="home-banner-content">
          <div className="home-banner-label">
            Listen, rate and share
          </div>

          <p>
            Explore albums, discover new sounds
            <br />
            and share your reviews
          </p>

          <button className="home-banner-button">
            JOIN NOW
          </button>
        </div>
      </section>

      {error ? (
        <Container className="py-4">
          <p className="text-danger">{error}</p>
        </Container>
      ) : (
        <RandomAlbums albums={exploreAlbums} />
      )}

      <section className="filter-albums">
        <h2 className="filter-title">
          <i className="bi bi-sliders2"></i>
          Filter Albums
        </h2>

        <div className="filter-options">
          <label>
            Genre
            <select
              value={genreId}
              onChange={(event) => changeGenre(event.target.value)}
            >
              <option value="">All genres</option>
              {genres.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Artist
            <select
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
            >
              <option value="">All artists</option>
              {artists.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Release Year
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="">All years</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* BROWSE BY RATING */}
      <section className="browse-rating">
        <h2>Browse by rating</h2>

        <div className="rating-options">
          <button type="button" className="rating-option">
            <span className="rating-emoji">🔥</span>
            <span>Most heard</span>
          </button>

          <button type="button" className="rating-option">
            <span className="rating-emoji">💗</span>
            <span>Loved</span>
          </button>

          <button type="button" className="rating-option">
            <span className="rating-emoji">😐</span>
            <span>Okay</span>
          </button>
        </div>
      </section>

      {/* GALLERY */}
      <section className="album-gallery">
        {filteredAlbums.length === 0 ? (
          <p className="text-center">No albums found for this filter.</p>
        ) : (
          <div className="gallery-grid">
            {filteredAlbums.map((album) => (
              <div className="gallery-card" key={album.id}>
                <img
                  src={`${IMAGES_URL}/${album.cover_image}`}
                  alt={album.title}
                />
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
                <span>{album.year}</span>
              </div>
            ))}
          </div>
        )}

        <button className="load-more-button" type="button">
          Load More
        </button>
      </section>
    </>
  );
}

export default Home;
