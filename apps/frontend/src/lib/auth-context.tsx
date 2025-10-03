'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5678/auth/login', { emailOrUsername, password });
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      router.push('/dashboard'); // Redirect to dashborad after login
    } catch (error) {
      throw new Error('Login failed: Invalid credentials');
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5678/auth/logout',
        { token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToken(null);
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
      setToken(null);
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};