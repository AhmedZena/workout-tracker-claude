// app/workout/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DayType, Workout, Exercise, Set } from '@/types';
import { DaySelector } from '@/components/workout/DaySelector';
import { ExerciseSelector } from '@/components/workout/ExerciseSelector';
import { SetInput } from '@/components/workout/SetInput';
import { getExercisesByDay } from '@/lib/exercises';
import * as storage from '@/lib/storage';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewWorkoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'day' | 'exercises' | 'sets'>('day');
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [exerciseData, setExerciseData] = useState<Record<string, Set[]>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const availableExercises = selectedDay ? getExercisesByDay(selectedDay) : [];

  const handleDaySelect = (day: DayType) => {
    setSelectedDay(day);
    setStep('exercises');
  };

  const handleExerciseToggle = (exerciseName: string) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseName)) {
        const newData = { ...exerciseData };
        delete newData[exerciseName];
        setExerciseData(newData);
        return prev.filter(name => name !== exerciseName);
      } else {
        const template = availableExercises.find(e => e.name === exerciseName);
        const defaultSets: Set[] = Array(template?.defaultSets || 2).fill(null).map(() => ({
          reps: 10,
          weight: 0,
          completed: false,
        }));
        setExerciseData({ ...exerciseData, [exerciseName]: defaultSets });
        return [...prev, exerciseName];
      }
    });
  };

  const handleSetsChange = (exerciseName: string, sets: Set[]) => {
    setExerciseData({ ...exerciseData, [exerciseName]: sets });
  };

  const handleSave = async () => {
    if (!user || !selectedDay) return;

    setSaving(true);

    const exercises: Exercise[] = selectedExercises.map(name => ({
      id: `exercise-${Date.now()}-${Math.random()}`,
      name,
      sets: exerciseData[name] || [],
      notes: '',
    }));

    const workout: Workout = {
      id: `workout-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      dayType: selectedDay,
      exercises,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveWorkout(workout);

    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">New Workout</h1>

          {/* Step 1: Select Day */}
          {step === 'day' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Select Workout Day
              </h2>
              <DaySelector selected={selectedDay} onSelect={handleDaySelect} />
            </div>
          )}

          {/* Step 2: Select Exercises */}
          {step === 'exercises' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Select Exercises ({selectedDay} Day)
                </h2>
                <button
                  onClick={() => setStep('day')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Change Day
                </button>
              </div>

              <ExerciseSelector
                exercises={availableExercises}
                selectedExercises={selectedExercises}
                onToggle={handleExerciseToggle}
              />

              {selectedExercises.length > 0 && (
                <button
                  onClick={() => setStep('sets')}
                  className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Continue to Sets ({selectedExercises.length} exercises)
                </button>
              )}
            </div>
          )}

          {/* Step 3: Enter Sets */}
          {step === 'sets' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  Enter Sets & Reps
                </h2>
                <button
                  onClick={() => setStep('exercises')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Change Exercises
                </button>
              </div>

              <div className="space-y-8">
                {selectedExercises.map(exerciseName => (
                  <div key={exerciseName} className="border-b pb-6">
                    <h3 className="font-semibold text-lg mb-4">{exerciseName}</h3>
                    <SetInput
                      sets={exerciseData[exerciseName] || []}
                      onChange={sets => handleSetsChange(exerciseName, sets)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  rows={3}
                  placeholder="How did you feel? Any observations?"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Workout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
