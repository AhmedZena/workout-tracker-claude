// app/offline/page.tsx

'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Check initial status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      router.back();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <WifiOff size={80} className="mx-auto text-gray-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {isOnline ? 'Back Online!' : "You're Offline"}
        </h1>

        <p className="text-gray-600 mb-6">
          {isOnline
            ? "Great! You're back online. You can continue using the app."
            : 'No internet connection. The app will work offline with your saved data.'}
        </p>

        {isOnline && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✓ Connection restored
            </p>
          </div>
        )}

        <button
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <RefreshCw size={20} />
          {isOnline ? 'Continue' : 'Try Again'}
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Offline Features</h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>✓ View your workout history</li>
            <li>✓ Create new workouts</li>
            <li>✓ Edit existing workouts</li>
            <li>✓ All data saved locally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
