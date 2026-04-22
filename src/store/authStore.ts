/**
 * Zustand store for authentication state
 * Optional: Use if you want centralized auth state beyond Context API
 */

// import { create } from 'zustand';
// import { User } from '../types/auth.types';

// interface AuthStore {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   setUser: (user: User | null) => void;
//   setToken: (token: string | null) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthStore>((set) => ({
//   user: null,
//   token: localStorage.getItem('authToken'),
//   isAuthenticated: !!localStorage.getItem('authToken'),
//   setUser: (user) => set({ user }),
//   setToken: (token) => {
//     if (token) {
//       localStorage.setItem('authToken', token);
//     } else {
//       localStorage.removeItem('authToken');
//     }
//     set({ token, isAuthenticated: !!token });
//   },
//   logout: () => {
//     localStorage.removeItem('authToken');
//     set({ user: null, token: null, isAuthenticated: false });
//   },
// }));
