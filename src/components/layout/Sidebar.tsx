'use client';

// src/components/layout/Sidebar.tsx

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  Menu,
  AdminPanelSettings,
} from '@mui/icons-material';

interface SidebarProps {
  drawerWidth: number;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <Dashboard /> },
  { label: 'Users', href: '/dashboard/users', icon: <People /> },
  { label: 'Products', href: '/dashboard/products', icon: <Inventory /> },
];

export default function Sidebar({ drawerWidth }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawerContent = (
    <Box sx={{ height: '100%', background: '#1a1a2e', color: 'white' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AdminPanelSettings sx={{ color: '#e94560', fontSize: 32 }} />
        <Typography variant="h6" fontWeight={700} color="white">
          AdminHub
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1 }} />

      <List sx={{ px: 1 }}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                  bgcolor: isActive ? 'rgba(233,69,96,0.2)' : 'transparent',
                  borderLeft: isActive ? '3px solid #e94560' : '3px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1300, color: 'white', bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#16213e' } }}
        >
          <Menu />
        </IconButton>
      )}

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            border: 'none',
            boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
