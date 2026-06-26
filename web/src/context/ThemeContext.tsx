'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeColors = {
  darkMode: boolean;
};

type ThemeContextType = {
  colors: ThemeColors;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_COLORS: ThemeColors = {
  darkMode: true,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_COLORS);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedColors = localStorage.getItem('themeColors');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('themeColors', JSON.stringify(colors));
  }, [colors]);

  const toggleDarkMode = () => {
    setColors(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <ThemeContext.Provider value={{ colors, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
