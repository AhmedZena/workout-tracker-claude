// components/layout/PWAInstallPrompt.tsx

'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissed state to not show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto transform transition-all animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition"
          aria-label="Dismiss"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center">
            <Download size={24} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Install Workout Tracker
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Install the app for quick access and offline use. Works great on your home screen!
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
              >
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
