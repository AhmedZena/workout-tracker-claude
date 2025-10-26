// app/archive/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Workout, DayType } from '@/types';
import * as storage from '@/lib/storage';
import { format } from 'date-fns';
import { Filter, Calendar, TrendingUp } from 'lucide-react';

export default function ArchivePage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [filterDay, setFilterDay] = useState<DayType | 'All'>('All');

  useEffect(() => {
    if (user) {
      const userWorkouts = storage.getWorkoutsByUserId(user.id);
      setWorkouts(userWorkouts);
      setFilteredWorkouts(userWorkouts);
    }
  }, [user]);

  useEffect(() => {
    if (filterDay === 'All') {
      setFilteredWorkouts(workouts);
    } else {
      setFilteredWorkouts(workouts.filter(w => w.dayType === filterDay));
    }
  }, [filterDay, workouts]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Workout Archive</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="font-semibold">Filter by Day</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['All', 'Push', 'Pull', 'Leg', 'Upper'] as const).map(day => (
              <button
                key={day}
                onClick={() => setFilterDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterDay === day
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-600 mb-1">Total Workouts</h3>
            <p className="text-3xl font-bold text-gray-800">{workouts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-600 mb-1">Filtered Results</h3>
            <p className="text-3xl font-bold text-gray-800">{filteredWorkouts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-600 mb-1">This Month</h3>
            <p className="text-3xl font-bold text-gray-800">
              {workouts.filter(w => {
                const workoutDate = new Date(w.date);
                const now = new Date();
                return workoutDate.getMonth() === now.getMonth() &&
                       workoutDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Workouts List */}
        <div className="bg-white rounded-lg shadow">
          {filteredWorkouts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No workouts found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredWorkouts.map(workout => (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.id}`}
                  className="block p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          workout.dayType === 'Push' ? 'bg-blue-100 text-blue-700' :
                          workout.dayType === 'Pull' ? 'bg-green-100 text-green-700' :
                          workout.dayType === 'Leg' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {workout.dayType}
                        </span>
                        <span className="text-gray-600">
                          {format(new Date(workout.date), 'PPP')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {workout.exercises.length} exercises • {' '}
                        {workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)} total sets
                      </p>
                    </div>
                    <TrendingUp className="text-gray-400" size={24} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
