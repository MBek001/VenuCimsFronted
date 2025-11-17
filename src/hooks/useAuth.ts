import { useAuthStore } from '../store/authStore';

/**
 * Custom hook to access authentication state and actions
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    loadUser,
    setUser,
    clearError,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    loadUser,
    setUser,
    clearError,
    isSuperuser: user?.is_superuser || false,
  };
};
