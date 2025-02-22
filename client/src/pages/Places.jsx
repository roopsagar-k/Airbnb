import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { PlusCircle, Hotel, MapPin } from "lucide-react";



export default function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    axios.get("/getUserPlaces")
      .then(({ data }) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching places:", err);
        setLoading(false);
      });
  }, []);

  if (pathname !== "/account/places") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-indigo-600">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Link
          to="/account/places/new"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-200 gap-2 shadow-md hover:shadow-lg"
        >
          <PlusCircle size={20} />
          <span className="font-medium">Add New Property</span>
        </Link>
      </div>

      {places.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <Hotel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No properties listed</h3>
          <p className="text-gray-500 mt-2">Start by adding your first property</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {places.map((place) => (
            <Link
              to={`/account/places/${place.id}`}
              key={place.id}
              className="block transform hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 md:h-auto relative">
                    {place.photos[0] && (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/uploads/${place.photos[0]}`}
                        alt={place.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {place.title}
                    </h3>
                    {place.location && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{place.location}</span>
                      </div>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {isPhoneView
                        ? place.description.substring(0, 80) + "..."
                        : place.description.substring(0, 200) + "..."}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}