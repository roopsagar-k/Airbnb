import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { UserContext } from "../UserContext";
import { useSearch } from "../SearchContext";
import { Search, Globe, Menu, User, X, MapPin, Calendar } from "lucide-react";
import axios from "axios";

export default function Header() {
  const { user } = useContext(UserContext);
  const { searchQuery, setSearchQuery } = useSearch();
  const isPhoneView = useMediaQuery({ query: "(max-width: 724px)" });
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (isPhoneView) {
      setSearchBarActive(true);
    }
  }, [isPhoneView]);

  async function fetchData(params) {
    const response = await axios.post("/filter", { searchQuery: params });
    return response.data;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetchData(searchValue);
    setSearchQuery([...response]);
    if (!isPhoneView) {
      setSearchValue("");
    }
  };

  const handleChange = async (e) => {
    setSearchValue(e.target.value);
    const response = await fetchData(e.target.value);
    setSearchQuery([...response]);
  };

  const handleSearchTermination = () => {
    if (!isPhoneView) setSearchBarActive(!searchBarActive);
    setSearchValue("");
    axios.get("/places")
      .then(res => {
        setSearchQuery([...res.data]);
      })
      .catch(err => {
        console.error("Error fetching places:", err);
      });
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <header className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <span className="font-bold text-xl text-gray-900 hidden sm:block">StayDnD</span>
        </Link>

        {/* Search Bar */}
        {searchBarActive ? (
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="search"
                value={searchValue}
                onChange={handleChange}
                placeholder="Search accommodations..."
                className="w-full pl-12 pr-16 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleSearchTermination}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          !isPhoneView && (
            <div className="flex-1 max-w-2xl mx-4">
              <button
                onClick={() => setSearchBarActive(true)}
                className="w-full flex items-center gap-4 px-6 py-3 rounded-full border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <Search className="h-5 w-5 text-gray-400" />
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">Anywhere</span>
                  <span className="h-4 w-px bg-gray-300" />
                  <span className="font-medium">Any week</span>
                  <span className="h-4 w-px bg-gray-300" />
                  <span>Add guests</span>
                </div>
              </button>
            </div>
          )
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link
                to="/host"
                className="hidden lg:block text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                List your property
              </Link>
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
                <Globe className="h-10 w-10 text-gray-700" />
              </button>
            </>
          )}
          
          <Link
            to={user ? '/account' : '/login'}
            className="flex items-center gap-3 px-3 py-2 rounded-full border border-gray-200 hover:shadow-md transition-all"
          >
            <Menu className="h-5 w-5 text-gray-700" />
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            {user && !isPhoneView && (
              <span className="font-medium text-gray-700">
                {user.rows ? user.rows[0].name : user.name}
              </span>
            )}
          </Link>
        </div>
      </header>
    </div>
  );
}