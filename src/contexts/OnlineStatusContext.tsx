import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useToast } from './ToastContext';

interface OnlineStatusContextType {
  isOnline: boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({ isOnline: true });

export function OnlineStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { addToast } = useToast();

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    addToast({ message: '✅ Back online! Syncing your farm data...', type: 'success' });
  }, [addToast]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    addToast({ message: '⚠️ You are offline. Showing cached data.', type: 'error' });
  }, [addToast]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return (
    <OnlineStatusContext.Provider value={{ isOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatus(): boolean {
  return useContext(OnlineStatusContext).isOnline;
}
