// components/workout/SetInput.tsx

'use client';

import { Set } from '@/types';
import { Trash2, Plus } from 'lucide-react';

interface SetInputProps {
  sets: Set[];
  onChange: (sets: Set[]) => void;
}

export const SetInput: React.FC<SetInputProps> = ({ sets, onChange }) => {
  const addSet = () => {
    onChange([...sets, { reps: 10, weight: 0, completed: false }]);
  };

  const removeSet = (index: number) => {
    onChange(sets.filter((_, i) => i !== index));
  };

  const updateSet = (index: number, field: keyof Set, value: any) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    onChange(newSets);
  };

  return (
    <div className="space-y-3">
      {sets.map((set, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="w-12 text-center font-semibold text-gray-600">
            Set {index + 1}
          </span>

          <input
            type="number"
            value={set.reps}
            onChange={e => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-2 border rounded-lg"
            placeholder="Reps"
            min="1"
          />

          <input
            type="number"
            value={set.weight || ''}
            onChange={e => updateSet(index, 'weight', parseFloat(e.target.value) || undefined)}
            className="w-24 px-3 py-2 border rounded-lg"
            placeholder="Weight (kg)"
            step="0.5"
          />

          <button
            onClick={() => removeSet(index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <button
        onClick={addSet}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
      >
        <Plus size={18} />
        Add Set
      </button>
    </div>
  );
};
