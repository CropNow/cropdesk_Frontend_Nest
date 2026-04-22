import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

/* ─── Types ─── */
export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

/* ─── Hardcoded credentials (demo only) ─── */
const VALID_EMAIL = 'test@gmail.com';
const VALID_PASSWORD = 'test12345';
const DEMO_USER: AuthUser = { email: VALID_EMAIL, name: 'Rohit Kumar', role: 'Farm Admin' };
const STORAGE_KEY = 'cropdesk_auth';

/* ─── Context ─── */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ─── Provider ─── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { user: AuthUser };
        if (parsed.user) setUser(parsed.user);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setUser(DEMO_USER);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: DEMO_USER }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ─── */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
