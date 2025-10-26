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
import { ArrowLeft, Save, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function NewWorkoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'day' | 'exercises' | 'sets'>('day');
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [exerciseData, setExerciseData] = useState<Record<string, Set[]>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const availableExercises = selectedDay ? getExercisesByDay(selectedDay) : [];

  const handleDaySelect = (day: DayType) => {
    // Check if workout with different type exists on selected date
    if (user) {
      const existingWorkouts = storage.getWorkoutsByUserId(user.id);
      const selectedDateStart = new Date(selectedDate);
      selectedDateStart.setHours(0, 0, 0, 0);
      const selectedDateEnd = new Date(selectedDate);
      selectedDateEnd.setHours(23, 59, 59, 999);

      const workoutOnDate = existingWorkouts.find(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= selectedDateStart && workoutDate <= selectedDateEnd;
      });

      if (workoutOnDate && workoutOnDate.dayType !== day) {
        setError(`You already have a ${workoutOnDate.dayType} workout on ${format(new Date(selectedDate), 'MMM dd, yyyy')}. Please choose a different date or the same workout type.`);
        return;
      }
    }

    setError('');
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

    // Use selected date
    const workoutDate = new Date(selectedDate);
    workoutDate.setHours(new Date().getHours());
    workoutDate.setMinutes(new Date().getMinutes());

    const workout: Workout = {
      id: `workout-${Date.now()}`,
      userId: user.id,
      date: workoutDate.toISOString(),
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
    <div className="min-h-screen bg-gray-50 pb-8">
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

        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">New Workout</h1>

          {/* Date Picker */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={18} className="text-blue-600" />
              Workout Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (selectedDay) {
                  setSelectedDay(null);
                  setStep('day');
                  setError('');
                }
              }}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
            />
            <p className="text-xs text-gray-600 mt-2">Select the date for this workout (default: today)</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Step 1: Select Day */}
          {step === 'day' && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
                Select Workout Day
              </h2>
              <DaySelector selected={selectedDay} onSelect={handleDaySelect} />
            </div>
          )}

          {/* Step 2: Select Exercises */}
          {step === 'exercises' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-700">
                  Select Exercises ({selectedDay} Day)
                </h2>
                <button
                  onClick={() => setStep('day')}
                  className="text-sm md:text-base text-blue-600 hover:text-blue-700"
                >
                  Change Day
                </button>
              </div>

              <div className="max-h-[60vh] md:max-h-[70vh] overflow-y-auto pr-2">
                <ExerciseSelector
                  exercises={availableExercises}
                  selectedExercises={selectedExercises}
                  onToggle={handleExerciseToggle}
                />
              </div>

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
                <h2 className="text-lg md:text-xl font-semibold text-gray-700">
                  Enter Sets & Reps
                </h2>
                <button
                  onClick={() => setStep('exercises')}
                  className="text-sm md:text-base text-blue-600 hover:text-blue-700"
                >
                  Change Exercises
                </button>
              </div>

              <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2 space-y-6 md:space-y-8">
                {selectedExercises.map(exerciseName => (
                  <div key={exerciseName} className="border-b pb-6">
                    <h3 className="font-semibold text-base md:text-lg mb-4 text-gray-800">{exerciseName}</h3>
                    <SetInput
                      sets={exerciseData[exerciseName] || []}
                      onChange={sets => handleSetsChange(exerciseName, sets)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 md:mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-gray-900"
                  rows={3}
                  placeholder="How did you feel? Any observations?"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 md:py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
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
