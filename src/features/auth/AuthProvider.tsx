import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue } from './auth.context';
import { getMe } from './auth.api';
import type { User } from './auth.types';

// AuthContextValue interface moved to auth.context.ts to avoid circular types

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

        // RELAXED: Only logout if explicit 401 Unauthorized or explicitly no token.
        // If it's a network error (e.g. backend down) but we have localStorage data, keep the session alive.
        if (
          error.response?.status === 401 ||
          error.message === 'No access token found'
        ) {
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          // NOTE: We deliberately do NOT remove 'registeredUser' here.
          // That local data is our "offline profile source" and should persist until manually cleared or overwritten by a better profile.
        } else {
          // Optional: Set a flag for "Offline Mode" or just warn.
          // We keep the existing 'user' state (from localStorage) intact.
          console.warn('Backend unavailable, using cached session.');
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
