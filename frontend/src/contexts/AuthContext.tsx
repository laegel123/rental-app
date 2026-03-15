import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  username: string | null;
  userId: number | null;
  token: string | null;
  login: (token: string, email: string, userId: number, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedUserId = localStorage.getItem('userId');
    const savedUsername = localStorage.getItem('username');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      if (savedUserId) setUserId(parseInt(savedUserId));
      if (savedUsername) setUsername(savedUsername);
    }
  }, []);

  const login = (newToken: string, email: string, newUserId: number, newUsername: string) => {
    setToken(newToken);
    setUser(email);
    setUserId(newUserId);
    setUsername(newUsername);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', email);
    localStorage.setItem('userId', newUserId.toString());
    localStorage.setItem('username', newUsername);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserId(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ user, username, userId, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
