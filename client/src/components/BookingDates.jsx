import { differenceInCalendarDays, format } from "date-fns";
import { Calendar, Moon } from "lucide-react";

export default function BookingDates({ place, className = "" }) {
  const nights = differenceInCalendarDays(
    new Date(place.check_out),
    new Date(place.check_in)
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        <Moon size={16} />
        <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Calendar size={16} />
        <div className="flex items-center gap-2">
          <span>{format(new Date(place.check_in), "MMM d, yyyy")}</span>
          <span className="text-gray-400">→</span>
          <span>{format(new Date(place.check_out), "MMM d, yyyy")}</span>
        </div>
      </div>
    </div>
  );
}