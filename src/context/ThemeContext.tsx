import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';



type ThemeMode = 'dark' | 'light';

interface ThemeColors {
  mode: ThemeMode;
  background: string;
  card: string;
  text: string;
  muted: string;
  primary: string;
  border: string;
  error: string;
}

const darkTheme: ThemeColors = {
  mode: 'dark',
  background: '#0f172a',
  card: '#1e293b',
  text: '#f8fafc',
  muted: '#64748b',
  primary: '#6366f1',
  border: '#334155',
  error: '#ef4444',
};

const lightTheme: ThemeColors = {
  mode: 'light',
  background: '#f1f5f9',
  card: '#ffffff',
  text: '#0f172a',
  muted: '#64748b',
  primary: '#6366f1',
  border: '#cbd5e1',
  error: '#ef4444',
};

interface ThemeContextData {
  theme: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  function setThemeMode(newMode: ThemeMode) {
    setMode(newMode);
  }

  function toggleTheme() {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
}