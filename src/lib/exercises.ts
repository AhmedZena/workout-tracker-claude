// lib/exercises.ts

import { DayType, ExerciseTemplate } from '@/types';

export const EXERCISES: Record<DayType, ExerciseTemplate[]> = {
  Push: [
    {
      name: 'Cable Lateral Raises',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Push',
      restTime: '0:1:0',
    },
    {
      name: 'One Arm Dumbbell Lateral Raise',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Push',
      restTime: '0:1:0',
    },
    {
      name: 'Single Arm Cable Tri-Pushdown',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Push',
      restTime: '0:1:0',
    },
    {
      name: 'Tricep Overhead Extension with Rope',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Push',
      restTime: '0:1:0',
    },
    {
      name: 'Palms-Down Barbell Wrist Curl',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Push',
      restTime: '0:1:0',
      technique: 'Super Sets',
    },
    {
      name: 'Palms-Up Barbell Wrist Curl',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Push',
      restTime: '0:1:0',
      technique: 'Super Sets',
    },
  ],

  Pull: [
    {
      name: 'Wide Grip Lat Pulldown',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Pull',
      restTime: '0:1:0',
    },
    {
      name: 'Wide Seated Row Male',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Pull',
      restTime: '0:1:0',
    },
    {
      name: 'T-Bar Row Wide Grip',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Pull',
      restTime: '0:1:0',
    },
    {
      name: 'Seated Cable Single Row',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Pull',
      restTime: '0:1:0',
    },
    {
      name: 'Dumbbell Shrug',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Pull',
      restTime: '0:1:0',
    },
    {
      name: 'Cable Rear Delt Fly',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Pull',
      restTime: '0:1:0',
      technique: 'Super Sets',
    },
    {
      name: 'Preacher Barbell Curl',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Pull',
      restTime: '0:1:0',
      notes: 'بالزوايلك',
    },
    {
      name: 'Single Arm Cable Bicep Curl',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Pull',
      restTime: '0:1:0',
    },
  ],

  Leg: [
    {
      name: 'Seated Leg Curl',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Leg',
      restTime: '0:1:0',
      notes: 'الضغط عليه جامد مع هيفس البتير الثنائي اثناء او في نهاية التاني عادي بس',
    },
    {
      name: 'Leg Extension',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Leg',
      restTime: '0:1:0',
    },
    {
      name: 'Squat Smith',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Leg',
      restTime: '0:1:0',
    },
    {
      name: 'Deadlift Technique',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Leg',
      restTime: '0:1:0',
    },
    {
      name: 'Seated Machine Calf Press',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Leg',
      restTime: '0:1:0',
    },
  ],

  Upper: [
    {
      name: 'Treadmill',
      defaultSets: 1,
      defaultReps: '10 min',
      category: 'Upper',
      notes: 'تسخين عشر دقائق قبل التمرين',
    },
    {
      name: 'Side Plank',
      defaultSets: 3,
      defaultReps: '12',
      category: 'Upper',
    },
    {
      name: 'Cable Crunch',
      defaultSets: 3,
      defaultReps: '8-12',
      category: 'Upper',
    },
    {
      name: 'Cable Crunch',
      defaultSets: 4,
      defaultReps: '12',
      category: 'Upper',
    },
    {
      name: 'Crunch',
      defaultSets: 2,
      defaultReps: '8-12',
      category: 'Upper',
      restTime: '0:1:0',
      technique: 'Super Sets',
    },
  ],
};

export const getExercisesByDay = (dayType: DayType): ExerciseTemplate[] => {
  return EXERCISES[dayType] || [];
};
