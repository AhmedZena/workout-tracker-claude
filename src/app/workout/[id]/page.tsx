// app/workout/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Workout } from '@/types';
import * as storage from '@/lib/storage';
import { format } from 'date-fns';
import { ArrowLeft, Trash2, Calendar, Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function WorkoutDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (params.id) {
      const foundWorkout = storage.getWorkoutById(params.id as string);
      if (foundWorkout) {
        setWorkout(foundWorkout);
      }
    }
  }, [params.id]);

  const handleDelete = () => {
    if (workout) {
      storage.deleteWorkout(workout.id);
      router.push('/dashboard');
    }
  };

  if (!user || !workout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalVolume = workout.exercises.reduce((sum, ex) => {
    return sum + ex.sets.reduce((setSum, set) => {
      return setSum + (set.weight || 0) * set.reps;
    }, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            Back to Archive
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-4 py-2 rounded-full text-lg font-semibold ${
                  workout.dayType === 'Push' ? 'bg-blue-100 text-blue-700' :
                  workout.dayType === 'Pull' ? 'bg-green-100 text-green-700' :
                  workout.dayType === 'Leg' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {workout.dayType} Day
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar size={18} />
                <span>{format(new Date(workout.date), 'PPP')}</span>
              </div>
              <div className="text-sm text-gray-500">
                Created: {format(new Date(workout.createdAt), 'PPp')}
              </div>
            </div>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Total Exercises</h3>
              <p className="text-2xl font-bold text-blue-700">{workout.exercises.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Total Sets</h3>
              <p className="text-2xl font-bold text-green-700">{totalSets}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Total Volume (kg)</h3>
              <p className="text-2xl font-bold text-purple-700">{totalVolume.toFixed(1)}</p>
            </div>
          </div>

          {/* Workout Notes */}
          {workout.notes && (
            <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Workout Notes</h3>
              <p className="text-gray-700">{workout.notes}</p>
            </div>
          )}

          {/* Exercises */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Dumbbell size={24} />
              Exercises
            </h2>

            <div className="space-y-6">
              {workout.exercises.map((exercise, idx) => (
                <div key={exercise.id} className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {idx + 1}. {exercise.name}
                  </h3>

                  {/* Sets Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Set</th>
                          <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Reps</th>
                          <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Weight (kg)</th>
                          <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Volume (kg)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercise.sets.map((set, setIdx) => (
                          <tr key={setIdx} className="border-b last:border-b-0">
                            <td className="py-3 px-4 text-gray-700">{setIdx + 1}</td>
                            <td className="py-3 px-4 text-gray-700">{set.reps}</td>
                            <td className="py-3 px-4 text-gray-700">{set.weight || 0}</td>
                            <td className="py-3 px-4 font-semibold text-gray-800">
                              {((set.weight || 0) * set.reps).toFixed(1)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold">
                          <td className="py-3 px-4" colSpan={3}>Total Volume</td>
                          <td className="py-3 px-4 text-blue-700">
                            {exercise.sets.reduce((sum, set) => sum + (set.weight || 0) * set.reps, 0).toFixed(1)} kg
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {exercise.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                      <strong>Note:</strong> {exercise.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Workout?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this workout? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
