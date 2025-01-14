import { format, isWeekend } from "date-fns";

interface CalendarDayProps {
  day: Date;
  color?: string;
  onClick: () => void;
}

export const CalendarDay = ({ day, color, onClick }: CalendarDayProps) => {
  const dayNumber = format(day, "d");
  const isWeekendDay = isWeekend(day);
  
  return (
    <button 
      onClick={onClick}
      className="h-6 w-6 relative flex items-center justify-center hover:bg-accent/50 rounded-full transition-colors"
    >
      <div
        className={`absolute inset-0 rounded-full transition-colors ${
          color ? 'opacity-40' : isWeekendDay ? 'opacity-100 bg-black' : 'opacity-0'
        }`}
        style={{ backgroundColor: color || undefined }}
      />
      <span 
        className={`relative z-10 text-xs ${
          color ? 'font-semibold' : ''
        } ${
          isWeekendDay && !color ? 'text-white' : ''
        }`}
      >
        {dayNumber}
      </span>
    </button>
  );
};