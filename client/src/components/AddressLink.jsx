import { IoLocationSharp } from "react-icons/io5";

export default function AddressLink({children}) {
  return (
    <>
        <a target="_blank" rel="noreferrer" href={`https://maps.google.com/?q=${children}`} className="flex items-center cursor-pointer my-2 font-bold underline text-sm sm:text-base md:text-lg lg:text-xl"><IoLocationSharp  />{children}</a>
    </>
  )
}
