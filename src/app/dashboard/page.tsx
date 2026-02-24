'use client';

// src/app/dashboard/page.tsx

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { People, Inventory, Star, TrendingUp } from '@mui/icons-material';
import Link from 'next/link';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<{ users: number; products: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, productsRes] = await Promise.all([
          fetch('https://dummyjson.com/users?limit=1'),
          fetch('https://dummyjson.com/products?limit=1'),
        ]);
        const [usersData, productsData] = await Promise.all([
          usersRes.json(),
          productsRes.json(),
        ]);
        setStats({ users: usersData.total, products: productsData.total });
      } catch {
        setStats({ users: 0, products: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: stats ? String(stats.users) : '—',
      icon: <People />,
      color: '#1a1a2e',
      link: '/dashboard/users',
    },
    {
      title: 'Total Products',
      value: stats ? String(stats.products) : '—',
      icon: <Inventory />,
      color: '#e94560',
      link: '/dashboard/products',
    },
    {
      title: 'Avg Rating',
      value: '4.2',
      icon: <Star />,
      color: '#f39c12',
      link: '/dashboard/products',
    },
    {
      title: 'Active Sessions',
      value: '128',
      icon: <TrendingUp />,
      color: '#27ae60',
      link: '/dashboard',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Welcome back! Here&apos;s what&apos;s happening.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {statCards.map((card) => (
            <Grid item xs={12} sm={6} lg={3} key={card.title}>
              <Link href={card.link} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: card.color, width: 52, height: 52 }}>
                      {card.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {card.title}
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {card.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
