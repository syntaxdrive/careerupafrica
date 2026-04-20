import { useEffect, useState } from 'react'
import './Statistics.css'

interface Stats {
  verifiedTalents: number
  shadowingHours: number
  completionRate: number
  founderSatisfaction: number
}

export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    verifiedTalents: 0,
    shadowingHours: 0,
    completionRate: 0,
    founderSatisfaction: 0
  })

  useEffect(() => {
    // Mock data for early MVP based on vision model
    setStats({
      verifiedTalents: 247,
      shadowingHours: 1200,
      completionRate: 94,
      founderSatisfaction: 96
    })
  }, [])

  return (
    <section className="statistics">
      <div className="container">
        <h2>Proof in Numbers</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number text-teal">{stats.verifiedTalents}</div>
            <div className="stat-label">Verified Talents</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-navy">{stats.shadowingHours}+</div>
            <div className="stat-label">Shadowing Hours</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-orange">{stats.completionRate}%</div>
            <div className="stat-label">Cohort Completion Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-teal">{stats.founderSatisfaction}%</div>
            <div className="stat-label">Professional Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
