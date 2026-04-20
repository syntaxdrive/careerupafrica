import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { getParticipantProfile } from '../../lib/profileService'
import './Dashboard.css'

export default function ParticipantDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    async function checkProfileCompletion() {
      if (!user?.id) return

      try {
        const participantProfile = await getParticipantProfile(user.id)
        
        // If no participant record exists or profile is not completed, redirect to onboarding
        if (!participantProfile || !participantProfile.profileCompleted) {
          navigate('/onboarding/talent')
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
          <h2>Participant Dashboard</h2>
          <p className="text-secondary">Build demonstrable competence</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Active Deliverables</h3>
            <div className="stat">0</div>
            <p>No active deliverables yet</p>
          </div>

          <div className="dashboard-card">
            <h3>Earned Badges</h3>
            <div className="stat">0</div>
            <p>Complete deliverables to earn badges</p>
          </div>

          <div className="dashboard-card">
            <h3>Current Cohort</h3>
            <div className="stat">-</div>
            <p>Not enrolled in a cohort</p>
          </div>

          <div className="dashboard-card">
            <h3>Completion Rate</h3>
            <div className="stat">-</div>
            <p>Complete your first deliverable</p>
          </div>
        </div>

        <div className="coming-soon">
          <p>🚧 Full dashboard features coming soon</p>
        </div>
      </main>
    </div>
  )
}
