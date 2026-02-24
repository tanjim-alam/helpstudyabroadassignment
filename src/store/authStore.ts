// src/store/authStore.ts
// Why Zustand?
// - Minimal boilerplate compared to Redux (no actions/reducers/dispatch)
// - Built-in async support without extra middleware (no redux-thunk needed)
// - Small bundle size (~1KB)
// - Simple, intuitive API that integrates well with Next.js App Router
// - Perfect for small-medium apps where Redux overhead is not justified

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
