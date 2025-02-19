import axios from "axios";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [places, setPlaces] = useState([]);
  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    axios
      .get("/getFavoritesPlaces")
      .then((res) => setPlaces([...res.data]))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1 className="font-medium text-2xl">Favorites</h1>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place, index) => (
            <Link
              to={"/place/" + place.place_id}
              key={index}
              className="flex bg-gray-200 p-4 rounded-2xl mx-3 gap-4 cursor-pointer mt-2"
            >
              <div className="flex w-32 h-32 shrink-0">
                {place.photos.length > 0 && (
                  <img
                    src={
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000"
                      }/uploads/` + place.photos[0]
                    }
                    alt={place.title}
                    className="object-cover rounded-xl grow"
                  />
                )}
              </div>
              <div>
                <h2 className="md:text-2xl font-semibold">{place.title}</h2>
                <p className="text-sm mt-2">
                  {isPhoneView
                    ? place.description.substring(0, 80) + "..."
                    : place.description.substring(0, 600) + "..."}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
export default Favorites;
