import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiGet, IMAGES_URL } from "../api";
import "./AlbumDetail.css";

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

  useEffect(() => {
    if (!id) return;

    apiGet<AlbumDetailsData>(`albums.php?id=${id}`)
      .then((data) => setAlbum(data))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!album) return <p>Loading album...</p>;

 return (
  <div className="album-detail-page">
    <section
      className="album-banner"
      style={{
        backgroundImage: `url("${IMAGES_URL}/${album.cover_image}")`,
      }}
    >
      <div className="album-banner-overlay">
        <img
          className="album-banner-cover"
          src={`${IMAGES_URL}/${album.cover_image}`}
          alt={`${album.title} album cover`}
        />
      </div>
    </section>
  </div>
);
}

export default AlbumDetail;