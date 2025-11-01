'use client';

import type { Launch } from '@/app/launches/LaunchesClient';
import { useMemo } from 'react';

interface CalendarEventProps {
  launch: Launch;
  color: string;
  onEdit: () => void;
}

export default function CalendarEvent({ launch, color, onEdit }: CalendarEventProps) {
  const { completedTasks, totalTasks, progress } = useMemo(() => {
    const tasks = Array.isArray(launch.tasks) ? launch.tasks : [];
    const total = tasks.length;
    if (total === 0) return { completedTasks: 0, totalTasks: 0, progress: 0 };

    const completed = tasks.filter((task: any) => task.completed).length;
    return {
      completedTasks: completed,
      totalTasks: total,
      progress: Math.round((completed / total) * 100),
    };
  }, [launch.tasks]);

  return (
    <button
      onClick={onEdit}
      className="w-full text-left p-1.5 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity"
      style={{ backgroundColor: color }}
    >
      <p className="font-bold text-white truncate">{launch.title}</p>
      {totalTasks > 0 && (
        <div className="mt-1">
            <div className="w-full bg-black/20 rounded-full h-1.5">
                <div className="bg-white/80 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      )}
    </button>
  );
}
