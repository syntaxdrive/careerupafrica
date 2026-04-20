import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { getFounderProfile } from '../../lib/profileService'
import './Dashboard.css'

export default function FounderDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    async function checkProfileCompletion() {
      if (!user?.id) return

      try {
        const founderProfile = await getFounderProfile(user.id)
        
        // If no founder record exists or profile is not completed, redirect to onboarding
        if (!founderProfile || !founderProfile.profileCompleted) {
          navigate('/onboarding/founder')
          return
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    checkProfileCompletion()
  }, [user, navigate])

  if (isLoadingProfile) {
    return (
      <div className="dashboard">
        <main className="dashboard-content">
          <div className="loading-state">Loading your dashboard...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        <div className="dashboard-hero">
          <h2>Founder Dashboard</h2>
          <p className="text-secondary">Provide real-world projects</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Active Projects</h3>
            <div className="stat">0</div>
            <p>Create your first project</p>
          </div>

          <div className="dashboard-card">
            <h3>Participants</h3>
            <div className="stat">0</div>
            <p>No assigned participants yet</p>
          </div>

          <div className="dashboard-card">
            <h3>Pending Reviews</h3>
            <div className="stat">0</div>
            <p>No submissions to review</p>
          </div>

          <div className="dashboard-card">
            <h3>Feedback Given</h3>
            <div className="stat">0</div>
            <p>Provide feedback on submissions</p>
          </div>
        </div>

        <div className="coming-soon">
          <p>🚧 Full dashboard features coming soon</p>
        </div>
      </main>
    </div>
  )
}
