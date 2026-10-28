
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
