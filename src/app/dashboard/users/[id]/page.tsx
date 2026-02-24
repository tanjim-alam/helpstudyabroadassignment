'use client';

// src/app/dashboard/users/[id]/page.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Phone,
  Cake,
  Business,
  Home,
  AccountBalance,
  School,
} from '@mui/icons-material';
import { User } from '@/types';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <Box display="flex" alignItems="flex-start" gap={1.5} py={1}>
      <Box sx={{ color: 'text.secondary', mt: 0.2 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`https://dummyjson.com/users/${params.id}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [params.id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box>
        <Button component={Link} href="/dashboard/users" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
          Back to Users
        </Button>
        <Alert severity="error">{error || 'User not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button component={Link} href="/dashboard/users" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Back to Users
      </Button>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h5" fontWeight={700}>
                {user.firstName} {user.lastName}
              </Typography>
              {user.maidenName && (
                <Typography variant="body2" color="text.secondary">
                  née {user.maidenName}
                </Typography>
              )}
              <Box display="flex" gap={1} justifyContent="center" mt={1} flexWrap="wrap">
                <Chip label={user.gender} size="small" color="primary" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                <Chip label={user.role} size="small" color="secondary" variant="outlined" />
                <Chip label={`Age ${user.age}`} size="small" variant="outlined" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                @{user.username}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Contact */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact
                  </Typography>
                  <InfoRow icon={<Email fontSize="small" />} label="Email" value={user.email} />
                  <InfoRow icon={<Phone fontSize="small" />} label="Phone" value={user.phone} />
                  <InfoRow icon={<Cake fontSize="small" />} label="Birth Date" value={user.birthDate} />
                </CardContent>
              </Card>
            </Grid>

            {/* Physical */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Physical
                  </Typography>
                  <InfoRow icon={<span>🩸</span>} label="Blood Group" value={user.bloodGroup} />
                  <InfoRow icon={<span>👁️</span>} label="Eye Color" value={user.eyeColor} />
                  <InfoRow icon={<span>💇</span>} label="Hair" value={`${user.hair.color} ${user.hair.type}`} />
                  <InfoRow icon={<span>📏</span>} label="Height / Weight" value={`${user.height}cm / ${user.weight}kg`} />
                </CardContent>
              </Card>
            </Grid>

            {/* Company */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Company
                  </Typography>
                  <InfoRow icon={<Business fontSize="small" />} label="Company" value={user.company.name} />
                  <InfoRow icon={<span>💼</span>} label="Title" value={user.company.title} />
                  <InfoRow icon={<span>🏢</span>} label="Department" value={user.company.department} />
                </CardContent>
              </Card>
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <InfoRow icon={<Home fontSize="small" />} label="Street" value={user.address.address} />
                  <InfoRow icon={<span>🏙️</span>} label="City" value={`${user.address.city}, ${user.address.state}`} />
                  <InfoRow icon={<span>🌍</span>} label="Country" value={user.address.country} />
                  <InfoRow icon={<span>📮</span>} label="Postal Code" value={user.address.postalCode} />
                </CardContent>
              </Card>
            </Grid>

            {/* Education */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Education & Finance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <InfoRow icon={<School fontSize="small" />} label="University" value={user.university} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InfoRow icon={<AccountBalance fontSize="small" />} label="Bank Card" value={`${user.bank.cardType} ****${user.bank.cardNumber.slice(-4)}`} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InfoRow icon={<span>💱</span>} label="Currency" value={user.bank.currency} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
