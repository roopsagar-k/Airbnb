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
      <div className="fixed bg-black inset-0 bg-opacity-95 min-h-screen overflow-auto">
        <button
          onClick={() => setShowAllPhotos(false)}
          className="flex bg-transparent text-white cursor-pointer font-medium items-center gap-2 rounded-md px-2 py-1 fixed right-0 m-5 transition-transform ease-in-out hover:scale-110"
        >
          <GrClose size={"23px"} />
          {!isPhoneView && (
            <p className="text-sm md:text-base lg:text-xl">Close photos</p>
          )}
        </button>
        <div className="grid gap-1 w-full place-items-center mt-6">
          {placeData?.photos?.length > 0 &&
            placeData.photos.map((photo, index) => (
              <div
                key={index}
                className="flex max-w-[65%] xl:max-w-[700px] justify-center m-2"
              >
                <img
                  className="object-cover grow"
                  src={
                    `${
                      import.meta.env.VITE_API_BASE_URL ||
                      "http://localhost:3000"
                    }/uploads/` + photo
                  }
                  alt={photo}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr] gap-2">
        <div className="flex max-h-72 md:max-h-[55vh] lg:max-h-[60vh]">
          {placeData.photos?.[0] && (
            <img
              className="object-cover grow rounded-2xl md:rounded-tr-none md:rounded-br-none cursor-pointer"
              src={
                `${
                  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
                }` + `/uploads/${placeData.photos[0]}`
              }
              alt=""
            />
          )}
        </div>
        {!isPhoneView && (
          <>
            <div className="grid grid-rows-2 gap-2 max-h-72 md:max-h-[55vh] lg:max-h-[60vh]">
              <div className="flex">
                {placeData.photos?.[1] && (
                  <img
                    className="object-cover grow cursor-pointer"
                    src={
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000"
                      }` + `/uploads/${placeData.photos[1]}`
                    }
                    alt=""
                  />
                )}
              </div>
              <div className="flex">
                {placeData.photos?.[2] && (
                  <img
                    className="object-cover grow cursor-pointer"
                    src={
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000"
                      }` + `/uploads/${placeData.photos[2]}`
                    }
                    alt=""
                  />
                )}
              </div>
            </div>
            <div className="grid grid-rows-2 gap-2 max-h-72 md:max-h-[55vh] lg:max-h-[60vh]">
              {isLarger && (
                <>
                  <div className="flex">
                    {placeData.photos?.[3] && (
                      <img
                        className="object-cover grow rounded-tr-2xl cursor-pointer"
                        src={
                          `${
                            import.meta.env.VITE_API_BASE_URL ||
                            "http://localhost:3000"
                          }` + `/uploads/${placeData.photos[3]}`
                        }
                        alt=""
                      />
                    )}
                  </div>
                  <div className="flex">
                    {placeData.photos?.[4] && (
                      <img
                        className="object-cover grow rounded-br-2xl cursor-pointer"
                        src={
                          `${
                            import.meta.env.VITE_API_BASE_URL ||
                            "http://localhost:3000"
                          }` + `/uploads/${placeData.photos[4]}`
                        }
                        alt=""
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <button
        onClick={() => setShowAllPhotos(true)}
        className="flex items-center px-2 bg-white font-medium border-2 border-black py-1 rounded-md gap-2 absolute bottom-0 right-0 m-4 hover:bg-gray-100 text-xs md:text-base"
      >
        <LuGalleryVertical />
        Show all photos
      </button>
    </div>
  );
}
