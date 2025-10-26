// components/workout/ExerciseSelector.tsx

'use client';

import { ExerciseTemplate } from '@/types';
import { Plus, Info } from 'lucide-react';

interface ExerciseSelectorProps {
  exercises: ExerciseTemplate[];
  selectedExercises: string[];
  onToggle: (exerciseName: string) => void;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exercises,
  selectedExercises,
  onToggle,
}) => {
  return (
    <div className="space-y-3">
      {exercises.map(exercise => {
        const isSelected = selectedExercises.includes(exercise.name);

        return (
          <div
            key={exercise.name}
            className={`p-4 rounded-lg border-2 cursor-pointer transition ${
              isSelected
                ? 'bg-green-50 border-green-500'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onToggle(exercise.name)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
                <div className="mt-1 text-sm text-gray-600">
                  <span>{exercise.defaultSets} sets × {exercise.defaultReps} reps</span>
                  {exercise.technique && (
                    <span className="ml-3 text-blue-600">• {exercise.technique}</span>
                  )}
                </div>
                {exercise.notes && (
                  <div className="mt-2 text-xs text-gray-500 flex items-start gap-1">
                    <Info size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{exercise.notes}</span>
                  </div>
                )}
              </div>

              <div className={`p-2 rounded ${isSelected ? 'bg-green-500' : 'bg-gray-200'}`}>
                {isSelected ? (
                  <Plus size={20} className="text-white rotate-45" />
                ) : (
                  <Plus size={20} className="text-gray-600" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
