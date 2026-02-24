'use client';

// src/components/layout/Topbar.tsx

import { signOut, useSession } from 'next-auth/react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Tooltip,
} from '@mui/material';
import { Logout } from '@mui/icons-material';

interface TopbarProps {
  drawerWidth: number;
}

export default function Topbar({ drawerWidth }: TopbarProps) {
  const { data: session } = useSession();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600} sx={{ ml: { xs: 6, sm: 0 } }}>
          {session?.user?.firstName
            ? `Welcome, ${session.user.firstName}`
            : 'Dashboard'}
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={session?.user?.image ?? undefined}
            alt={session?.user?.name ?? 'User'}
            sx={{ width: 36, height: 36 }}
          />
          <Tooltip title="Sign out">
            <Button
              startIcon={<Logout />}
              onClick={() => signOut({ callbackUrl: '/login' })}
              color="inherit"
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Sign Out
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
