import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useSearch } from "../SearchContext";
import Favorite from "../components/Favorite";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const { searchQuery } = useSearch();
  useEffect(() => {
    axios
      .get("/places")
      .then((res) => {
        setPlaces([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setPlaces([...searchQuery]);
  }, [searchQuery]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 p-8">
      {places.length > 0 &&
        places.map((place, index) => (
          <Link to={"/place/" + place.id} key={index} className="max-h-max">
            {place.photos?.[0] && (
              <div className="flex h-64 shrink-0 relative">
                <img
                  className="object-cover grow rounded-2xl"
                  src={
                    `${
                      import.meta.env.VITE_API_BASE_URL ||
                      "http://localhost:3000"
                    }` +
                    "/uploads/" +
                    place.photos?.[0]
                  }
                  alt=""
                />
                <div className="absolute right-0 p-5 h-max w-max">
                  <Favorite placeId={place.id} />
                </div>
              </div>
            )}
            <div>
              <h1 className="mt-2 font-semibold">{place.address}</h1>
              <h3 className="text-gray-700 truncate">{place.title}</h3>
              <h3>
                <b>&#8377;{place.price}</b> night
              </h3>
            </div>
          </Link>
        ))}
    </div>
  );
}
