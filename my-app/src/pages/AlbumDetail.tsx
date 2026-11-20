
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import "./AlbumDetail.css";
import { apiGet, apiPost, apiDelete, IMAGES_URL } from "../api";
import RandomAlbums from "./RandomAlbums";
import type { Album, AlbumReview } from "../types";
import ReviewModal from "../components/ReviewModal";

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

// "2026-11-17 18:39:50" (MySQL format) -> "17 Nov 2026"
function formatDate(mysqlDate: string) {
  return new Date(mysqlDate.replace(" ", "T")).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
/* END REVIEWS */

function AlbumDetail() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [album, setAlbum] = useState<AlbumDetailsData | null>(null);
  const [error, setError] = useState("");
  const [popularAlbums, setPopularAlbums] = useState<any[]>([]);
  const [randomAlbums, setRandomAlbums] = useState<Album[]>([]);
  const [popularPage, setPopularPage] = useState(1);

    /* REVIEWS */

  const [reviews, setReviews] = useState<AlbumReview[]>([]);
  const [reviewsError, setReviewsError] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);

    // Goes up by 1 after a review is saved: the album and the reviews load again
  const [reloadKey, setReloadKey] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [modalReview, setModalReview] = useState<AlbumReview | null>(null);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  // FAVOURITES
const [isFavourite, setIsFavourite] = useState(false);
const [favouriteLoading, setFavouriteLoading] = useState(false);
const [favouriteError, setFavouriteError] = useState("");

// CHECK FAVOURITE STATUS
useEffect(() => {
  if (!id || !currentUserId) {
    setIsFavourite(false);
    return;
  }

  apiGet<{ is_favourite: boolean }>(`favourites.php?album=${id}`)
    .then((data) => setIsFavourite(data.is_favourite))
    .catch((err: Error) => setFavouriteError(err.message));
}, [id, currentUserId]);

  useEffect(() => {
    apiGet<{ id: number; username: string } | null>("me.php")
      .then((user) => setCurrentUserId(user ? user.id : null))
      .catch(() => setCurrentUserId(null));
  }, [showReviewModal]); // asks again when a modal closes (e.g. after logging in)

  const hasMyReview = reviews.some((review) => review.user_id === currentUserId); 

  // TOGGLE FAVOURITE
