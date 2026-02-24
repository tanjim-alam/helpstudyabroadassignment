'use client';

// src/app/dashboard/products/page.tsx

import { useEffect, useState, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useProductsStore } from '@/store/productsStore';
import { Product } from '@/types';

const ITEMS_PER_PAGE = 12;

// Memoized product card to prevent unnecessary re-renders
const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        href={`/dashboard/products/${product.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative', height: 180, bgcolor: '#f9f9f9' }}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            style={{ objectFit: 'contain', padding: '8px' }}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Chip label={product.category} size="small" sx={{ mb: 1, textTransform: 'capitalize' }} />
          <Typography variant="subtitle2" fontWeight={600} noWrap title={product.title}>
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
            ${product.price.toFixed(2)}
            {product.discountPercentage > 0 && (
              <Chip
                label={`-${Math.round(product.discountPercentage)}%`}
                size="small"
                color="error"
                sx={{ ml: 1, height: 18, fontSize: '0.65rem' }}
              />
            )}
          </Typography>
          <Rating value={product.rating} readOnly precision={0.5} size="small" />
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export default function ProductsPage() {
  const {
    products,
    total,
    categories,
    loading,
    fetchProducts,
    searchProducts,
    fetchByCategory,
    fetchCategories,
    error,
    clearError,
  } = useProductsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load categories once
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products when filters change
  useEffect(() => {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    if (debouncedQuery.trim()) {
      searchProducts(debouncedQuery, ITEMS_PER_PAGE, skip);
    } else if (selectedCategory) {
      fetchByCategory(selectedCategory, ITEMS_PER_PAGE, skip);
    } else {
      fetchProducts(ITEMS_PER_PAGE, skip);
    }
  }, [debouncedQuery, selectedCategory, page, fetchProducts, searchProducts, fetchByCategory]);

  const handleCategoryChange = useCallback((val: string) => {
    setSelectedCategory(val);
    setSearchQuery('');
    setPage(1);
  }, []);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Products
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 380 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Grid */}
      <Grid container spacing={2}>
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Card>
                  <Skeleton variant="rectangular" height={180} />
                  <CardContent>
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                    <Skeleton width="80%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
      </Grid>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}
