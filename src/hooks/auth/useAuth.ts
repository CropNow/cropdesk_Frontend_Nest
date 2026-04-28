/**
 * Auth hook - manages authentication state
 * Provides login, logout, register, and token refresh
 */

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
