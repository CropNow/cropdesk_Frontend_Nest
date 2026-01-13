import { createContext } from 'react';
import type { User } from './auth.types';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

/**
 * Authentication context value.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);
