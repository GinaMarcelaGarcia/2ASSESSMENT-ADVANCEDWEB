
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
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

/* REVIEWS */

type Review = {
  id: number;
  name: string;
  photo: string;
  date: string;
  rating: number;
  comment: string;
  favouriteAlbum: string;
  leastFavouriteSong: string;
};

const reviewData: Review[] = [
  {
    id: 1,
    name: "Joe Doe",
    photo: "/1PhotoReview.png",
    date: "25 Sep 2026",
    rating: 5,
    comment:
      "Update (after seeing the opinions of others): Y'all won't be happy with ANYTHING OMG, if any other artist released these four tracks y'all wouldn't shut up about how good they are. 🫩",
    favouriteAlbum: "Lunar Dust",
    leastFavouriteSong: "Cleveland!",
  },
  {
    id: 2,
    name: "Luisa Elz",
    photo: "/2PhotoReview.png",
    date: "26 Sep 2026",
    rating: 5,
    comment:
      "Honestly, I didn’t expect to enjoy this album as much as I did. Some of the songs are definitely more playful than what I usually listen to, but I think that’s what makes it fun.",
    favouriteAlbum: "Velvet Hours",
    leastFavouriteSong: "After the Rain",
  },
];

const reviews: Review[] = [
  ...reviewData,
  ...reviewData,
  ...reviewData,
].map((review, index) => ({
  ...review,
  id: index + 1,
}));

/* END REVIEWS */

function AlbumDetail() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [album, setAlbum] = useState<AlbumDetailsData | null>(null);
  const [error, setError] = useState("");
  const [popularAlbums, setPopularAlbums] = useState<any[]>([]);
  const [randomAlbums, setRandomAlbums] = useState<Album[]>([]);
  const [popularPage, setPopularPage] = useState(1);

  /* REVIEW NAVIGATION */

  const [reviewIndex, setReviewIndex] = useState(0);

  const visibleReviews = [
    reviews[reviewIndex],
    reviews[(reviewIndex + 1) % reviews.length],
  ];

  /* ALBUM DETAILS */

  useEffect(() => {
    if (!id) return;

    apiGet<AlbumDetailsData>(`albums.php?id=${id}`)
      .then((data) => setAlbum(data))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  /* POPULAR ALBUMS */

  useEffect(() => {
    apiGet<any[]>(`albums.php?popular=1&page=${popularPage}`)
      .then((data) => setPopularAlbums(data))
      .catch((err: Error) => setError(err.message));
  }, [popularPage]);

  /* RANDOM ALBUMS */

  useEffect(() => {
    apiGet<Album[]>("albums.php")
      .then((data) => setRandomAlbums(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!album) return <p>Loading album...</p>;

  return (
    <div className="album-detail-page">

      {/* BANNER */}

      <section
        className="album-banner"
        style={{
          backgroundImage: 'url("/BannerDetailAlbum.jpg")',
        }}
      >
      </section>

      {/* INTRO */}

      <div className="album-intro">
        <h2>Get to know the album</h2>
        <p>Explore its tracks, ratings, reviews and more</p>
      </div>

      {/* SECTION HEADINGS */}

      <div className="album-details-heading">
        <h2>Album details</h2>
        <h2>Popular this week</h2>
      </div>

      {/* ALBUM DETAILS LAYOUT */}

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

        {/* POPULAR THIS WEEK */}

        <section className="popular-this-week">

          <div className="popular-albums-grid">

            {popularAlbums.map((popularAlbum) => (
            <div
  className="popular-album"
  key={popularAlbum.id}
  onClick={() => navigate(`/album/${popularAlbum.id}`)}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      navigate(`/album/${popularAlbum.id}`);
    }
  }}
>
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

      {/* ALBUM REVIEWS */}

      <div className="album-reviews-heading">
        <h2>Album Reviews</h2>
      </div>

      <section className="album-reviews-container">

        {/* LEFT ARROW */}

        <button
          className="reviews-arrow reviews-arrow-left"
          type="button"
          onClick={() =>
            setReviewIndex((prev) =>
              (prev - 1 + reviews.length) % reviews.length
            )
          }
          aria-label="Previous reviews"
        >
          &#10094;
        </button>

        {/* REVIEW CARDS */}

        <div className="reviews-grid">

          {visibleReviews.map((review) => (
            <article className="review-card" key={review.id}>

              <div className="review-user-info">

                <img
                  className="review-user-photo"
                  src={review.photo}
                  alt={review.name}
                />

                <div className="review-user-details">

                  <h3>Review by {review.name}</h3>

                  <div className="review-stars">
                    {"★".repeat(review.rating)}
                  </div>

                  <p className="review-date">
                    Reviewed on {review.date}
                  </p>

                </div>

              </div>

              <div className="review-comment">

                <p>{review.comment}</p>

                <p>
                  <strong>Favourite Album:</strong>{" "}
                  {review.favouriteAlbum}
                </p>

                <p>
                  <strong>Least favourite song:</strong>{" "}
                  {review.leastFavouriteSong}
                </p>

              </div>

            </article>
          ))}

        </div>

        {/* RIGHT ARROW */}

        <button
          className="reviews-arrow reviews-arrow-right"
          type="button"
          onClick={() =>
            setReviewIndex((prev) =>
              (prev + 1) % reviews.length
            )
          }
          aria-label="Next reviews"
        >
          &#10095;
        </button>

      </section>

      {/* YOU MIGHT ALSO LIKE */}

      <RandomAlbums
        albums={randomAlbums}
        title="You might also like"
      />

    </div>
  );
}

export default AlbumDetail;
