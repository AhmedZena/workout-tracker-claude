# Workout Tracker Web Application

A comprehensive workout tracking web application built with Next.js 16, TypeScript, and Tailwind CSS. Track your fitness journey with push/pull/leg/upper split workouts.

## Features

- User authentication (register/login/logout)
- Create and track workouts by day type (Push/Pull/Leg/Upper)
- Pre-defined exercise database with Arabic notes
- Track sets, reps, and weights for each exercise
- Workout archive with filtering by day type
- Detailed workout statistics and analytics
- All data stored in browser Local Storage
- Fully responsive design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser Local Storage
- **State Management**: React Context API
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd workout-tracker-claude
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication page
│   ├── dashboard/         # Main dashboard
│   ├── workout/           # Workout pages
│   │   ├── new/          # Create new workout
│   │   └── [id]/         # View workout details
│   └── archive/          # Workout history
├── components/            # React components
│   ├── layout/           # Layout components (Navbar)
│   ├── auth/             # Auth components
│   ├── workout/          # Workout components
│   └── archive/          # Archive components
├── contexts/             # React Context providers
├── lib/                  # Utility libraries
│   ├── exercises.ts     # Exercise database
│   ├── storage.ts       # Local Storage utilities
│   └── auth.ts          # Authentication helpers
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## Usage

### 1. Register/Login
- Create a new account or login with existing credentials
- Passwords are hashed before storage

### 2. Dashboard
- View workout statistics
- See recent workouts
- Quick access to create new workouts

### 3. Create Workout
- Select workout day type (Push/Pull/Leg/Upper)
- Choose exercises from pre-defined list
- Enter sets, reps, and weights
- Add optional notes

### 4. View Archive
- See all past workouts
- Filter by day type
- View detailed statistics

### 5. Workout Details
- View complete workout information
- See exercise volume calculations
- Delete workouts

## Exercise Categories

### Push Day
- Cable Lateral Raises
- One Arm Dumbbell Lateral Raise
- Single Arm Cable Tri-Pushdown
- Tricep Overhead Extension with Rope
- Palms-Down/Up Barbell Wrist Curl (Super Sets)

### Pull Day
- Wide Grip Lat Pulldown
- Wide Seated Row
- T-Bar Row Wide Grip
- Seated Cable Single Row
- Dumbbell Shrug
- Cable Rear Delt Fly
- Preacher Barbell Curl
- Single Arm Cable Bicep Curl

### Leg Day
- Seated Leg Curl
- Leg Extension
- Squat Smith
- Deadlift
- Seated Machine Calf Press

### Upper Day
- Treadmill (warmup)
- Side Plank
- Cable Crunch
- Crunch

## Data Storage

All data is stored in browser Local Storage:
- User accounts (hashed passwords)
- Workout history
- Exercise data

**Note**: Data is stored locally in your browser. Clearing browser data will delete all workouts.

## Future Enhancements

- Backend integration for cross-device sync
- Workout templates
- Progress photos
- Exercise form videos
- Rest timer
- Personal records tracking
- Export/import data
- Dark mode

## License

MIT

## Author

Built with Claude Code
