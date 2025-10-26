// components/workout/ExerciseSelector.tsx

'use client';

import { ExerciseTemplate } from '@/types';
import { Plus, Info } from 'lucide-react';
import Image from 'next/image';

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
            className={`p-3 md:p-4 rounded-lg border-2 cursor-pointer transition ${
              isSelected
                ? 'bg-green-50 border-green-500'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onToggle(exercise.name)}
          >
            <div className="flex items-start gap-3">
              {/* Exercise Image */}
              {exercise.imageUrl && (
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 96px"
                  />
                </div>
              )}

              {/* Exercise Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm md:text-base lg:text-lg text-gray-900 leading-tight">
                  {exercise.name}
                </h3>
                <div className="mt-1 text-xs md:text-sm text-gray-700 font-medium">
                  <span>{exercise.defaultSets} sets × {exercise.defaultReps} reps</span>
                  {exercise.technique && (
                    <span className="ml-2 md:ml-3 text-blue-700 font-semibold">• {exercise.technique}</span>
                  )}
                </div>
                {exercise.notes && (
                  <div className="mt-2 text-xs text-gray-700 flex items-start gap-1">
                    <Info size={12} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{exercise.notes}</span>
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              <div className={`p-2 rounded flex-shrink-0 ${isSelected ? 'bg-green-500' : 'bg-gray-200'}`}>
                {isSelected ? (
                  <Plus size={18} className="text-white rotate-45" />
                ) : (
                  <Plus size={18} className="text-gray-600" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
