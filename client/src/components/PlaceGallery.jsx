import { useMediaQuery } from "react-responsive";
import { LuGalleryVertical } from "react-icons/lu";
import { GrClose } from "react-icons/gr";
import { useState } from "react";

export default function PlaceGallery({ placeData }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const isLarger = useMediaQuery({ query: "(min-width: 1024px)" });
  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 min-h-screen overflow-auto z-50">
        <button
          onClick={() => setShowAllPhotos(false)}
          className="fixed right-6 top-6 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white hover:bg-white/20 transition-colors"
        >
          <GrClose className="w-5 h-5" />
          {!isPhoneView && <span className="text-sm">Close gallery</span>}
        </button>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid gap-4">
            {placeData?.photos?.map((photo, index) => (
              <div key={index} className="aspect-[16/9] overflow-hidden rounded-2xl">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/uploads/${photo}`}
                  alt={`Room photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-2 grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr]">
        <div className="aspect-[16/9] md:aspect-[4/3] overflow-hidden">
          {placeData.photos?.[0] && (
            <img
              className="w-full h-full object-cover rounded-l-2xl cursor-pointer hover:opacity-90 transition-opacity"
              src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/uploads/${placeData.photos[0]}`}
              alt="Main"
              onClick={() => setShowAllPhotos(true)}
            />
          )}
        </div>
        
        {!isPhoneView && (
          <>
            <div className="grid gap-2">
              {[1, 2].map((index) => (
                <div key={index} className="aspect-[4/3] overflow-hidden">
                  {placeData.photos?.[index] && (
                    <img
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/uploads/${placeData.photos[index]}`}
                      alt={`Room ${index + 1}`}
                      onClick={() => setShowAllPhotos(true)}
                    />
                  )}
                </div>
              ))}
            </div>

            {isLarger && (
              <div className="grid gap-2">
                {[3, 4].map((index) => (
                  <div key={index} className="aspect-[4/3] overflow-hidden">
                    {placeData.photos?.[index] && (
                      <img
                        className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${
                          index === 3 ? "rounded-tr-2xl" : "rounded-br-2xl"
                        }`}
                        src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/uploads/${placeData.photos[index]}`}
                        alt={`Room ${index + 1}`}
                        onClick={() => setShowAllPhotos(true)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => setShowAllPhotos(true)}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md hover:bg-gray-50 transition-colors"
      >
        <LuGalleryVertical className="w-5 h-5" />
        <span className="text-sm font-medium">Show all photos</span>
      </button>
    </div>
  );
}