async function handleFavourite() {
  if (!currentUserId) {
    navigate("/login");
    return;
  }

  if (!id || favouriteLoading) return;

  setFavouriteLoading(true);
  setFavouriteError("");

  try {
    if (isFavourite) {
      await apiDelete(`favourites.php?album=${id}`);
      setIsFavourite(false);
    } else {
      await apiPost("favourites.php", {
        album_id: Number(id),
      });
      setIsFavourite(true);
    }
  } catch (err) {
    setFavouriteError(
      err instanceof Error ? err.message : "Something went wrong."
    );
  } finally {
    setFavouriteLoading(false);
  }
}

  // Shows 2 cards at a time. With 2 or fewer reviews, shows all of them.
  const visibleReviews =
    reviews.length <= 2
      ? reviews
      : [reviews[reviewIndex], reviews[(reviewIndex + 1) % reviews.length]];

        /* ALBUM DETAILS */

  useEffect(() => {
    if (!id) return;

    apiGet<AlbumDetailsData>(`albums.php?id=${id}`)
      .then((data) => setAlbum(data))
      .catch((err: Error) => setError(err.message));
  }, [id, reloadKey]);

    /* ALBUM REVIEWS */

  useEffect(() => {
    if (!id) return;

    apiGet<AlbumReview[]>(`reviews.php?album=${id}`)
      .then((data) => {
        setReviews(data);
        setReviewIndex(0); // other album: start again from the first card
      })
      .catch((err: Error) => setReviewsError(err.message));
  }, [id, reloadKey]);

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

  /* WRITE A REVIEW */

  async function openReviewModal() {
    try {
      // Asks PHP who is logged in right now
      const user = await apiGet<{ id: number; username: string } | null>("me.php");
      if (!user) {
        navigate("/login"); // opens the login modal on top of this page
        return;
      }
      // One review per album: if this user already has one, the modal edits it
      setModalReview(reviews.find((review) => review.user_id === user.id) ?? null);
      setShowReviewModal(true);
    } catch (err) {
      setReviewsError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function handleReviewSaved() {
    setShowReviewModal(false);
    setReloadKey((key) => key + 1);
  }

  if (error) return <p>{error}</p>;
  if (!album) return <p>Loading album...</p>;
  
  // Average rating comes from the API (AVG of the reviews table).
  // null = no reviews yet. Rounded to show whole stars; the exact number shows next to them.
  const roundedRating =
    album.avg_rating !== null ? Math.round(album.avg_rating) : 0;

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

              <button
  type="button"
  className={`favourite-button ${isFavourite ? "active" : ""}`}
  onClick={handleFavourite}
  disabled={favouriteLoading}
>
  <span className="favourite-star">★</span>
  <span>
    {favouriteLoading
      ? "Saving..."
      : isFavourite
        ? "Added to favourites"
        : "Add to favourite"}
  </span>
</button>

{favouriteError && (
  <p className="favourite-error">{favouriteError}</p>
)}

              {album.avg_rating !== null ? (
                <div className="album-stars">
                  {"★".repeat(roundedRating)}
                  {"☆".repeat(5 - roundedRating)}
                  <span className="album-rating-number">
                    {album.avg_rating} ({album.review_count})
                  </span>
                </div>
              ) : (
                <p className="album-no-reviews">No reviews yet</p>
              )}
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

              <button className="write-review-button" type="button" onClick={openReviewModal}>
              {hasMyReview ? "Edit your review" : "Write a review"}
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

        {reviewsError && <p>{reviewsError}</p>}

        {!reviewsError && reviews.length === 0 && (
          <p className="album-no-reviews">No reviews yet. Be the first to review this album!</p>
        )}

        {/* LEFT ARROW: only when there are more than 2 reviews */}

        {reviews.length > 2 && (
          <button
            className="reviews-arrow reviews-arrow-left"
            type="button"
            onClick={() =>
              setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
            }
            aria-label="Previous reviews"
          >
            &#10094;
          </button>
        )}

        {/* REVIEW CARDS */}

        {reviews.length > 0 && (
          <div className="reviews-grid">
            {visibleReviews.map((review) => (
              <article className="review-card" key={review.id}>

                <div className="review-user-info">

                  {/* No profile photo yet: shows the first letter of the username */}
                  <div className="review-user-photo review-user-initial">
                    {review.username.charAt(0).toUpperCase()}
                  </div>

                  <div className="review-user-details">
                    <h3>Review by {review.username}</h3>

                    <div className="review-stars">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>

                    <p className="review-date">
                      Reviewed on {formatDate(review.created_at)}
                    </p>
                  </div>

                </div>

                <div className="review-comment">
                  <p><strong>{review.title}</strong></p>
                  <p>{review.body}</p>

                  {review.listened_at && (
                    <p><strong>Listened on:</strong> {formatDate(review.listened_at)}</p>
                  )}
                </div>

              </article>
            ))}
          </div>
        )}

        {/* RIGHT ARROW */}

        {reviews.length > 2 && (
          <button
            className="reviews-arrow reviews-arrow-right"
            type="button"
            onClick={() =>
              setReviewIndex((prev) => (prev + 1) % reviews.length)
            }
            aria-label="Next reviews"
          >
            &#10095;
          </button>
        )}

      </section>

      {/* YOU MIGHT ALSO LIKE */}

      <RandomAlbums
        albums={randomAlbums}
        title="You might also like"
      />

            {/* Rendered only while open, so the form always starts fresh */}
      {showReviewModal && (
        <ReviewModal
          album={album}
          existingReview={modalReview}
          onClose={() => setShowReviewModal(false)}
          onSaved={handleReviewSaved}
        />
      )}

    </div>
  );
}

export default AlbumDetail;

