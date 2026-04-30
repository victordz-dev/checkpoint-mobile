import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, UserTreatment } from '../types/user';
import { useTheme } from './ThemeContext';

const STORAGE_KEY = '@taskflow:user';

const USERS: User[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'user',  password: '123', role: 'user',  name: 'Usuário Comum' },
];

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateTreatment: (treatment: UserTreatment) => Promise<void>;
  updateTheme: (mode: 'dark' | 'light') => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setThemeMode } = useTheme();

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedUser: User = JSON.parse(stored);
        setUser(parsedUser);
        if (parsedUser.themePreference) {
          setThemeMode(parsedUser.themePreference);
        } else {
          setThemeMode('dark');
        }
      } else {
        setThemeMode('dark');
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string, password: string): Promise<boolean> {
    const found = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) return false;

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      setUser(found);
      if (found.themePreference) {
        setThemeMode(found.themePreference);
      } else {
        setThemeMode('dark');
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setThemeMode('dark');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  async function updateTreatment(treatment: UserTreatment) {
    if (!user) return;
    const updated = { ...user, treatment };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
    } catch (error) {
      console.error('Erro ao atualizar tratamento:', error);
    }
  }

  async function updateTheme(mode: 'dark' | 'light') {
    if (!user) return;
    const updated = { ...user, themePreference: mode };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
      setThemeMode(mode);
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateTreatment, updateTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}