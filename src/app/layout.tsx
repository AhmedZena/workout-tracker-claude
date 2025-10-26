// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Workout Tracker',
  description: 'Track your workouts and fitness progress',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Workout Tracker',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <PWAInstallPrompt />
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
