"use client"

import { useContext, useState } from "react"
import { CgProfile } from "react-icons/cg"
import { FaList, FaHotel } from "react-icons/fa6"
import { Link, useParams, useNavigate } from "react-router-dom"
import { UserContext } from "../UserContext"
import Places from "./Places"
import Favorites from "../components/Favorites"
import axios from "axios"
import Bookings from "./Bookings"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function AccountPage() {
  let { subPage } = useParams()
  const navigate = useNavigate()
  const { ready, user, setUser } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)

  if (!ready) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (subPage === undefined) {
    subPage = "profile"
  }

  const Profile = () => {
    async function handleLogout() {
      setIsLoading(true)
      try {
        await axios.post("/logout")
        setUser(null)
        toast.success("Logged out successfully")
        navigate("/")
      } catch (error) {
        toast.error("Failed to logout. Please try again.")
        console.error("Logout error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <>
        <div className="flex flex-col items-center justify-center p-6 gap-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-xl hover:bg-primary-dark transition duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
        <Favorites />
      </>
    )
  }

  function linkClasses(type = null) {
    let classes = "flex items-center justify-center gap-2 px-4 py-2 rounded-full transition duration-200 "
    classes += type === subPage ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    return classes
  }

  return (
    <div className="w-full mt-8 px-4">
      <nav className="flex flex-wrap justify-center gap-4 mb-8">
        <Link to="/account" className={linkClasses("profile")}>
          <CgProfile size="20px" />
          <span className="font-medium">My Profile</span>
        </Link>
        <Link to="/account/bookings" className={linkClasses("bookings")}>
          <FaList size="20px" />
          <span className="font-medium">My Bookings</span>
        </Link>
        <Link to="/account/places" className={linkClasses("places")}>
          <FaHotel size="20px" />
          <span className="font-medium">My Accommodations</span>
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto">
        {subPage === "profile" && <Profile />}
        {subPage === "bookings" && <Bookings />}
        {subPage === "places" && <Places />}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

