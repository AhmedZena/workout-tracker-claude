// components/workout/DaySelector.tsx

'use client';

import { DayType } from '@/types';

interface DaySelectorProps {
  selected: DayType | null;
  onSelect: (day: DayType) => void;
}

const DAYS: DayType[] = ['Push', 'Pull', 'Leg', 'Upper'];

export const DaySelector: React.FC<DaySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {DAYS.map(day => (
        <button
          key={day}
          onClick={() => onSelect(day)}
          className={`p-6 rounded-lg border-2 font-semibold text-lg transition ${
            selected === day
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          {day} Day
        </button>
      ))}
    </div>
  );
};
