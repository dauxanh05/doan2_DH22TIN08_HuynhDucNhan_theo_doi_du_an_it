import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWorkspaceStore } from '@/stores/workspace.store';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  provider: 'LOCAL' | 'GOOGLE';
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),

      setAccessToken: (token) => set({ accessToken: token }),

      logout: () => {
        useWorkspaceStore.getState().clearWorkspaces();
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        // accessToken NOT persisted — stays in memory only (security)
        // After reload: user restored from localStorage, token refreshed via API
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration: mark hydrated, set isAuthenticated from user
        if (state) {
          state.isHydrated = true;
          state.isAuthenticated = state.user !== null;
          // accessToken will be null after reload — api.ts interceptor handles refresh
        }
      },
    },
  ),
);
