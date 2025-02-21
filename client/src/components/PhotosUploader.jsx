import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { MdDeleteSweep } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

export default function PhotosUploader({
  photoLink,
  setPhotoLink,
  addedPhotos,
  setAddedPhotos,
}) {
  async function addPhotoByLink(e) {
    e.preventDefault();
    const { data: fileName } = await axios.post("/uploadFromLink", {
      link: photoLink,
    }, {withCredentials: true});
    setAddedPhotos((prev) => {
      return [...prev, fileName];
    });
    setPhotoLink("");
  }

  function uploadPhoto(e) {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((res) => {
        const { data: fileName } = res;
        setAddedPhotos((prev) => {
          return [...prev, ...fileName];
        });
      });
  }

  function removePhoto(e, link) {
    e.preventDefault();
    setAddedPhotos((prev) => {
      return [...prev.filter((photoLink) => photoLink !== link)];
    });
  }

  function selectAsMainPhoto(e, link) {
    e.preventDefault();
    setAddedPhotos((prev) => {
      return [link, ...prev.filter((photoLink) => photoLink !== link)];
    });
  }
  return (
    <div>
      <div className="flex items-center gap-2 mt-2 p-1">
        <input
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          type="text"
          className="placeholder:px-3"
          placeholder={"Add using a link....jpg"}
        />
        <button
          onClick={(e) => addPhotoByLink(e)}
          className="bg-primary rounded-3xl text-white font-semibold px-4 py-2 mb-4"
        >
          Add&nbsp;Photo
        </button>
      </div>
      <div className="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-4">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link, index) => (
            <div key={index} className="h-32 flex cursor-pointer relative">
              <img
                className="rounded-2xl object-cover h-full w-full"
                src={
                  `${
                    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
                  }` +
                  "/uploads/" +
                  link
                }
                alt={link}
              />
             
              <div className="absolute bottom-0 right-0 max-w-max p-1">
                {addedPhotos[0] === link && (
                  <button className="bg-transparent m-1 w-max p-1 backdrop-blur-lg rounded-md transition-all ease-in-out duration-150 hover:scale-90">
                    <FaStar size={"25px"} color="#f1f1f1" />
                  </button>
                )}
                {addedPhotos[0] !== link && (
                  <button
                    onClick={(e) => selectAsMainPhoto(e, link)}
                    className="bg-transparent m-1 w-max p-1 backdrop-blur-lg rounded-md transition-all ease-in-out duration-150 hover:scale-90"
                  >
                    <FaRegStar size={"25px"} color="f1f1f1" />
                  </button>
                )}
                <button
                  onClick={(e) => removePhoto(e, link)}
                  className="bg-transparent w-max p-1 backdrop-blur-lg rounded-md transition-all ease-in-out duration-150 hover:scale-90"
                >
                  <MdDeleteSweep size={"25px"} color="#f1f1f1" />
                </button>
              </div>
            </div>
          ))}
        <label className="flex items-center cursor-pointer gap-2 justify-center border-2 bg-transparent p-8 rounded-2xl h-32">
          <input
            multiple
            type="file"
            className={"hidden"}
            accept="image/*"
            onChange={uploadPhoto}
          />
          <FiUpload size={"26px"} />
          <p>Upload</p>
        </label>
      </div>
    </div>
  );
}
