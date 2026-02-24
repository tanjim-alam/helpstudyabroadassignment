'use client';

// src/app/dashboard/products/[id]/page.tsx

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
  Button,
  CircularProgress,
  Alert,
  Rating,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  ChevronLeft,
  ChevronRight,
  Star,
  Inventory,
  LocalShipping,
  Assignment,
} from '@mui/icons-material';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://dummyjson.com/products/${params.id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box>
        <Button component={Link} href="/dashboard/products" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
          Back to Products
        </Button>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Box>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Box>
      <Button component={Link} href="/dashboard/products" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Back to Products
      </Button>

      <Grid container spacing={3}>
        {/* Image Carousel */}
        <Grid item xs={12} md={5}>
          <Card>
            <Box sx={{ position: 'relative', bgcolor: '#f9f9f9' }}>
              <Box sx={{ position: 'relative', height: 380 }}>
                <Image
                  src={product.images[activeImage]}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain', padding: '16px' }}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  priority
                />
              </Box>

              {product.images.length > 1 && (
                <>
                  <IconButton
                    onClick={() => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'white', boxShadow: 2 }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={() => setActiveImage((prev) => (prev + 1) % product.images.length)}
                    sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'white', boxShadow: 2 }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <Box display="flex" gap={1} p={1.5} flexWrap="wrap" justifyContent="center">
                {product.images.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    sx={{
                      position: 'relative',
                      width: 56,
                      height: 56,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: activeImage === idx ? '2px solid' : '2px solid transparent',
                      borderColor: activeImage === idx ? 'primary.main' : 'transparent',
                      cursor: 'pointer',
                      bgcolor: '#f5f5f5',
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="56px"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                <Chip label={product.category} size="small" color="primary" sx={{ textTransform: 'capitalize' }} />
                {product.brand && <Chip label={product.brand} size="small" variant="outlined" />}
                <Chip
                  label={product.availabilityStatus}
                  size="small"
                  color={product.availabilityStatus === 'In Stock' ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Box>

              <Typography variant="h5" fontWeight={700} gutterBottom>
                {product.title}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Rating value={product.rating} readOnly precision={0.1} size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({product.rating}) · {product.reviews.length} reviews
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="h4" color="primary" fontWeight={700}>
                  ${discountedPrice.toFixed(2)}
                </Typography>
                {product.discountPercentage > 0 && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Chip label={`${Math.round(product.discountPercentage)}% OFF`} size="small" color="error" />
                  </Box>
                )}
              </Box>

              <Typography variant="body1" color="text.secondary" mb={3}>
                {product.description}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Inventory color="action" />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Stock
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {product.stock}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <LocalShipping color="action" />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                      {product.shippingInformation}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Assignment color="action" />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Warranty
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                      {product.warrantyInformation}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <span style={{ fontSize: '24px' }}>🔄</span>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Returns
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                      {product.returnPolicy}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Specs */}
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Specifications
              </Typography>
              <Grid container spacing={1}>
                {[
                  { label: 'SKU', value: product.sku },
                  { label: 'Weight', value: `${product.weight}g` },
                  { label: 'Dimensions', value: `${product.dimensions.width}×${product.dimensions.height}×${product.dimensions.depth}mm` },
                  { label: 'Min Order', value: `${product.minimumOrderQuantity} units` },
                ].map((spec) => (
                  <Grid item xs={6} key={spec.label}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {spec.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {spec.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {product.tags.length > 0 && (
                <Box mt={2} display="flex" gap={0.5} flexWrap="wrap">
                  {product.tags.map((tag) => (
                    <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Reviews
                </Typography>
                <Grid container spacing={2}>
                  {product.reviews.map((review, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Typography variant="subtitle2" fontWeight={600}>
                            {review.reviewerName}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                          {review.comment}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                          {new Date(review.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
