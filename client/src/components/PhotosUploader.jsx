"use client"

import { useState } from "react"
import axios from "axios"
import { FiUpload } from "react-icons/fi"
import { MdDeleteSweep } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { FaRegStar } from "react-icons/fa"

export default function PhotosUploader({ photoLink, setPhotoLink, addedPhotos, setAddedPhotos }) {
  const [isUploading, setIsUploading] = useState(false)

  async function addPhotoByLink(e) {
    e.preventDefault()
    setIsUploading(true)
    try {
      const { data: fileName } = await axios.post("/uploadFromLink", {
        link: photoLink,
      })
      setAddedPhotos((prev) => [...prev, fileName])
      setPhotoLink("")
    } catch (error) {
      console.error("Error uploading photo by link:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false)
    }
  }

  async function uploadPhoto(e) {
    const files = e.target.files
    const data = new FormData()
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i])
    }

    setIsUploading(true)
    try {
      const { data: fileNames } = await axios.post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      setAddedPhotos((prev) => [...prev, ...fileNames])
    } catch (error) {
      console.error("Error uploading photos:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false)
    }
  }

  function removePhoto(e, link) {
    e.preventDefault()
    setAddedPhotos((prev) => prev.filter((photoLink) => photoLink !== link))
  }

  function selectAsMainPhoto(e, link) {
    e.preventDefault()
    setAddedPhotos((prev) => [link, ...prev.filter((photoLink) => photoLink !== link)])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          type="text"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add photo using a link (http://...)"
        />
        <button
          onClick={addPhotoByLink}
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? "Adding..." : "Add Photo"}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {addedPhotos.map((link, index) => (
          <div key={index} className="relative group">
            <img
              className="w-full h-48 object-cover rounded-lg shadow-md"
              src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/uploads/${link}`}
              alt={`Uploaded photo ${index + 1}`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
              <button
                onClick={(e) => selectAsMainPhoto(e, link)}
                className="text-white p-1 rounded-full hover:bg-indigo-600 transition duration-300"
                title={index === 0 ? "Main photo" : "Set as main photo"}
              >
                {index === 0 ? <FaStar size={24} /> : <FaRegStar size={24} />}
              </button>
              <button
                onClick={(e) => removePhoto(e, link)}
                className="text-white p-1 rounded-full hover:bg-indigo-600 transition duration-300 ml-2"
                title="Remove photo"
              >
                <MdDeleteSweep size={24} />
              </button>
            </div>
          </div>
        ))}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:border-indigo-500 transition duration-300">
          <input multiple type="file" className="hidden" accept="image/*" onChange={uploadPhoto} />
          <FiUpload size={32} className="text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Upload photos</p>
        </label>
      </div>
    </div>
  )
}

