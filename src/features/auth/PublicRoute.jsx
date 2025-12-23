import { Navigate } from 'react-router-dom'
import Loader from '@/components/common/Loader'
import { useAuth } from './useAuth'

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (user) return <Navigate to="/" replace />

  return children
}
