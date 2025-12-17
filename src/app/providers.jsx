import { AuthProvider } from "@/features/auth/AuthProvider";

export const AppProviders = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}
