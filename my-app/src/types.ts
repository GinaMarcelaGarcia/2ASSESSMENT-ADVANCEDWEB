
export type Album = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: number;
  cover_image: string;
  avg_rating: number | null;
  review_count: number;
};

export type Genre = {
  id: number;
  name: string;
};

// One review on the Album Detail page (GET reviews.php?album=5)
export type AlbumReview = {
  id: number;
  rating: number;
  title: string;
  body: string;
  listened_at: string | null;
  created_at: string;
  user_id: number;
  username: string;
  avatar: string | null;
};

// One review on the My reviews tab (GET reviews.php?mine=1)
export type MyReview = {
  id: number;
  rating: number;
  title: string;
  body: string;
  listened_at: string | null;
  created_at: string;
  album_id: number;
  album_title: string;
  cover_image: string;
  artist: string;
};