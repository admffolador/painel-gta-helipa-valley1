import { format } from "date-fns";
import { CalendarMonth } from "./calendar/CalendarMonth";
import { useCalendarData } from "./calendar/useCalendarData";

interface CalendarProps {
  year: number;
  selectedEmployee: string | null;
  selectedStatus: string | null;
}

export const Calendar = ({ year, selectedEmployee, selectedStatus }: CalendarProps) => {
  const { getDateColor, refreshCalendar, handleDateClick } = useCalendarData(selectedEmployee, selectedStatus);
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="grid grid-cols-4 gap-4">
      {months.map((month) => (
        <CalendarMonth
          key={month}
          month={month}
          year={year}
          getDateColor={getDateColor}
          onDateClick={handleDateClick}
          selectedEmployee={selectedEmployee}
        />
      ))}
    </div>
  );
};