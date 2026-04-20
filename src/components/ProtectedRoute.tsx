import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { UserType } from '../stores/authStore'
import { CareerUpLoader } from './CareerUpLoader'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedUserTypes?: UserType[]
}

export default function ProtectedRoute({ children, allowedUserTypes }: ProtectedRouteProps) {
  const { user, profile, loading, initialized } = useAuthStore()

  // Wait for auth to initialize
  if (!initialized || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--color-navy)'
      }}>
        <CareerUpLoader />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Check user type if specified
  if (allowedUserTypes && profile && !allowedUserTypes.includes(profile.user_type)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
