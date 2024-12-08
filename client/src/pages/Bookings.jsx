import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookingDates from "../components/BookingDates";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/getBookings").then((res) => {
      console.log(res.data);
      setBookings(res.data);
    });
  }, []);
  return (
    <div>
      {bookings?.length > 0 &&
        bookings.map((place, index) => (
          <Link to={`/account/bookings/${place.id}`} key={index}>
            {place.photos.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 bg-gray-200 rounded-2xl overflow-hidden mt-4 shadow-md">
                <div className="h-48 sm:w-48 sm:h-auto flex shrink-0">
                  <img
                    className="object-cover"
                    src={
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000"
                      }` + `/uploads/${place.photos[0]}`
                    }
                    alt={place.photos[0]}
                  />
                </div>
                <div className="py-3 grow px-3">
                  <div className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
                    {place.title}
                  </div>
                  <div className="border-t border-gray-300 mt-2 py-2 ">
                    <BookingDates
                      place={place}
                      className={"font-semibold text-gray-500"}
                    />
                    <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-semibold">
                      {" "}
                      Total price: &#8377;{place.price}/-
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Link>
        ))}
    </div>
  );
}
