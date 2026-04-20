import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import './CompanyForm.css'

export default function HRForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    company: '',
    interest: 'Mentor'
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      if (!supabase) throw new Error('Database connection not initialized.')
      
      const { error } = await supabase
        .from('waitlist')
        .insert([{ 
          email: formData.email, 
          role: 'hr' 
        }])

      if (error && error.code !== '23505') {
        console.warn('Supabase waitlist warning:', error.message)
      }

      // Fast Direct Excel/Google Sheets Integration
      // Go to sheet.best or sheetdb.io, paste your Google Sheet/Excel link, and paste the API URL they give you here:
      const EXCEL_API_URL = 'PASTE_YOUR_EXCEL_API_LINK_HERE';
      
      if (EXCEL_API_URL && EXCEL_API_URL !== 'PASTE_YOUR_EXCEL_API_LINK_HERE') {
        await fetch(EXCEL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formType: 'HR Partner',
            timestamp: new Date().toISOString(),
            ...formData
          }),
        }).catch(err => console.error('Excel integration failed:', err));
      }

      setStatus('success')
    } catch (err: any) {
      console.error('Waitlist error:', err)
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="tally-form-success">
        <h3>🎉 Welcome Aboard!</h3>
        <p>Thank you for partnering with CareerUp Africa. We'll send an email with onboarding details shortly.</p>
      </div>
    )
  }

  return (
    <div className="tally-form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} className="tally-form">
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--color-navy)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Partner with us</h3>
          <p style={{ color: 'var(--color-slate-600)', fontSize: '1rem' }}>We just need a few details to get started.</p>
        </div>

        <div className="form-group full-width">
          <label>Full Name *</label>
          <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Jane Doe" />
        </div>

        <div className="form-group full-width">
          <label>Work Email *</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="jane@company.com" />
        </div>

        <div className="form-group full-width">
          <label>Company / Organization *</label>
          <input type="text" name="company" required value={formData.company} onChange={handleChange} placeholder="Current Employer" />
        </div>

        <div className="form-group full-width">
          <label>LinkedIn Profile URL *</label>
          <input type="url" name="linkedin" required value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
        </div>

        <div className="form-group full-width">
          <label>How would you like to contribute? *</label>
          <select name="interest" value={formData.interest} onChange={handleChange} className="tally-select" style={{ width: '100%' }}>
            <option value="Mentor">Mentor (Guide talents)</option>
            <option value="Evaluator">Validator / Evaluator</option>
            <option value="Hiring">Hiring Pipeline Partner</option>
            <option value="Advocate">Advocate (Referrals)</option>
          </select>
        </div>

        <button type="submit" className="btn-pop btn-pop-primary tally-submit" disabled={status === 'loading'} style={{ width: '100%', marginTop: '1rem' }}>
          {status === 'loading' ? 'Joining...' : 'Submit Application'}
        </button>

        {status === 'error' && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  )
}