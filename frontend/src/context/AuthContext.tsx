import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';

interface User {
  id: number;
  nama_lengkap: string;
  email: string;
  role: string;
  foto_profil: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { nama_lengkap: string; email: string; password: string; pass_confirm: string }) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    // Try to restore from localStorage first for fast render
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    // Then verify with server
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        return { success: true };
      }
      return { success: false, error: res.data.error || 'Login gagal' };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Login gagal' };
    }
  };

  const register = async (data: { nama_lengkap: string; email: string; password: string; pass_confirm: string }) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, error: res.data.error || 'Registrasi gagal' };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Registrasi gagal' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
