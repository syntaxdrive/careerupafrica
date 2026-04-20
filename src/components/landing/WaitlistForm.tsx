import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import './WaitlistForm.css'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('talent')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return
    
    setStatus('loading')
    setErrorMessage('')

    try {
      if (!supabase) throw new Error('Database connection not initialized.');
      
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, role }])

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('This email is already on the waitlist.')
        }
        throw new Error(error.message)
      }

      setStatus('success')
      setEmail('')
    } catch (err: any) {
      console.error('Waitlist error:', err)
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="waitlist-success">
        <h3>Application Received!</h3>
        <p>We'll notify you via email regarding the pre-qualification and next steps for Cohort 1.</p>
        <button className="btn-outline" onClick={() => setStatus('idle')}>
          Register another email
        </button>
      </div>
    )
  }

  return (
    <div className="waitlist-container">
      <h3>Join Cohort 1 (Spots filling fast)</h3>
      <form onSubmit={handleSubmit} className="waitlist-form">
        <div className="role-selector">
          <label className={role === 'talent' ? 'active' : ''}>
            <input 
              type="radio" 
              name="role" 
              value="talent" 
              checked={role === 'talent'} 
              onChange={() => setRole('talent')} 
            />
            Early-Career Professional
          </label>
          <label className={role === 'startup' ? 'active' : ''}>
            <input 
              type="radio" 
              name="role" 
              value="startup" 
              checked={role === 'startup'} 
              onChange={() => setRole('startup')} 
            />
            Industry Professional / Startup
          </label>
          <label className={role === 'hr' ? 'active' : ''}>
            <input 
              type="radio" 
              name="role" 
              value="hr" 
              checked={role === 'hr'} 
              onChange={() => setRole('hr')} 
            />
            Hiring Manager / Recruiter
          </label>
        </div>
        
        <div className="input-group">
          <input 
            type="email" 
            placeholder="Enter your email to apply..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
          />
          <button type="submit" className="btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Applying...' : 'Apply for Cohort 1'}
          </button>
        </div>
        {status === 'error' && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  )
}
