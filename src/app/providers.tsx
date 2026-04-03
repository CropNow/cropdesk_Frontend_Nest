import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { PurchaseProvider } from '@/context/PurchaseContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <PurchaseProvider>{children}</PurchaseProvider>
    </AuthProvider>
  );
};
