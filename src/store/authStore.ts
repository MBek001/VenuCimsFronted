import { create } from 'zustand';
import { authApi } from '../api/auth';
import { AuthUser, LoginCredentials } from '../types/auth.types';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const tokens = await authApi.login(credentials);

      // Store tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);

      // Get user data
      const user = await authApi.getCurrentUser();
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      // Try to get fresh user data
      const user = await authApi.getCurrentUser();
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // If fetching user fails, try using stored user data
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // If parsing fails, logout
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }
  },

  setUser: (user: AuthUser | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));
