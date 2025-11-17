import { create } from 'zustand';
import { STORAGE_KEYS } from '../utils/constants';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;

  if (storedTheme) {
    return storedTheme;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const useThemeStore = create<ThemeState>((set) => {
  // Initialize theme
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  return {
    theme: initialTheme,

    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        return { theme: newTheme };
      }),

    setTheme: (theme: Theme) => {
      applyTheme(theme);
      set({ theme });
    },
  };
});
