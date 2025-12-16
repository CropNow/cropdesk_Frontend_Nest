import { AuthProvider } from "@/features/auth/auth.store"

export const AppProviders = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}
