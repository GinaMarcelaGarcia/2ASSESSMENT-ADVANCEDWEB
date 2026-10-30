import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiGet } from "../api";

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
    <div>
      <h1>{album.title}</h1>
      <h2>{album.artist}</h2>
      <p>{album.description}</p>
    </div>
  );
}

export default AlbumDetail;