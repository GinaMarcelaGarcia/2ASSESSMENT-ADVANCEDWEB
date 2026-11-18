import { useState, type FormEvent } from 'react';
import Modal from 'react-bootstrap/Modal';
import type { AlbumReview } from '../types';
import { apiDelete, apiPost, apiPut, IMAGES_URL } from '../api';

type ReviewModalProps = {
    album: { id: number; title: string; artist: string; cover_image: string };
    existingReview: AlbumReview | null; // null = new review, otherwise edit this one
    onClose: () => void;
    onSaved: () => void; // tells the page to load the reviews again
};

type ReviewErrors = {
    rating?: string;
    title?: string;
    body?: string;
};

function ReviewModal({ album, existingReview, onClose, onSaved }: ReviewModalProps) {
    // When editing, the form starts with the old values
    const [rating, setRating] = useState(existingReview?.rating ?? 0);
    const [hoverRating, setHoverRating] = useState(0); // star under the mouse
    const [title, setTitle] = useState(existingReview?.title ?? '');
    const [body, setBody] = useState(existingReview?.body ?? '');
    const [listenedAt, setListenedAt] = useState(existingReview?.listened_at ?? '');
    const [errors, setErrors] = useState<ReviewErrors>({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Today in the user's own time zone, as YYYY-MM-DD (the date input needs this format)
    const today = new Date().toLocaleDateString('en-CA');

    // Same rules as validateReview() in reviews.php
    function validate(): ReviewErrors {
        const newErrors: ReviewErrors = {};
        if (rating < 1) {
            newErrors.rating = 'Please choose a rating.';
        }
        if (title.trim() === '') {
            newErrors.title = 'Please write a title.';
        }
        if (body.trim() === '') {
            newErrors.body = 'Please write your review.';
        }
        return newErrors;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setServerError('');

        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const data = {
            rating,
            title: title.trim(),
            body: body.trim(),
            listened_at: listenedAt,
        };

        setLoading(true);
        try {
            if (existingReview) {
                await apiPut(`reviews.php?id=${existingReview.id}`, data);
            } else {
                await apiPost('reviews.php', { ...data, album_id: album.id });
            }
            onSaved();
        } catch (error) {
            // e.g. "You already reviewed this album..." from PHP
            setServerError(error instanceof Error ? error.message : 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

        async function handleDelete() {
        if (!existingReview) return; // only an existing review can be deleted

        setServerError('');
        setLoading(true);
        try {
            // PHP only deletes it if this review belongs to the logged-in user
            await apiDelete(`reviews.php?id=${existingReview.id}`);
            onSaved(); // same as after saving: close the modal and load the reviews again
        } catch (error) {
            setServerError(error instanceof Error ? error.message : 'Something went wrong.');
            setConfirmDelete(false);
        } finally {
            setLoading(false);
        }
    }

    // While the mouse is over the stars, show that value. Otherwise the chosen one.
    const shownRating = hoverRating || rating;

    return (
        <Modal show onHide={onClose} centered restoreFocus={false}>
            <Modal.Header closeButton>
                <Modal.Title as="span" className="fs-6 fw-bold">
                    {existingReview ? 'Edit your review' : 'Create Review'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">

                {/* The album being reviewed (decided in A2: show the album, not only the artist) */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <img
                        src={`${IMAGES_URL}/${album.cover_image}`}
                        alt={`${album.title} album cover`}
                        width={70}
                        height={70}
                        className="rounded"
                        style={{ objectFit: 'cover' }}
                    />
                    <div>
                        <p className="fw-bold mb-0">{album.title}</p>
                        <p className="small text-muted mb-0">{album.artist}</p>
                    </div>
                </div>

                {serverError && (
                    <div className="alert alert-danger py-2 small text-center" role="alert">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>

                    {/* STARS: each one is a button, so it also works with the keyboard */}
                    <div className="mb-3" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="btn btn-link p-0 me-1 fs-2 text-decoration-none"
                                style={{ color: '#E9A63E' }}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                            >
                                {star <= shownRating ? '★' : '☆'}
                            </button>
                        ))}
                        {errors.rating && <div className="text-danger small">{errors.rating}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="listened-at" className="form-label small">Listened at (optional)</label>
                        <input
                            type="date"
                            id="listened-at"
                            className="form-control rounded-pill"
                            max={today}
                            value={listenedAt}
                            onChange={(e) => setListenedAt(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className={`form-control rounded-pill ${errors.title ? 'is-invalid' : ''}`}
                            placeholder="Review title"
                            maxLength={100}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    <div className="mb-4">
                        <textarea
                            className={`form-control ${errors.body ? 'is-invalid' : ''}`}
                            placeholder="What did you think of this album?"
                            rows={5}
                            maxLength={2000}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        {errors.body && <div className="invalid-feedback">{errors.body}</div>}
                    </div>

                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        {confirmDelete ? (
                            // Second step: the user must confirm the delete
                            <>
                                <span className="w-100 text-center small">Delete this review? This can't be undone.</span>
                                <button
                                    type="button"
                                    className="btn btn-danger rounded-pill px-4"
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Yes, delete'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                    onClick={() => setConfirmDelete(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="submit"
                                    className="btn text-white rounded-pill px-5"
                                    style={{ backgroundColor: 'var(--tb-primary)' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save review'}
                                </button>

                                {/* Delete only shows when editing a review that already exists */}
                                {existingReview && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger rounded-pill px-4"
                                        onClick={() => setConfirmDelete(true)}
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default ReviewModal;