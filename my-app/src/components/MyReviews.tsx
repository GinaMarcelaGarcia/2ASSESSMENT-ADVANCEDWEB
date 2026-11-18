// MyReviews.tsx
// "My reviews" tab of the Account page (Vinny).
// Lists the reviews of the logged-in user, newest first.
// "Edit" opens the same ReviewModal used on the Album Detail page
// (the Delete button is inside the modal, so it works here too).

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiGet, IMAGES_URL } from '../api';
import type { MyReview } from '../types';
import ReviewModal from './ReviewModal';
import './MyReviews.css';

// "2026-11-17 18:39:50" (MySQL format) -> "17 Nov 2026"
// Same format as the review cards on the Album Detail page
function formatDate(mysqlDate: string) {
    return new Date(mysqlDate.replace(' ', 'T')).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function MyReviews() {
    const [reviews, setReviews] = useState<MyReview[]>([]);
    const [loading, setLoading] = useState(true); // only true on the first load
    const [error, setError] = useState('');

    // Review open in the modal. null = modal closed.
    const [editingReview, setEditingReview] = useState<MyReview | null>(null);

    // Goes up by 1 after a save or delete: the list loads again
    const [reloadKey, setReloadKey] = useState(0);

    // Load the reviews of the logged-in user.
    // The user comes from the PHP session, so the URL has no user id.
    useEffect(() => {
        apiGet<MyReview[]>('reviews.php?mine=1')
            .then((data) => {
                setReviews(data);
                setError('');
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [reloadKey]);

    // Called by the modal after Save or Delete
    function handleSaved() {
        setEditingReview(null);
        setReloadKey((key) => key + 1);
    }

    if (loading) {
        return <p className="text-muted">Loading your reviews...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    // No reviews yet: tell the user where to start
    if (reviews.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-muted">You haven't reviewed any album yet.</p>
                <Link
                    to="/"
                    className="btn text-white rounded-pill px-5"
                    style={{ backgroundColor: 'var(--tb-primary)' }}
                >
                    Find an album
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* 1 card per row on phone, 2 per row from medium screens */}
            <div className="row g-3">
                {reviews.map((review) => (
                    <div className="col-12 col-md-6" key={review.id}>
                        <div className="my-review-card h-100 d-flex gap-3">
                            <Link to={`/album/${review.album_id}`} className="flex-shrink-0">
                                <img
                                    src={`${IMAGES_URL}/${review.cover_image}`}
                                    alt={review.album_title}
                                    className="my-review-cover"
                                />
                            </Link>

                            <div className="flex-grow-1">
                                <Link to={`/album/${review.album_id}`} className="my-review-album">
                                    {review.album_title}
                                </Link>
                                <div className="small text-muted mb-1">{review.artist}</div>

                                <div className="my-review-stars" aria-label={`${review.rating} out of 5 stars`}>
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                </div>

                                <h3 className="h6 fw-bold mt-2 mb-1">{review.title}</h3>
                                <p className="small mb-2 my-review-body">{review.body}</p>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="small text-muted">{formatDate(review.created_at)}</span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                        onClick={() => setEditingReview(review)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Same modal as Album Detail. Rendered only while open, so the form starts fresh. */}
            {editingReview && (
                <ReviewModal
                    album={{
                        id: editingReview.album_id,
                        title: editingReview.album_title,
                        artist: editingReview.artist,
                        cover_image: editingReview.cover_image,
                    }}
                    existingReview={editingReview}
                    onClose={() => setEditingReview(null)}
                    onSaved={handleSaved}
                />
            )}
        </>
    );
}

export default MyReviews;