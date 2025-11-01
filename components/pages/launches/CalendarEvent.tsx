import React from 'react';
// Fix: Added .tsx extension to ensure module resolution.
import type { Launch } from '../LaunchCalendarPage.tsx';

interface CalendarEventProps {
  launch: Launch;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ launch, color, onEdit }) => {
  return (
    <button
      onClick={onEdit}
      className="w-full text-left p-1.5 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity"
      style={{ backgroundColor: color }}
    >
      <p className="font-bold text-white truncate">{launch.name}</p>
    </button>
  );
};

export default CalendarEvent;