import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import ParticipantDashboard from './ParticipantDashboard'
import FounderDashboard from './FounderDashboard'
import AdminDashboard from './AdminDashboard'

export default function Dashboard() {
  const { profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <h2>Loading dashboard...</h2>
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/auth" replace />
  }

  // Route to appropriate dashboard based on user type
  switch (profile.user_type) {
    case 'participant':
      return <ParticipantDashboard />
    case 'founder':
      return <FounderDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return <Navigate to="/auth" replace />
  }
}
