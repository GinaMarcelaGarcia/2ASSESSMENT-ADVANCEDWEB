
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiGet, apiDelete, IMAGES_URL } from '../api';
import type { Album } from '../types';
import './MyFavourites.css';

function MyFavourites() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [removingId, setRemovingId] = useState<number | null>(null);

    // Load the favourite albums of the logged-in user.
    useEffect(() => {
        apiGet<Album[]>('favourites.php?mine=1')
            .then((data) => {
                setAlbums(data);
                setError('');
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Remove an album from favourites.
    async function handleRemove(albumId: number) {
        setRemovingId(albumId);
        setError('');

        try {
            await apiDelete(`favourites.php?album=${albumId}`);
            setAlbums((current) =>
                current.filter((album) => album.id !== albumId)
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setRemovingId(null);
        }
    }

    if (loading) {
        return <p className="text-muted">Loading your favourites...</p>;
    }

    if (error && albums.length === 0) {
        return <p className="text-danger">{error}</p>;
    }

    if (albums.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-muted">You haven't added any favourite albums yet.</p>
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
        <div className="row g-3">
            {error && <p className="text-danger">{error}</p>}

            {albums.map((album) => (
                <div className="col-12 col-md-6" key={album.id}>
                    <div className="my-review-card h-100 d-flex gap-3">
                        <Link to={`/album/${album.id}`} className="flex-shrink-0">
                            <img
                                src={`${IMAGES_URL}/${album.cover_image}`}
                                alt={album.title}
                                className="my-review-cover"
                            />
                        </Link>

                        <div className="flex-grow-1">
                            <Link to={`/album/${album.id}`} className="my-review-album">
                                {album.title}
                            </Link>

                            <div className="small text-muted mb-1">{album.artist}</div>
                            <div className="small text-muted">{album.year}</div>

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3 mt-2"
                                disabled={removingId === album.id}
                                onClick={() => handleRemove(album.id)}
                            >
                                {removingId === album.id ? 'Removing...' : 'Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyFavourites;
