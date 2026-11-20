
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet, apiPost, apiDelete } from "../api";
import "./FavouriteButton.css";

type FavouriteButtonProps = {
  albumId: number;
  variant?: "default" | "icon";
};

function FavouriteButton({
  albumId,
  variant = "default",
}: FavouriteButtonProps) {
  const navigate = useNavigate();

  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check whether the logged-in user has saved this album.
  useEffect(() => {
    apiGet<{ id: number; username: string } | null>("me.php")
      .then((user) => {
        if (!user) return null;

        return apiGet<{ is_favourite: boolean }>(
          `favourites.php?album=${albumId}`
        );
      })
      .then((data) => {
        if (data) setIsFavourite(data.is_favourite);
      })
      .catch(() => {
        setIsFavourite(false);
      });
  }, [albumId]);

  // Add or remove the album from favourites.
  async function handleFavourite(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const user = await apiGet<{
        id: number;
        username: string;
      } | null>("me.php");

      if (!user) {
        navigate("/register");
        return;
      }

      const status = await apiGet<{ is_favourite: boolean }>(
        `favourites.php?album=${albumId}`
      );

      if (status.is_favourite) {
        await apiDelete(`favourites.php?album=${albumId}`);
        setIsFavourite(false);
      } else {
        await apiPost("favourites.php", {
          album_id: albumId,
        });
        setIsFavourite(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const iconOnly = variant === "icon";

  return (
    <div className={`favourite-button-container ${iconOnly ? "icon-only" : ""}`}>
      <button
        type="button"
        className={`favourite-button ${isFavourite ? "active" : ""} ${
          iconOnly ? "favourite-button-icon" : ""
        }`}
        onClick={handleFavourite}
        aria-disabled={loading}
        aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        title={isFavourite ? "Remove from favourites" : "Add to favourites"}
      >
        <span className="favourite-star">★</span>

        {!iconOnly && (
          <span>
            {loading
              ? "Saving..."
              : isFavourite
                ? "Added to favourites"
                : "Add to favourite"}
          </span>
        )}
      </button>

      {error && <p className="favourite-error">{error}</p>}
    </div>
  );
}

export default FavouriteButton;
