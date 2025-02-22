import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function BookingWidget({ placeData }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const { user } = useContext(UserContext);
  let numberOfDays = 0;
  let priceForTheDays = 0;

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    priceForTheDays = numberOfDays * placeData.price;
  }

  async function bookThisPlace(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/bookings", {
        place: placeData.id,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        contactNumber,
        price: priceForTheDays,
      });
      if (response.status === 201) {
        setRedirect(true);
        alert(`Congratulations ${name}! Your booking has been successfully created. Get ready for an amazing experience!`);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/bookings"} />;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl font-semibold text-gray-900">
          ₹{placeData.price}
          <span className="text-lg text-gray-500">/night</span>
        </p>
        {numberOfDays > 0 && (
          <p className="text-indigo-600 font-medium">
            Total: ₹{priceForTheDays}
          </p>
        )}
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <div className="p-3">
            <label className="block text-sm font-medium text-gray-700">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="p-3">
            <label className="block text-sm font-medium text-gray-700">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="border-t border-gray-200 p-3">
          <label className="block text-sm font-medium text-gray-700">Guests</label>
          <input
            type="number"
            min="1"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Number of guests"
          />
        </div>
      </div>

      {numberOfDays > 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact number</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="+91 xxxxxxxxxx"
            />
          </div>
        </div>
      )}

      <button
        onClick={bookThisPlace}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
      >
        {numberOfDays > 0
          ? `Book for ${numberOfDays} nights`
          : "Check availability"}
      </button>
    </div>
  );
}