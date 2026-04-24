import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PharmaCare — Pharmacy Management System',
  description:
    'PharmaCare helps pharmacists manage medicine inventory, process counter sales, track batch expiries, and monitor daily revenue from one dashboard.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // No theme script needed - using light theme only
            `,
          }}
        />
      </head>
      <body className="h-full bg-slate-50 text-slate-900">
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: { fontFamily: 'DM Sans, sans-serif' },
          }}
        />

        <Script
          type="module"
          src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fpharmacare9544back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.17"
          strategy="lazyOnload"
        />
        <Script
          type="module"
          src="https://static.rocket.new/rocket-shot.js?v=0.0.2"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}