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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {places.length > 0 &&
          places.map((place, index) => (
            <Link
              to={"/place/" + place.id}
              key={index}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {place.photos?.[0] && (
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    src={
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000"
                      }` +
                      "/uploads/" +
                      place.photos?.[0]
                    }
                    alt={place.title}
                  />
                  <div className="absolute top-3 right-3">
                    <Favorite placeId={place.id} />
                  </div>
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 line-clamp-1">
                  {place.address}
                </h2>
                <p className="mt-1 text-gray-600 text-sm line-clamp-1">
                  {place.title}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-medium text-gray-900">
                    <span className="text-lg">₹{place.price}</span>
                    <span className="text-sm text-gray-600"> night</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}