import { Progress } from "@/components/ui/progress";
import { getColorForStatus } from "./useCalendarData";

interface StatusStats {
  status: string;
  percentage: number;
}

interface CalendarStatsProps {
  stats: StatusStats[];
}

export const CalendarStats = ({ stats }: CalendarStatsProps) => {
  return (
    <div className="mt-2 space-y-2">
      {stats.map((stat) => (
        <div key={stat.status} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="capitalize">{stat.status}</span>
            <span>{stat.percentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stat.percentage} 
            className={`h-2 bg-opacity-10 bg-black [&>div]:bg-[${getColorForStatus(stat.status)}]`}
          />
        </div>
      ))}
    </div>
  );
};