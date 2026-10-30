

import { useState } from "react";
import { useNavigate } from "react-router";
import type { Album } from "../types";
import "./RandomAlbums.css";
import { IMAGES_URL } from "../api";

function RandomAlbums({ albums }: { albums: Album[] }) {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);

  const nextAlbums = () => {
    if (albums.length > 0) {
      setStartIndex((current) => (current + 1) % albums.length);
    }
  };

  const previousAlbums = () => {
    if (albums.length > 0) {
      setStartIndex(
        (current) => (current - 1 + albums.length) % albums.length
      );
    }
  };

  const visibleAlbums = Array.from(
    { length: Math.min(4, albums.length) },
    (_, index) => albums[(startIndex + index) % albums.length]
  );

  return (
    <section className="random-albums">
      <div className="albums-heading">
        <h2>Explore Albums</h2>
        <p>Discover something new and find your next favourite</p>
      </div>

      {albums.length === 0 ? (
        <p>No albums found.</p>
      ) : (
        <div className="albums-carousel">
          <button
            className="album-arrow"
            onClick={previousAlbums}
            aria-label="Previous albums"
          >
            &#10094;
          </button>

          <div className="albums-grid">
            {visibleAlbums.map((album) => (
              <div
               className="album-card"
               key={album.id}
               onClick={() => navigate(`/album/${album.id}`)}
                style={{ cursor: "pointer" }}
          >
                <img
                  src={`${IMAGES_URL}/${album.cover_image}`}
                  alt={album.title}
                />
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
              </div>
            ))}
          </div>

          <button
            className="album-arrow"
            onClick={nextAlbums}
            aria-label="Next albums"
          >
            &#10095;
          </button>
        </div>
      )}
    </section>
  );
}

export default RandomAlbums;
