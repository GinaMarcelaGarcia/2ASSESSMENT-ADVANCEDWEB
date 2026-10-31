import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./AlbumDetail.css";
import { apiGet, IMAGES_URL } from "../api";
import RandomAlbums from "./RandomAlbums";
import type { Album } from "../types";

type AlbumDetailsData = {
  id: number;
  title: string;
  artist: string;
  artist_style: string;
  genre_id: number;
  genre: string;
  release_date: string;
  writers: string;
  label: string;
  description: string;
  cover_image: string;
  avg_rating: number | null;
  review_count: number;
  year: number;
};

function AlbumDetail() {
  const { id } = useParams();

  const [album, setAlbum] = useState<AlbumDetailsData | null>(null);
  const [error, setError] = useState("");
  const [popularAlbums, setPopularAlbums] = useState<any[]>([]);
  const [randomAlbums, setRandomAlbums] = useState<Album[]>([]);
  const [popularPage, setPopularPage] = useState(1);

  useEffect(() => {
    if (!id) return;

    apiGet<AlbumDetailsData>(`albums.php?id=${id}`)
      .then((data) => setAlbum(data))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  useEffect(() => {
  apiGet<any[]>(`albums.php?popular=1&page=${popularPage}`)
    .then((data) => setPopularAlbums(data))
    .catch((err: Error) => setError(err.message));
}, [popularPage]);

useEffect(() => {
  apiGet<Album[]>("albums.php")
    .then((data) => setRandomAlbums(data))
    .catch((err: Error) => setError(err.message));
}, []);

  if (error) return <p>{error}</p>;
  if (!album) return <p>Loading album...</p>;

  return (
    <div className="album-detail-page">

      <section
        className="album-banner"
        style={{
          backgroundImage: 'url("/BannerDetailAlbum.jpg")',
        }}
      >
      </section>

      <div className="album-intro">
        <h2>Get to know the album</h2>
        <p>Explore its tracks, ratings, reviews and more</p>
      </div>

<div className="album-details-heading">
  <h2>Album details</h2>
  <h2>Popular this week</h2>
</div>


<div className="album-details-layout">

  <section className="album-information">

  <div className="album-top-info">

    <img
      className="album-detail-cover"
      src={`${IMAGES_URL}/${album.cover_image}`}
      alt={`${album.title} album cover`}
    />

    <div className="album-title-rating">
      <h2>{album.title}</h2>

      <div className="album-stars">
        ★★★★★
    </div>
    </div>
    </div>

<div className="album-information-text">

  <p><strong>Artist:</strong> {album.artist}</p>

  <p><strong>Genre:</strong> {album.genre}</p>

  <p><strong>Release date:</strong> {album.release_date}</p>

  <p><strong>Songwriters:</strong> {album.writers}</p>

  <p><strong>Record label:</strong> {album.label}</p>

  <p><strong>Description:</strong> {album.description}</p>

</div>

<div className="write-review-container">
  <span className="write-review-star">⭐</span>

  <button className="write-review-button" type="button">
    Write a review
  </button>

</div>

</section>

<section className="popular-this-week">

<div className="popular-albums-grid">
  {popularAlbums.map((popularAlbum) => (
    <div className="popular-album" key={popularAlbum.id}>
      <img
        src={`${IMAGES_URL}/${popularAlbum.cover_image}`}
        alt={`${popularAlbum.title} album cover`}
      />
      <p>{popularAlbum.title}</p>
    </div>
  ))}
</div>

 <div className="popular-pagination">
  <button
    type="button"
    className={popularPage === 1 ? "active" : ""}
    onClick={() => setPopularPage(1)}
  >
    ●
  </button>

  <button
    type="button"
    className={popularPage === 2 ? "active" : ""}
    onClick={() => setPopularPage(2)}
  >
    ●
  </button>
</div>

</section>

</div>

<div className="album-reviews-heading">
  <h2>Album Reviews</h2>
</div>
<RandomAlbums
  albums={randomAlbums}
  title="You might also like"
/>

    </div>
  );
}

export default AlbumDetail;