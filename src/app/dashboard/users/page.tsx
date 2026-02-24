'use client';

// src/app/dashboard/users/page.tsx

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  TablePagination,
  InputAdornment,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import { Search, Male, Female } from '@mui/icons-material';
import { useUsersStore } from '@/store/usersStore';
import { User } from '@/types';

const ROWS_PER_PAGE = 10;

// Memoized table row to reduce unnecessary re-renders
const UserRow = memo(function UserRow({ user }: { user: User }) {
  return (
    <TableRow
      hover
      component={Link}
      href={`/dashboard/users/${user.id}`}
      sx={{ cursor: 'pointer', textDecoration: 'none', '&:last-child td': { border: 0 } }}
    >
      <TableCell>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar src={user.image} alt={user.firstName} sx={{ width: 36, height: 36 }} />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email}</TableCell>
      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
        <Chip
          icon={user.gender === 'male' ? <Male /> : <Female />}
          label={user.gender}
          size="small"
          color={user.gender === 'male' ? 'primary' : 'secondary'}
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell>
      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.phone}</TableCell>
      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
        <Typography variant="body2">{user.company.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {user.company.title}
        </Typography>
      </TableCell>
    </TableRow>
  );
});

export default function UsersPage() {
  const { users, total, loading, error, fetchUsers, searchUsers, clearError } = useUsersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(0); // Reset to first page on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data when page or search changes
  useEffect(() => {
    const skip = page * ROWS_PER_PAGE;
    if (debouncedQuery.trim()) {
      searchUsers(debouncedQuery, ROWS_PER_PAGE, skip);
    } else {
      fetchUsers(ROWS_PER_PAGE, skip);
    }
  }, [debouncedQuery, page, fetchUsers, searchUsers]);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Users
      </Typography>

      {/* Search bar */}
      <Box mb={3}>
        <TextField
          placeholder="Search users by name, email..."
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          sx={{ maxWidth: 480 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Gender</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Phone</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Company</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Skeleton variant="circular" width={36} height={36} />
                          <Box>
                            <Skeleton width={120} height={16} />
                            <Skeleton width={80} height={12} />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Skeleton width={160} />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Skeleton width={60} />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                        <Skeleton width={100} />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                        <Skeleton width={120} />
                      </TableCell>
                    </TableRow>
                  ))
                : users.map((user) => <UserRow key={user.id} user={user} />)}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={ROWS_PER_PAGE}
          rowsPerPageOptions={[ROWS_PER_PAGE]}
        />
      </Paper>
    </Box>
  );
}
