import { useContext } from 'react';
import {
  PurchaseContext,
  ProductType,
  PurchaseContextValue,
} from '@/context/PurchaseContext';

export function useAccess(): PurchaseContextValue;
export function useAccess(product: ProductType): boolean;
export function useAccess(
  product?: ProductType
): boolean | PurchaseContextValue {
  const context = useContext(PurchaseContext);

  if (context === undefined) {
    throw new Error('useAccess must be used within a PurchaseProvider');
  }

  // If a specific product is provided, return just the boolean
  if (product !== undefined) {
    return context.hasAccess(product);
  }

  // Otherwise return the full context object
  return context;
}
