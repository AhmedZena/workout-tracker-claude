// types/index.ts

export type DayType = 'Push' | 'Pull' | 'Leg' | 'Upper';

export interface User {
  id: string;
  username: string;
  password: string; // hashed
  createdAt: string;
}

export interface Set {
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  date: string; // ISO format
  dayType: DayType;
  exercises: Exercise[];
  duration?: number; // in minutes
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseTemplate {
  name: string;
  defaultSets: number;
  defaultReps: string; // e.g., "8-12"
  category: DayType;
  notes?: string;
  restTime?: string; // e.g., "0:1:0"
  technique?: string; // e.g., "Super Sets"
  imageUrl?: string; // Exercise demonstration image
}

export interface LocalStorageData {
  users: User[];
  currentUserId: string | null;
  workouts: Workout[];
  lastSync: string;
}
