import { LuGlobe } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { RiAccountCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { useMediaQuery } from "react-responsive";
import { useSearch } from "../SearchContext";
import axios from "axios";


export default function Header() {
  const {user} = useContext(UserContext);
  const { searchQuery, setSearchQuery } = useSearch();
  const isPhoneView = useMediaQuery({query: "(max-width: 724px)"});
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
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
    console.log(searchQuery);
    if(!isPhoneView){
      setSearchValue("");
    }
  };

  const handleChange = async (e) => {
    setSearchValue(e.target.value);
    const response = await fetchData(e.target.value);
    setSearchQuery([...response]);
  }

  const handleSearchTermination = (event) => {
    if(!isPhoneView) setSearchBarActive(!searchBarActive);
    setSearchValue("");
    axios.get("/places")
    .then(res => {
      setSearchQuery([...res.data]);
    })
    .catch(err => {
      console.log(err);
    });
  }

    return (
      <div>
        <header className='py-4 px-3 sm:px-6 md:px-9 flex gap-6 justify-between items-center overflow-hidden w-full'>
          
          <Link to="/" href="" className="flex collapse sm:visible lg:w-60 gap-1 items-center">
            <svg className='w-8 h-8 hidden md:block' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 48" id="airbnb">
              <path fill="#ff5a5f" d="M43.2 33.5l-.2-.6c-.2-.4-.3-.8-.5-1.1-.2-.4-.3-.8-.5-1.1l-.6-1.2-.1-.1C38 22.2 34.6 15.3 31.2 8.7l-.1-.3c-.4-.7-.8-1.4-1.1-2.2l-.2-.2c-.4-.8-.9-1.6-1.6-2.4-1.5-1.9-3.8-3-6.2-3-2.4 0-4.6 1-6.2 2.9-.7.9-1.2 1.8-1.7 2.6-.4.7-.7 1.5-1.1 2.2l-.1.3C9 16.1 5.6 22.9 2.7 29.3l-.1.1c-.2.4-.4.8-.5 1.2-.2.4-.3.7-.5 1.1-.2.5-.5 1.1-.7 1.7-.6 1.8-.8 3.5-.6 5.2.5 3.6 2.9 6.6 6.3 8 1.2.5 2.5.8 3.9.8.4 0 .9-.1 1.3-.1 1.6-.2 3.3-.7 4.8-1.6 1.8-1 3.5-2.4 5.5-4.5 1.9 2 3.7 3.4 5.5 4.5 1.5.9 3.1 1.4 4.8 1.6.3 0 .8.1 1.3.1 1.4 0 2.8-.3 3.9-.8 3.3-1.3 5.7-4.4 6.3-8 .1-1.5-.1-3.2-.7-5.1zm-25.5-8.7c.1-.6.3-1.2.6-1.7.8-1.2 2.1-1.8 3.6-1.8 1.6 0 2.9.7 3.6 1.8.4.5.6 1.1.7 1.7.1.8.1 1.7-.1 2.6-.5 2.2-1.9 4.9-4.2 7.9-2.2-2.9-3.7-5.6-4.2-7.9-.1-1-.1-1.8 0-2.6zM30 28.4c.3-1.4.4-2.7.2-4.1-.2-1.2-.6-2.4-1.3-3.3-1.5-2.2-4-3.5-6.9-3.5-2.8 0-5.3 1.3-6.9 3.5-.7 1-1.1 2.1-1.3 3.3-.2 1.3-.1 2.7.2 4.1.7 3 2.5 6.4 5.4 10.1-1.7 1.9-3.3 3.2-4.8 4.1-1.1.6-2.2 1-3.3 1.1-1.1.1-2.2 0-3.3-.4-2.1-.9-3.6-2.8-3.9-5-.1-1.3 0-2.3.5-3.5.1-.3.2-.6.4-.9.1-.2.1-.3.2-.5.3-.7.7-1.5 1-2.3V31c3.4-7.2 6.8-14.2 10.1-20.6l.1-.3c.2-.3.4-.7.6-1.1.2-.4.4-.7.6-1.1.4-.8.8-1.4 1.2-1.9.9-1 2-1.5 3.3-1.5s2.4.5 3.3 1.5c.4.5.8 1.1 1.2 1.9.2.3.4.7.5 1.1.2.4.4.7.5 1l.1.3c3.5 6.8 6.8 13.7 10 20.5l.1.2c.2.4.3.7.5 1.1.2.4.4.8.5 1.1.1.2.1.3.2.5.2.3.3.6.4.9.4 1.2.5 2.3.3 3.3-.3 2.2-1.8 4.1-3.9 5-1 .4-2.1.6-3.2.4-1.1-.1-2.2-.5-3.3-1.1-1.5-.8-3-2.1-4.8-4.1 3-3.3 4.8-6.7 5.5-9.7z"></path>
            </svg>
              <span className='font-bold text-2xl text-primary md:block'>airbnb</span>
          </Link>

          {searchBarActive && 
          <form onSubmit={handleSubmit} class="w-[55%]  left-12 lg:w-[30%] lg:left-1/2 lg:-translate-x-1/2 absolute">   
              <label for="default-search" class="mb-2 text-sm font-medium sr-only">Search</label>
              <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <input 
                    onChange={(e) => handleChange(e)} 
                    value={searchValue}
                    type="search" 
                    id="default-search" 
                    name="search" 
                    class="block w-full p-4 ps-10 text-sm border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="Search Resorts, Homestay...." required />
                  <div className="absolute end-2.5 bottom-2.5 bg-white cursor-pointer px-[3px] py-[1px] rounded flex items-center gap-1">
                    <button type="submit" class="text-white text-xs bg-primary hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
                    {!isPhoneView ? 
                      <svg
                      onClick={(e) => handleSearchTermination(e) }
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg> : 
                    <svg onClick={(e) => handleSearchTermination(e)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>}

                  </div>
              </div>
          </form>}

          {!isPhoneView && !searchBarActive && (
            <div className='flex items-center border my-auto border-gray-300 py-2 px-4 rounded-full gap-4 shadow-md shadow-gray-200 h-min'>
              <div className='font-semibold'>Anywhere</div>
              <div className='border-l border-gray-300 h-10 md:h-6'></div>
              <div className='font-semibold block'>Any week</div>
              <div className='border-l border-gray-300 h-10 md:h-6'></div>
              <div className='flex gap-4'>
                <span className='font-light my-auto'>Any guests</span>
                <button 
                  onClick={() => setSearchBarActive(!searchBarActive)}
                  className='flex justify-center items-center bg-primary h-8 w-8 my-auto p-2 rounded-2xl'>
                  <IoSearch color='white'/>
                </button>
              </div>
            </div>
          )}
          <div className='flex gap-5 items-center relative'>
            {!user && (
              <>
                <a href="" className="hidden lg:block">Airbnb your home</a>
                <a href="" className="hidden md:block">
                  <LuGlobe size='20px'/>
                </a>
              </>
            )}
            <Link to={user ? '/account': '/login'} className="flex gap-1 items-center border border-gray-300 p-3 rounded-full">
                <IoIosMenu size="25px" />
                <RiAccountCircleFill size="35px" />
                {!!user && !isPhoneView && (
                  <div>
                    {user.rows ? <b>{user.rows[0].name}</b> : <b>{user.name}</b>}
                  </div>
                )}
            </Link>
          </div>
        </header>
        <hr  className="absolute top-24 inset-0"/>
      </div>
    )
}