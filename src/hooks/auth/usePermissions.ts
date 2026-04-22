/**
 * Permissions hook - checks user permissions and roles
 */

import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole('admin');
  const isFarmer = () => hasRole('farmer');
  const isTechnician = () => hasRole('technician');

  return {
    hasRole,
    isAdmin,
    isFarmer,
    isTechnician,
    user,
  };
};
