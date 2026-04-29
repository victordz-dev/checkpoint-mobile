import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@taskflow:theme';

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
  toggleTheme: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    loadStoredTheme();
  }, []);

  async function loadStoredTheme() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        setMode(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  }

  async function toggleTheme() {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
      setMode(next);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  }

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
}