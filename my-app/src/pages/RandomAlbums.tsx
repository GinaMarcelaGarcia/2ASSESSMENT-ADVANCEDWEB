import { useState } from "react";  // Import React state hook
import { useNavigate } from "react-router";  // Import navigation hook
import type { Album } from "../types";  // Import Album type
import "./RandomAlbums.css"; // Import component styles
import { IMAGES_URL } from "../api"; // Import album images URL

// Random Albums component
function RandomAlbums({
  albums,
  title = "Explore Albums",
}: {
  albums: Album[];
  title?: string;
}) {
  // Initialise navigation and carousel state
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);

  // Move the carousel to the next album
  const nextAlbums = () => {
    if (albums.length > 0) {
      setStartIndex((current) => (current + 1) % albums.length);
    }
  };

  // Move the carousel to the previous album
  const previousAlbums = () => {
    if (albums.length > 0) {
      setStartIndex(
        (current) => (current - 1 + albums.length) % albums.length
      );
    }
  };

  // Get up to four albums to display in the carousel
  const visibleAlbums = Array.from(
    { length: Math.min(4, albums.length) },
    (_, index) => albums[(startIndex + index) % albums.length]
  );

  return (
    // Main Random Albums section
    <section className="random-albums">
      <div className="albums-heading">
        <h2>{title}</h2>
        <p>Discover something new and find your next favourite</p>
      </div>

      {/* Display a message when no albums are available */}
      {albums.length === 0 ? (
        <p>No albums found.</p>
      ) : (
        // Display the album carousel
        <div className="albums-carousel">
          {/* Previous albums button */}
          <button
            className="album-arrow"
            onClick={previousAlbums}
            aria-label="Previous albums"
          >
            &#10094;
          </button>

          {/* Display the visible album cards */}
          <div className="albums-grid">
            {visibleAlbums.map((album) => (
              <div
               className="album-card"
               key={album.id}
               onClick={() => navigate(`/album/${album.id}`)}
                style={{ cursor: "pointer" }}
          >
                {/* Album cover image */}
                <img
                  src={`${IMAGES_URL}/${album.cover_image}`}
                  alt={album.title}
                />
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
              </div>
            ))}
          </div>

          {/* Next albums button */}
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

// Export component for use in other files
export default RandomAlbums;