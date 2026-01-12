import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './auth.context';
import { getMe } from './auth.api';
import type { User } from './auth.types';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    getMe()
      .then((user) => {
        if (user?.id) {
          setUser(user);
        } else {
          setUser(null);
          // Only clear if we were expecting a user but got none
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      })
      .catch((error: any) => {
        console.error('Auth verification failed:', error);
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser } as AuthContextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};
