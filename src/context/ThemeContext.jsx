import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored && ['clean-light', 'cyber-neon', 'sunset-glass', 'forest-calm', 'royal-midnight'].includes(stored)) {
        return stored;
      }
      return 'clean-light';
    } catch {
      return 'clean-light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    // Remove the old 'dark' class if it was somehow present
    root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => setThemeState(newTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
