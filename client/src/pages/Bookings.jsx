import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BookingDates from "../components/BookingDates";
import { Calendar, MapPin } from "lucide-react";


export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/getBookings")
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch bookings:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-indigo-600">Loading bookings...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">No bookings yet</h3>
        <p className="text-gray-500 mt-2">When you book a stay, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <Link
          to={`/account/bookings/${booking.id}`}
          key={booking.id}
          className="block transform hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-48 sm:h-auto relative">
                {booking.photos[0] && (
                  <img
                    className="w-full h-full object-cover"
                    src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/uploads/${booking.photos[0]}`}
                    alt={booking.title}
                  />
                )}
              </div>
              
              <div className="p-6 flex-1">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {booking.title}
                    </h3>
                    {booking.location && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{booking.location}</span>
                      </div>
                    )}
                    <BookingDates place={booking} className="text-gray-600" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total price</span>
                      <span className="text-2xl font-semibold text-indigo-600">
                        ₹{booking.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}