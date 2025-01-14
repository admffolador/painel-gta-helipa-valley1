import { format, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns";
import { CalendarDay } from "./CalendarDay";
import { CalendarStats } from "./CalendarStats";
import { getColorForStatus } from "./useCalendarData";

interface CalendarMonthProps {
  month: number;
  year: number;
  getDateColor: (date: Date) => string | undefined;
  onDateClick: (date: Date) => void;
  selectedEmployee: string | null;
}

export const CalendarMonth = ({ month, year, getDateColor, onDateClick, selectedEmployee }: CalendarMonthProps) => {
  const date = new Date(year, month, 1);
  const firstDayOfMonth = getDay(startOfMonth(date));
  const days = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
  
  const emptyDays = Array(firstDayOfMonth).fill(null);
  
  // Calculate statistics for weekdays only (não fins de semana)
  const workDays = days.filter(day => !isWeekend(day));
  const stats = ['entregue', 'meio-entregue', 'devendo', 'liberado', 'incompleto'].map(status => {
    const daysWithStatus = workDays.filter(
      day => {
        const color = getDateColor(day);
        return color === getColorForStatus(status);
      }
    );
    
    return {
      status,
      percentage: (daysWithStatus.length / workDays.length) * 100 || 0
    };
  });
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="text-lg font-semibold mb-2">
        {String(month + 1).padStart(2, '0')}
      </div>
      <div className="grid grid-cols-7 gap-1">
        <div className="h-6 flex items-center justify-center text-xs">D</div>
        <div className="h-6 flex items-center justify-center text-xs">S</div>
        <div className="h-6 flex items-center justify-center text-xs">T</div>
        <div className="h-6 flex items-center justify-center text-xs">Q</div>
        <div className="h-6 flex items-center justify-center text-xs">Q</div>
        <div className="h-6 flex items-center justify-center text-xs">S</div>
        <div className="h-6 flex items-center justify-center text-xs">S</div>
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-6" />
        ))}
        {days.map((day) => (
          <div key={day.toString()} className="flex items-center justify-center">
            <CalendarDay 
              day={day} 
              color={getDateColor(day)}
              onClick={() => onDateClick(day)}
            />
          </div>
        ))}
      </div>
      {selectedEmployee && <CalendarStats stats={stats} />}
    </div>
  );
};