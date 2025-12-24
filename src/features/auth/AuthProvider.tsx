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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getMe()
      .then((user) => {
        if (user?.id) {
          setUser(user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
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
