// components/layout/Navbar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, LogOut, User, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg md:text-xl font-bold hover:text-blue-200 transition"
          >
            <Dumbbell size={24} className="md:w-7 md:h-7" />
            <span className="hidden xs:inline">Workout Tracker</span>
            <span className="xs:hidden">Workout</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <>
              <div className="hidden md:flex items-center gap-6">
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-blue-800 rounded-lg transition"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-blue-900 border-t border-blue-700 shadow-lg z-50">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {/* User Info */}
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-800 rounded-lg mb-3">
                <User size={20} />
                <span className="font-semibold">{user.username}</span>
              </div>

              {/* Navigation Links */}
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="block px-4 py-3 hover:bg-blue-800 rounded-lg transition"
              >
                Dashboard
              </Link>
              <Link
                href="/workout/new"
                onClick={closeMobileMenu}
                className="block px-4 py-3 hover:bg-blue-800 rounded-lg transition"
              >
                New Workout
              </Link>
              <Link
                href="/archive"
                onClick={closeMobileMenu}
                className="block px-4 py-3 hover:bg-blue-800 rounded-lg transition"
              >
                Archive
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-300 hover:bg-blue-800 rounded-lg transition mt-2"
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
