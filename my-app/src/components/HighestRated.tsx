// HighestRated.tsx
// "Highest rated" section of the Home page (Vinny).
// Shows the 8 albums with the best average rating (albums.php?top=1).
// Albums without reviews do not appear, so the list is empty until people review.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { apiGet, IMAGES_URL } from '../api';
import type { Album } from '../types';
import FavouriteButton from './FavouriteButton';

function HighestRated() {
    const navigate = useNavigate();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load once when the Home page opens
    useEffect(() => {
        apiGet<Album[]>('albums.php?top=1')
            .then((data) => setAlbums(data))
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        // Same classes as the album gallery, so the cards look the same
        <section className="album-gallery">
            <h2>Highest rated</h2>

            {loading ? (
                <p className="text-muted">Loading albums...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : albums.length === 0 ? (
                <p className="text-muted">
                    No ratings yet. Albums will show here once people start reviewing them.
                </p>
            ) : (
                <div className="gallery-grid">
                    {albums.map((album) => (
                        <div
                            className="gallery-card"
                            key={album.id}
                            onClick={() => navigate(`/album/${album.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="gallery-cover">
                                <img src={`${IMAGES_URL}/${album.cover_image}`} alt={album.title} />
                                <h3>{album.title}</h3>
                            </div>

                            <div className="gallery-info-row">
                                <div className="gallery-info">
                                    <p>{album.artist}</p>
                                    <span>{album.year}</span>
                                    {/* Always has a rating here: the API only sends albums with reviews */}
                                    <div className="gallery-rating">
                                        ★ {album.avg_rating} ({album.review_count})
                                    </div>
                                </div>

                                <FavouriteButton albumId={album.id} variant="icon" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default HighestRated;
