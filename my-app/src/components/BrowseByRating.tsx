// BrowseByRating.tsx
// "Browse by rating" section of the Home page (Vinny).
// Each emoji is a filter for REVIEWS by their star rating, as in our proposal:
//   🔥 Must Hear = 4-5 stars · 💗 Loved = 3 stars · 😐 Okay = 1-2 stars
// Click an emoji: shows the newest reviews in that range.
// Click the same emoji again: closes the list.

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiGet, IMAGES_URL } from '../api';
import type { RatingReview } from '../types';
import './BrowseByRating.css';

// The 3 levels. "id" is the value sent to reviews.php?level=
const LEVELS = [
    { id: 'must-hear', emoji: '🔥', label: 'Must Hear', stars: '4-5 stars' },
    { id: 'loved', emoji: '💗', label: 'Loved', stars: '3 stars' },
    { id: 'okay', emoji: '😐', label: 'Okay', stars: '1-2 stars' },
];

function BrowseByRating() {
    // Level chosen by the user. '' = nothing chosen, list closed.
    const [level, setLevel] = useState('');
    const [reviews, setReviews] = useState<RatingReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load the reviews again every time the chosen level changes
    useEffect(() => {
        if (!level) {
            return;
        }

        setLoading(true);
        setError('');

        apiGet<RatingReview[]>(`reviews.php?level=${level}`)
            .then((data) => setReviews(data))
            .catch((err: Error) => {
                setReviews([]);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [level]);

    // Same button again = close the list
    function chooseLevel(id: string) {
        setLevel((current) => (current === id ? '' : id));
    }

    const chosen = LEVELS.find((item) => item.id === level);

    return (
        <section className="browse-rating">
            <h2>Browse by rating</h2>

            <div className="rating-options">
                {LEVELS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`rating-option ${level === item.id ? 'active' : ''}`}
                        aria-pressed={level === item.id}
                        title={item.stars}
                        onClick={() => chooseLevel(item.id)}
                    >
                        <span className="rating-emoji">{item.emoji}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* List only shows after the user clicks an emoji */}
            {chosen && (
                <div className="rating-results">
                    <p className="rating-results-title">
                        {chosen.emoji} {chosen.label} reviews ({chosen.stars})
                    </p>

                    {loading ? (
                        <p className="text-muted">Loading reviews...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-muted">
                            No {chosen.label} reviews yet. Pick an album and be the first to review it!
                        </p>
                    ) : (
                        // 1 card per row on phone, 2 on tablet, 3 on desktop
                        <div className="row g-3 text-start">
                            {reviews.map((review) => (
                                <div className="col-12 col-md-6 col-lg-4" key={review.id}>
                                    <Link to={`/album/${review.album_id}`} className="rating-review-card">
                                        <img
                                            src={`${IMAGES_URL}/${review.cover_image}`}
                                            alt={review.album_title}
                                            className="rating-review-cover"
                                        />

                                        <div className="rating-review-info">
                                            <div className="rating-review-album">{review.album_title}</div>
                                            <div className="small text-muted">{review.artist}</div>

                                            <div
                                                className="rating-review-stars"
                                                aria-label={`${review.rating} out of 5 stars`}
                                            >
                                                {'★'.repeat(review.rating)}
                                                {'☆'.repeat(5 - review.rating)}
                                            </div>

                                            <div className="rating-review-title">{review.title}</div>
                                            {/* React escapes this text, so HTML typed by a user does not run */}
                                            <p className="rating-review-body">{review.body}</p>
                                            <div className="small text-muted">by {review.username}</div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default BrowseByRating;
