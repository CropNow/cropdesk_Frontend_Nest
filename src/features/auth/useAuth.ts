import { useContext } from 'react';
import { AuthContext } from './auth.context';
import type { AuthContextValue } from './AuthProvider';

/**
 * Infer the value type from AuthContext without redefining it.
 * This avoids duplicating types during migration.
 */

/**
 * Access authentication context.
 *
 * @returns AuthContext value
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
