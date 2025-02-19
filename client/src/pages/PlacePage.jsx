import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import BookingWidget from "../components/BookingWidget";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";
import Favorite from "../components/Favorite";

export default function PlacePage() {
    const {id} = useParams();
    const [placeData, setPlaceData] = useState({});
    const [userData, setUserData] = useState({});
        useEffect(() => {
            if(!id) {
                return;
            }
            axios.get(`/places/${id}`)
            .then(res => {
                setPlaceData(res.data);
                return axios.get(`/user/${res.data.owner}`);
            })
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => console.error(err));

        }, [id]);

        
    return (
    <div className="px-12 py-4">
            <div className="text-2xl font-semibold flex gap-4 items-center">
                {placeData.title}
                <Favorite placeId={placeData.id} isPlacePage={true} />
            </div>
            <AddressLink>{placeData.address}</AddressLink>
            <PlaceGallery placeData={placeData}/>

        <div className="grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[2fr_1.25fr] gap-6 mt-4">
            <div className="grid grid-cols-1">
                <div className="my-4">
                    <h1 className="font-bold text-2xl">About this space</h1>
                    <p className="mt-2 text-wrap text-justify">{placeData.description}</p>
                </div>
                <hr />
                <div className="flex items-center">
                    <FaUserCircle size={'40px'}/>
                    <div className="my-4">
                        <p className="font-bold px-4">Hosted by {userData.name}</p>
                        <p className="px-4">{userData.email}</p>
                    </div>
                </div>
                 <hr />
                <div>
                    <div className="flex flex-col justify-center h-full p-4">
                        <p><span className="font-semibold uppercase">Check-in:</span> {placeData.checkin}</p>
                        <p><span className="font-semibold uppercase">Check-out:</span> {placeData.checkout}</p>
                        <p><span className="font-semibold uppercase">Maximum number of guests:</span> {placeData.maxguests}</p>
                    </div>
                </div>
            </div>
            <div>
                <BookingWidget placeData={placeData} />
            </div>
        </div>
        <h2 className="font-bold text-2xl mt-6">Other things to know</h2>
        <pre className="mt-2 text-wrap text-justify font-sans">{placeData.extrainfo}</pre>
    </div>
    )
}
