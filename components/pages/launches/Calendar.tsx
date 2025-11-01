import React, { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
// Fix: Added .tsx extension to ensure module resolution.
import { Launch, Brand } from '../LaunchCalendarPage.tsx';
import CalendarEvent from './CalendarEvent.tsx';
import { Button } from '../../ui/Button.tsx';

interface CalendarProps {
  launches: Launch[];
  brands: Brand[];
  onEditLaunch: (launch: Launch) => void;
  onDeleteLaunch: (launchId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ launches, brands, onEditLaunch, onDeleteLaunch }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const launchesByDate = useMemo(() => {
    const map = new Map<string, Launch[]>();
    launches.forEach(launch => {
      const dateKey = format(new Date(launch.launch_date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(launch);
    });
    return map;
  }, [launches]);

  const brandColorMap = useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach(brand => {
        map.set(brand.id, brand.primary_color || '#8b5cf6');
    });
    return map;
  }, [brands]);

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&lt;</Button>
        <h2 className="text-xl font-bold text-white">{format(currentDate, 'MMMM yyyy')}</h2>
        <Button variant="ghost" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&gt;</Button>
      </div>
      <div className="grid grid-cols-7 text-center font-semibold text-slate-400 text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d) => (
          <div
            key={d.toString()}
            className={`h-40 border border-slate-700/50 p-2 overflow-y-auto ${
              !isSameMonth(d, monthStart) ? 'bg-slate-900/40' : ''
            }`}
          >
            <span className={`flex items-center justify-center h-6 w-6 rounded-full text-sm ${isToday(d) ? 'bg-primary text-white' : ''}`}>
                {format(d, 'd')}
            </span>
            <div className="mt-1 space-y-1">
                {launchesByDate.get(format(d, 'yyyy-MM-dd'))?.map(launch => (
                    <CalendarEvent 
                        key={launch.id} 
                        launch={launch}
                        color={brandColorMap.get(launch.brand_id) || '#8b5cf6'}
                        onEdit={() => onEditLaunch(launch)} 
                        onDelete={() => onDeleteLaunch(launch.id)}
                    />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;