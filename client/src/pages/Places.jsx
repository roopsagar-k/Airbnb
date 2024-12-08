import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function Places() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios
      .get("/getUserPlaces")
      .then(({ data }) => setPlaces(data))
      .catch((err) => {
        console.error("Error: ", err);
      });
  }, []);
  const { pathname } = useLocation();
  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    pathname === "/account/places" && (
      <div className="flex-col justify-center">
        <div className="text-center gap-2 text-xs sm:text-base xl:text-lg">
          <Link
            to={"/account/places/new"}
            className="bg-primary text-white px-4 rounded-full py-2 inline-flex items-center justify-center gap-1"
          >
            <FaPlus />
            Add new place
          </Link>
        </div>
        <div className="mt-4">
          {places.length > 0 &&
            places.map((place, index) => (
              <Link
                to={"/account/places/" + place.id}
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
                        }` +
                        "/uploads/" +
                        place.photos[0]
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
    )
  );
}
