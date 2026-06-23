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
      } catch (error) {
        console.error("Failed to hydrate auth state:", error);
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
      console.log("🔐 [Auth] Attempting login for:", email);
      try {
        const response = await authAPI.login({ email, password });
        console.log("✅ [Auth] Login API Success:", response.data);

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
          console.error(
            "❌ [Auth] Missing user or token in response structure:",
            response.data,
          );
          return { success: false };
        }

        setUser(user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, accessToken);

        return { success: true };
      } catch (error: any) {
        console.error(
          "❌ [Auth] Login Failed:",
          error.response?.data || error.message,
        );
        return { success: false };
      }
    },
    [],
  );

  const verify2FALogin = useCallback(
    async (mfaToken: string, token: string): Promise<boolean> => {
      console.log("🔐 [Auth] Verifying 2FA login token");
      try {
        const response = await authAPI.verify2FALogin(mfaToken, token);
        console.log("✅ [Auth] 2FA Login Verification Success:", response.data);

        const { accessToken, data: responseData } = response.data;
        const user = responseData?.user;

        if (!accessToken || !user) {
          console.error(
            "❌ [Auth] Missing user or token in 2FA verification response:",
            response.data,
          );
          return false;
        }

        setUser(user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, accessToken);

        return true;
      } catch (error: any) {
        console.error(
          "❌ [Auth] 2FA Login Verification Failed:",
          error.response?.data || error.message,
        );
        return false;
      }
    },
    [],
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      console.log("📝 [Auth] Attempting registration for:", data.email);
      try {
        const response = await authAPI.register(data);
        console.log("✅ [Auth] Registration API Success:", response.data);
        return true;
      } catch (error: any) {
        console.error(
          "❌ [Auth] Registration Failed:",
          error.response?.data || error.message,
        );
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    // Optional: call backend logout
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
