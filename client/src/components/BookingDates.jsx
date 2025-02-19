import { differenceInCalendarDays, format } from "date-fns";
import { IoCalendarNumber } from "react-icons/io5";
import { GiNightSleep } from "react-icons/gi";

export default function BookingDates({place, className}) {
  return (
    <div>
      <div className={"flex items-center gap-2 text-xs sm:text-base md:text-lg lg:text-xl" + className}>
            <p className="flex items-center gap-2 ">{<GiNightSleep />}{differenceInCalendarDays(new Date(place.check_out), new Date(place.check_in))} nights |</p>
            <IoCalendarNumber />
            <p>{format(new Date(place.check_in), "iii do MMM y") }</p>
            &rarr; 
            <p>{ format(new Date(place.check_out), "iii do MMM y")}</p>
        </div>
    </div>
  )
}
