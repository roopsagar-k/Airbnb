import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { User, Hotel, BookMarked, LogOut } from "lucide-react";
import Places from "./Places";
import Favorites from "../components/Favorites";
import Bookings from "./Bookings";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AccountPage() {
  const { subPage } = useParams();
  const navigate = useNavigate();
  const { ready, user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const activeSubPage = subPage || "profile";

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  async function handleLogout() {
    setIsLoading(true);
    try {
      await axios.post("/logout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const Profile = () => {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center">
              <User size={40} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
        <Favorites />
      </div>
    );
  };

  const linkClasses = (type) => {
    const baseClasses = "flex items-center gap-2 px-6 py-3 rounded-xl transition duration-200 ";
    return baseClasses + (type === activeSubPage
      ? "bg-indigo-600 text-white shadow-md"
      : "bg-white text-gray-700 hover:bg-indigo-50");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8"> {/* Added pt-24 to account for header height */}
      <div className="max-w-7xl mx-auto">
        {/* Navigation bar */}
        <div className="bg-white shadow-sm rounded-2xl p-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <nav className="flex flex-wrap gap-4 justify-center">
              <Link to="/account" className={linkClasses("profile")}>
                <User size={20} />
                <span className="font-medium">Profile</span>
              </Link>
              <Link to="/account/bookings" className={linkClasses("bookings")}>
                <BookMarked size={20} />
                <span className="font-medium">Bookings</span>
              </Link>
              <Link to="/account/places" className={linkClasses("places")}>
                <Hotel size={20} />
                <span className="font-medium">Properties</span>
              </Link>
            </nav>
            
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 disabled:opacity-50 w-full sm:w-auto justify-center"
            >
              <LogOut size={20} />
              <span className="font-medium">{isLoading ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>

        <div className="mt-8">
          {activeSubPage === "profile" && <Profile />}
          {activeSubPage === "bookings" && <Bookings />}
          {activeSubPage === "places" && <Places />}
        </div>
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        theme="colored"
      />
    </div>
  );
}