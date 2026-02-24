// src/store/usersStore.ts
// Caching strategy: Store fetched pages in a Map keyed by "query:skip:limit".
// This prevents redundant network calls when navigating back to previously visited pages.
// Cache is held in-memory for the session duration — cleared on page refresh.
// This is a simple read-through cache appropriate for relatively static reference data.

import { create } from 'zustand';
import { User, UsersResponse } from '@/types';

interface UsersState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  // Cache: key = `${query}:${skip}:${limit}`
  cache: Map<string, UsersResponse>;

  fetchUsers: (limit: number, skip: number) => Promise<void>;
  searchUsers: (query: string, limit: number, skip: number) => Promise<void>;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  cache: new Map(),

  fetchUsers: async (limit, skip) => {
    const cacheKey = `:${skip}:${limit}`;
    const cached = get().cache.get(cacheKey);

    if (cached) {
      set({ users: cached.users, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
      );
      if (!res.ok) throw new Error('Failed to fetch users');
      const data: UsersResponse = await res.json();

      const newCache = new Map(get().cache);
      newCache.set(cacheKey, data);

      set({ users: data.users, total: data.total, loading: false, cache: newCache });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  searchUsers: async (query, limit, skip) => {
    const cacheKey = `${query}:${skip}:${limit}`;
    const cached = get().cache.get(cacheKey);

    if (cached) {
      set({ users: cached.users, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
      );
      if (!res.ok) throw new Error('Failed to search users');
      const data: UsersResponse = await res.json();

      const newCache = new Map(get().cache);
      newCache.set(cacheKey, data);

      set({ users: data.users, total: data.total, loading: false, cache: newCache });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
