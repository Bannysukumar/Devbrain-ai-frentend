import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getStoredUser, getCurrentFirebaseUser } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(getStoredUser())
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // Check Firebase auth state
    const firebaseUser = getCurrentFirebaseUser()
    const storedUser = getStoredUser()
    
    // If Firebase user exists but stored user doesn't match, use Firebase user
    if (firebaseUser && (!storedUser || storedUser.id !== firebaseUser.uid)) {
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL,
      })
    } else {
      setUser(storedUser)
    }
    
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
