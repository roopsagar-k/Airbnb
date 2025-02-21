import { useEffect, useState } from "react";
import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const Favorite = ({ placeId, isPlacePage }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext);

  // Fetch favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get("/getFavorites", { withCredentials: true });
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  const handleFavorites = async (event, placeId, action) => {
    if (!user) {
      alert(
        "Please sign in to add this to your favorites and access them anytime!"
      );
      return;
    }

    event.preventDefault();

    try {
      if (action === "add") {
        await axios.post(
          "/addToFavorites",
          { place_id: placeId },
          { withCredentials: true }
        );
        setFavorites((prev) => [...prev, placeId]); // Optimistically update
      } else if (action === "delete") {
        await axios.post(
          "/deleteFromFavorites",
          { place_id: placeId },
          { withCredentials: true }
        );
        setFavorites((prev) => prev.filter((fav) => fav !== placeId)); // Optimistically update
      }
    } catch (err) {
      console.error(`Failed to ${action} favorite:`, err);
    }
  };

  const isFavorite = favorites.includes(placeId);

  return (
    <>
      {isFavorite ? (
        <svg
          onClick={(e) => handleFavorites(e, placeId, "delete")}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#ff385c"
          className="w-6 h-6"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      ) : (
        <svg
          onClick={(e) => handleFavorites(e, placeId, "add")}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke={isPlacePage ? "black" : "white"}
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      )}
    </>
  );
};

export default Favorite;
