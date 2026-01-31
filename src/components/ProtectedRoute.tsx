import { Navigate, useLocation } from 'react-router-dom'
import { getStoredUser } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getStoredUser()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
