// components/layout/Navbar.tsx

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
          <Dumbbell size={28} />
          <span>Workout Tracker</span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
            <Link href="/workout/new" className="hover:text-blue-200 transition">
              New Workout
            </Link>
            <Link href="/archive" className="hover:text-blue-200 transition">
              Archive
            </Link>

            <div className="flex items-center gap-3 border-l border-blue-700 pl-6">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span>{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-red-300 hover:text-red-100 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
