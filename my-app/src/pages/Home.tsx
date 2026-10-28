

import { useEffect, useState } from "react";
import "./HomeTrack.css";
import RandomAlbums from "./RandomAlbums";
import type { Album } from "../types";

function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/albums.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load albums");
        }
        return response.json();
      })
      .then((result) => {
        if (!result.success) {
          throw new Error("Could not load albums");
        }
        console.log("Albums received:", result.data.length);
        setAlbums(result.data);
      })
      .catch(() => {
        setError("Albums could not be loaded.");
      });
  }, []);

  const genres = [...new Set(albums.map((album) => album.genre))].sort();
  const artists = [...new Set(albums.map((album) => album.artist))].sort();
  const years = [...new Set(albums.map((album) => album.year))].sort(
    (a, b) => b - a
  );

  const filteredAlbums = albums.filter((album) => {
  return (
    (!genre || album.genre === genre) &&
    (!artist || album.artist === artist) &&
    (!year || album.year === Number(year))
  );
});

const topAlbumIds = new Set(albums.slice(0, 4).map((album) => album.id));

const galleryAlbums = filteredAlbums.filter(
  (album) => !topAlbumIds.has(album.id)
);
console.log("Albums in gallery:", galleryAlbums.length);

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

      {error ? <p>{error}</p> : <RandomAlbums albums={albums} />}

      <section className="filter-albums">
        <h2 className="filter-title">
          <i className="bi bi-sliders2"></i>
          Filter Albums
        </h2>

        <div className="filter-options">
          <label>
            Genre
            <select
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            >
              <option value="">All genres</option>
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
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

      {/* BROWSE BY RAITING */}

      
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

{/* 2 Galery in Home */}

<section className="album-gallery">

  <div className="gallery-grid">
    {galleryAlbums.map((album) => (
      <div className="gallery-card" key={album.id}>
        <img
          src={`/assets/${album.cover_image}`}
          alt={album.title}
        />
        <h3>{album.title}</h3>
        <p>{album.artist}</p>
        <span>{album.year}</span>
      </div>
    ))}
  </div>

<button className="load-more-button" type="button">
  Load More
</button>
</section>

</>
);
}

export default Home;