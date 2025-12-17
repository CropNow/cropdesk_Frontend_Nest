import { Navigate } from 'react-router-dom'
import Loader from '@/components/common/Loader'
import { useAuth } from './useAuth'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />

  return children
}
