// src/app/layout.tsx

import type { Metadata } from 'next';
import ThemeRegistry from '@/lib/ThemeRegistry';
import AuthSessionProvider from '@/lib/SessionProvider';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Next.js Admin Dashboard with MUI and Zustand',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
