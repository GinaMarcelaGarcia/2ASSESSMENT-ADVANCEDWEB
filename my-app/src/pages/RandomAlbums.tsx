
import { useState } from "react";
import "./RandomAlbums.css";

const albums = [
  {
    title: "Teenage Dream",
    image: "/ImagesHome/PHOTO1.1.png",
  },
  {
    title: "Born This Way",
    image: "/ImagesHome/PHOTO1.2.png",
  },
  {
    title: "Melodrama",
    image: "/ImagesHome/PHOTO1.4.png",
  },
  {
    title: "Future Nostalgia",
    image: "/ImagesHome/PHOTO1.3.png",
  },
];

function RandomAlbums() {
  const [startIndex, setStartIndex] = useState(0);

  const nextAlbums = () => {
    setStartIndex((current) => (current + 1) % albums.length);
  };

  const previousAlbums = () => {
    setStartIndex(
      (current) => (current - 1 + albums.length) % albums.length
    );
  };

  const visibleAlbums = Array.from({ length: 4 }, (_, index) => {
    return albums[(startIndex + index) % albums.length];
  });

  return (
    <section className="random-albums">
<div className="albums-heading">
  <h2>Explore Albums</h2>
  <p>Discover something new and find your next favourite</p>
</div>

      <div className="albums-carousel">
        <button
          className="album-arrow"
          onClick={previousAlbums}
          aria-label="Previous albums"
        >
          &#10094;
        </button>

        <div className="albums-grid">
          {visibleAlbums.map((album, index) => (
            <div className="album-card" key={`${album.title}-${index}`}>
              <img src={album.image} alt={album.title} />
              <h3>{album.title}</h3>
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
    </section>
  );
}

export default RandomAlbums;
