import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PhotosUploader from "../components/PhotosUploader";
import Perks from "../components/Perks";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photoLink, setPhotoLink] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`).then(res => {
      const { data } = res;
      setTitle(data.title);
      setAddress(data.address);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extrainfo);
      setCheckIn(data.checkin);
      setCheckOut(data.checkout);
      setAddedPhotos(data.photos);
      setMaxGuests(data.maxguests);
      setPrice(data.prize);
    });
  }, [id]);

  async function savePlace(e) {
    e.preventDefault();
    const placeData = {
      title, address, addedPhotos, 
      description, perks, extraInfo, 
      checkIn, checkOut, maxGuests, price
    };
    
    if (!id) {
      await axios.post("/addNewPlace", placeData);
    } else {
      await axios.put(`/updatePlaceData/${id}`, placeData);
    }
    setRedirect("/account/places");
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={savePlace} className="space-y-8">
          <FormSection title="Place Details">
            <FormField label="Title" helper="Give your place a unique title that highlights its charm.">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="e.g., Cozy Studio in Downtown"
              />
            </FormField>
            <FormField label="Address" helper="Provide the exact address of your place.">
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="Full address"
              />
            </FormField>
          </FormSection>

          <FormSection title="Photos">
            <PhotosUploader
              photoLink={photoLink}
              setPhotoLink={setPhotoLink}
              addedPhotos={addedPhotos}
              setAddedPhotos={setAddedPhotos}
            />
          </FormSection>

          <FormSection title="Description and Perks">
            <FormField label="Description" helper="Describe the unique features and atmosphere of your place.">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Enter your description here..."
              />
            </FormField>
            <FormField label="Perks" helper="Select all the perks of your place">
              <Perks perks={perks} setPerks={setPerks} />
            </FormField>
            <FormField label="Extra Info" helper="Specify house rules and additional information.">
              <textarea
                value={extraInfo}
                onChange={e => setExtraInfo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Enter additional information here..."
              />
            </FormField>
          </FormSection>

          <FormSection title="Booking Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Check-in Time" helper="e.g., After 2 PM">
                <input
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  placeholder="Check-in time"
                />
              </FormField>
              <FormField label="Check-out Time" helper="e.g., Before 11 AM">
                <input
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  placeholder="Check-out time"
                />
              </FormField>
              <FormField label="Max Guests" helper="Maximum number of guests allowed">
                <input
                  value={maxGuests}
                  onChange={e => setMaxGuests(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="number"
                  placeholder="e.g., 4"
                />
              </FormField>
              <FormField label="Price per Night" helper="in your local currency">
                <input
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="number"
                  placeholder="e.g., 100"
                />
              </FormField>
            </div>
          </FormSection>

          <div className="flex justify-center">
            <button className="bg-indigo-600 w-full text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 transition duration-300">
              Save Place
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function FormField({ label, helper, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      <p className="mt-1 text-sm text-gray-500">{helper}</p>
    </div>
  );
}
