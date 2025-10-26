// lib/storage.ts

import { LocalStorageData, User, Workout } from '@/types';

const STORAGE_KEY = 'workout_tracker_data';

export const getStorageData = (): LocalStorageData => {
  if (typeof window === 'undefined') return getDefaultData();

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultData();
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return getDefaultData();
  }
};

export const setStorageData = (data: LocalStorageData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const getDefaultData = (): LocalStorageData => ({
  users: [],
  currentUserId: null,
  workouts: [],
  lastSync: new Date().toISOString(),
});

// User operations
export const saveUser = (user: User): void => {
  const data = getStorageData();
  data.users.push(user);
  setStorageData(data);
};

export const getUserByUsername = (username: string): User | undefined => {
  const data = getStorageData();
  return data.users.find(u => u.username === username);
};

export const setCurrentUser = (userId: string): void => {
  const data = getStorageData();
  data.currentUserId = userId;
  setStorageData(data);
};

export const getCurrentUser = (): User | null => {
  const data = getStorageData();
  if (!data.currentUserId) return null;
  return data.users.find(u => u.id === data.currentUserId) || null;
};

export const logout = (): void => {
  const data = getStorageData();
  data.currentUserId = null;
  setStorageData(data);
};

// Workout operations
export const saveWorkout = (workout: Workout): void => {
  const data = getStorageData();
  const existingIndex = data.workouts.findIndex(w => w.id === workout.id);

  if (existingIndex >= 0) {
    data.workouts[existingIndex] = workout;
  } else {
    data.workouts.push(workout);
  }

  setStorageData(data);
};

export const getWorkoutsByUserId = (userId: string): Workout[] => {
  const data = getStorageData();
  return data.workouts
    .filter(w => w.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getWorkoutById = (workoutId: string): Workout | undefined => {
  const data = getStorageData();
  return data.workouts.find(w => w.id === workoutId);
};

export const deleteWorkout = (workoutId: string): void => {
  const data = getStorageData();
  data.workouts = data.workouts.filter(w => w.id !== workoutId);
  setStorageData(data);
};
