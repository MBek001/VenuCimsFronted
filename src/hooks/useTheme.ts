import { useThemeStore } from '../store/themeStore';

/**
 * Custom hook to access theme state and actions
 */
export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  };
};
