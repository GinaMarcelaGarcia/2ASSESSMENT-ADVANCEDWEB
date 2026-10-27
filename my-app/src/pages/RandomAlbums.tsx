
import { useEffect, useState } from "react";
import "./RandomAlbums.css";

type Album = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: number;
  cover_image: string;
  avg_rating: number | null;
  review_count: number;
};

function RandomAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/albums.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load albums.");
        }
        return response.json();
      })
      .then((result) => {
        if (!result.success) {
          throw new Error(result.error || "Could not load albums.");
        }
        setAlbums(result.data);
      })
      .catch(() => {
        setError("Albums could not be loaded. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

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

      {loading && <p>Loading albums...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && albums.length === 0 && (
        <p>No albums available yet.</p>
      )}

      {!loading && !error && albums.length > 0 && (
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
              <div className="album-card" key={album.id}>
                <img
                  src={`/assets/${album.cover_image}`}
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
