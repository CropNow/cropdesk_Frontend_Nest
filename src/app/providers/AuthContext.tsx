import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { authAPI } from "@features/auth/api/auth.api";
import { User, RegisterRequest } from "@shared/types/auth.types";

/* ─── Types ─── */
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; mfaToken?: string }>;
  verify2FALogin: (mfaToken: string, token: string) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = "cropdesk_auth";
const TOKEN_KEY = "authToken";

/* ─── Context ─── */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await authAPI.login({ email, password });

        // Check if 2FA is required
        if (response.data?.requires2FA) {
          return {
            success: false,
            requires2FA: true,
            mfaToken: response.data.tempToken || response.data.mfaToken,
          };
        }

        // Extract from backend structure: { accessToken, data: { user } }
        const { accessToken, data: responseData } = response.data;
        const user = responseData?.user;

        if (!accessToken || !user) {
          return { success: false };
        }

        setUser(user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, accessToken);

        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [],
  );

  const verify2FALogin = useCallback(
    async (mfaToken: string, token: string): Promise<boolean> => {
      try {
        const response = await authAPI.verify2FALogin(mfaToken, token);

        const { accessToken, data: responseData } = response.data;
        const user = responseData?.user;

        if (!accessToken || !user) {
          return false;
        }

        setUser(user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, accessToken);

        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      try {
        await authAPI.register(data);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    authAPI.logout().catch(() => {});
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        login,
        verify2FALogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ─── */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
