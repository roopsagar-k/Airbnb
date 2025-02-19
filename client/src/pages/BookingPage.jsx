import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import AddressLink from "../components/AddressLink";
import PlaceGallery from "../components/PlaceGallery";
import BookingDates from "../components/BookingDates";

export default function BookingPage() {
    const {placeId} = useParams();
    const [booking, setBooking] = useState(null);
    useEffect(() => {
        if(placeId) {
            axios.get("/getBookings").then(res => {
                const foundBooking = res.data.find(({id}) => JSON.stringify(id) === placeId);
                console.log(foundBooking);
                if(foundBooking) {
                    setBooking(foundBooking);
                }
            })
        }
    }, [placeId]);

    if(!booking) {
        return "";
    }

  return (
    <div className="mt-4">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">{booking.title}</h1>
        <AddressLink>{booking.address}</AddressLink>
        <div className="grid md:grid-cols-1 xl:grid-cols-[3fr_1fr] gap-2 py-8 px-6 bg-gray-200 p-4 my-4 rounded-2xl text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
            <div className="shrink-0">
                <h2 className="text-xl font-semibold mb-2">Your Booking Information:</h2>
                <BookingDates place={booking}/>
            </div>
            <div className="flex flex-col items-start text-2xl">
                <p className="text-base ">Total price: </p>
                <p className="text-3xl">&#8377;{booking.price}/-</p>
            </div>
        </div>
        <PlaceGallery placeData={booking} />
    </div>
  )
}
