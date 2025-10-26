// app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Workout } from '@/types';
import * as storage from '@/lib/storage';
import { Calendar, TrendingUp, Dumbbell, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const userWorkouts = storage.getWorkoutsByUserId(user.id);
      setWorkouts(userWorkouts.slice(0, 5)); // Last 5 workouts
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const allWorkouts = storage.getWorkoutsByUserId(user.id);
  const stats = {
    totalWorkouts: allWorkouts.length,
    thisWeek: allWorkouts.filter(w => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(w.date) >= weekAgo;
    }).length,
    lastWorkout: allWorkouts[0] ? format(new Date(allWorkouts[0].date), 'PPP') : 'No workouts yet',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-600">Track your fitness journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-blue-600" size={24} />
              <h3 className="font-semibold text-gray-700">Total Workouts</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalWorkouts}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-600" size={24} />
              <h3 className="font-semibold text-gray-700">This Week</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.thisWeek}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell className="text-purple-600" size={24} />
              <h3 className="font-semibold text-gray-700">Last Workout</h3>
            </div>
            <p className="text-lg font-semibold text-gray-800">{stats.lastWorkout}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link
              href="/workout/new"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <Plus size={20} />
              Start New Workout
            </Link>
            <Link
              href="/archive"
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              View Archive
            </Link>
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Workouts</h2>
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No workouts yet. Start your first workout!
            </p>
          ) : (
            <div className="space-y-3">
              {workouts.map(workout => (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{workout.dayType} Day</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(workout.date), 'PPP')}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {workout.exercises.length} exercises
                    </div>
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
