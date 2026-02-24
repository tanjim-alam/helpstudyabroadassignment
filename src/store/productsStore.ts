// src/store/productsStore.ts
// Caching strategy: Same read-through cache keyed by query+category+skip+limit.
// Avoids redundant API calls when users paginate back or revisit filters.

import { create } from 'zustand';
import { Product, ProductsResponse, Category } from '@/types';

interface ProductsState {
  products: Product[];
  total: number;
  categories: Category[];
  loading: boolean;
  categoriesLoading: boolean;
  error: string | null;
  cache: Map<string, ProductsResponse>;

  fetchProducts: (limit: number, skip: number) => Promise<void>;
  searchProducts: (query: string, limit: number, skip: number) => Promise<void>;
  fetchByCategory: (category: string, limit: number, skip: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  categories: [],
  loading: false,
  categoriesLoading: false,
  error: null,
  cache: new Map(),

  fetchProducts: async (limit, skip) => {
    const cacheKey = `all:${skip}:${limit}`;
    const cached = get().cache.get(cacheKey);

    if (cached) {
      set({ products: cached.products, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
      );
      if (!res.ok) throw new Error('Failed to fetch products');
      const data: ProductsResponse = await res.json();

      const newCache = new Map(get().cache);
      newCache.set(cacheKey, data);

      set({ products: data.products, total: data.total, loading: false, cache: newCache });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  searchProducts: async (query, limit, skip) => {
    const cacheKey = `search:${query}:${skip}:${limit}`;
    const cached = get().cache.get(cacheKey);

    if (cached) {
      set({ products: cached.products, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
      );
      if (!res.ok) throw new Error('Failed to search products');
      const data: ProductsResponse = await res.json();

      const newCache = new Map(get().cache);
      newCache.set(cacheKey, data);

      set({ products: data.products, total: data.total, loading: false, cache: newCache });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchByCategory: async (category, limit, skip) => {
    const cacheKey = `cat:${category}:${skip}:${limit}`;
    const cached = get().cache.get(cacheKey);

    if (cached) {
      set({ products: cached.products, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`
      );
      if (!res.ok) throw new Error('Failed to fetch category products');
      const data: ProductsResponse = await res.json();

      const newCache = new Map(get().cache);
      newCache.set(cacheKey, data);

      set({ products: data.products, total: data.total, loading: false, cache: newCache });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchCategories: async () => {
    if (get().categories.length > 0) return; // already cached

    set({ categoriesLoading: true });
    try {
      const res = await fetch('https://dummyjson.com/products/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data: Category[] = await res.json();
      set({ categories: data, categoriesLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, categoriesLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
