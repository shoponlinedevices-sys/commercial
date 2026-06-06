'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeColors = {
  layoutColor: string;
  darkMode: boolean;
};

type ThemeContextType = {
  colors: ThemeColors;
  setLayoutColor: (color: string) => void;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_COLORS: ThemeColors = {
  layoutColor: '#ffffff',
  darkMode: false,
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
    
    // Apply dark mode to document
    if (colors.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colors]);

  const setLayoutColor = (color: string) => {
    setColors(prev => ({ ...prev, layoutColor: color }));
  };

  const toggleDarkMode = () => {
    setColors(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <ThemeContext.Provider value={{ colors, setLayoutColor, toggleDarkMode }}>
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
