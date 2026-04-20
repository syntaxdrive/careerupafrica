import { isSupabaseReady } from '../lib/supabase'
import './DemoBanner.css'

export default function DemoBanner() {
  // Only show if Supabase is not configured
  if (isSupabaseReady()) {
    return null
  }

  return (
    <div className="demo-banner">
      <div className="demo-banner-content">
        <span className="demo-badge">DEMO MODE</span>
        <span className="demo-text">
          Demo accounts: admin@demo.com, participant@demo.com, founder@demo.com | Password: admin123 or demo123
        </span>
        <a 
          href="https://github.com/yourusername/careerup" 
          target="_blank" 
          rel="noopener noreferrer"
          className="demo-link"
        >
          Setup Supabase →
        </a>
      </div>
    </div>
  )
}
