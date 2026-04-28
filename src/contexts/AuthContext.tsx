import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../api/auth.api';
import { User, RegisterRequest } from '../types/auth.types';

/* ─── Types ─── */
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = 'cropdesk_auth';
const TOKEN_KEY = 'authToken';

/* ─── Context ─── */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ─── Provider ─── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        const token = localStorage.getItem(TOKEN_KEY);
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to hydrate auth state:', error);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 [Auth] Attempting login for:', email);
    try {
      const response = await authAPI.login({ email, password });
      console.log('✅ [Auth] Login API Success:', response.data);
      
      // Extract from backend structure: { accessToken, data: { user } }
      const { accessToken, data: responseData } = response.data;
      const user = responseData.user;
      
      if (!accessToken || !user) {
        console.error('❌ [Auth] Missing user or token in response structure:', response.data);
        return false;
      }

      setUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, accessToken);
      
      return true;
    } catch (error: any) {
      console.error('❌ [Auth] Login Failed:', error.response?.data || error.message);
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    console.log('📝 [Auth] Attempting registration for:', data.email);
    try {
      const response = await authAPI.register(data);
      console.log('✅ [Auth] Registration API Success:', response.data);
      return true;
    } catch (error: any) {
      console.error('❌ [Auth] Registration Failed:', error.response?.data || error.message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    // Optional: call backend logout
    authAPI.logout().catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading, user, login, register, logout }}>
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
