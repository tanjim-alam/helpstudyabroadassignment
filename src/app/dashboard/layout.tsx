'use client';

// src/app/dashboard/layout.tsx

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

const DRAWER_WIDTH = 240;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!session) return null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar drawerWidth={DRAWER_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${DRAWER_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Topbar drawerWidth={DRAWER_WIDTH} />
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, mt: '64px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
