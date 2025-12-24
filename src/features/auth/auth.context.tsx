import { createContext } from 'react';
import type { AuthContextValue } from './AuthProvider';

/**
 * Authentication context value.
 *
 * Currently unknown during migration, so we use `unknown`
 * instead of `any` to keep strict type safety.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);
