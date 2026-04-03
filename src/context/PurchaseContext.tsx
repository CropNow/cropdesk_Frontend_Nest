import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/features/auth/useAuth';

export type ProductType = 'nest' | 'seed';

export interface PurchaseContextValue {
  purchases: ProductType[];
  activeProduct: ProductType;
  authLoading: boolean;
  setActiveProduct: (product: ProductType) => void;
  hasAccess: (product: ProductType) => boolean;
}

export const PurchaseContext = createContext<PurchaseContextValue | undefined>(
  undefined
);

// Mock hardcoded data for purchases based on user email
const mockUsers = [
  { email: 'nest@user.com', purchases: ['nest', 'seed'] },
  { email: 'seed@user.com', purchases: ['nest', 'seed'] },
  { email: 'both@user.com', purchases: ['nest', 'seed'] },
];

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [purchases, setPurchases] = useState<ProductType[]>(['nest', 'seed']);
  const [activeProduct, setActiveProduct] = useState<ProductType>('nest');

  useEffect(() => {
    // Wait for auth to finish loading before making access decisions
    if (authLoading) return;

    console.log(`[PurchaseContext] evaluating user email: `, user?.email);
    if (user?.email) {
      const mockUser = mockUsers.find((u) => u.email === user.email);
      if (mockUser) {
        setPurchases(mockUser.purchases as ProductType[]);

        // Auto-select a valid product if the current one is not in their purchases
        if (
          !mockUser.purchases.includes(activeProduct) &&
          mockUser.purchases.length > 0
        ) {
          setActiveProduct(mockUser.purchases[0] as ProductType);
        }
      } else {
        // Restricted fallback for unknown users
        setPurchases(['nest', 'seed']);
        setActiveProduct('nest');
      }
    } else if (!authLoading) {
      // If auth finished loading and there's no user, no purchases
      setPurchases(['nest', 'seed']);
    }
  }, [user?.email, authLoading]);

  const hasAccess = (product: ProductType) => {
    console.log(
      `[PurchaseContext] hasAccess checked for ${product}. Current purchases state:`,
      purchases
    );
    return true; // Always return true to ensure both are viewable
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        activeProduct,
        authLoading,
        setActiveProduct,
        hasAccess,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
