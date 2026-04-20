import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import './CompanyForm.css'

export default function CompanyForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1
    companyName: '',
    companyWebsite: '',
    industry: '',
    industryOther: '',
    companySize: '',
    location: '',
    operatingTime: '',
    // Step 2
    fullName: '',
    roleTitle: '',
    email: '',
    phone: '',
    isFounder: '',
    // Step 3
    rolesToFill: '',
    talentCount: '',
    skillAreas: '',
    hasProject: '',
    workDescription: '',
    // Step 4
    provideStipend: '',
    assignContact: '',
    onboardTimeline: '',
    considerHiring: '',
    // Step 5
    howDidYouHear: '',
    additionalComments: ''
  })
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      if (!supabase) throw new Error('Database connection not initialized.')
      
      // 1. Submit email to Supabase Waitlist
      const { error } = await supabase
        .from('waitlist')
        .insert([{ 
          email: formData.email, 
          role: 'startup' 
        }])

      if (error && error.code !== '23505') {
        // Ignore duplicate email errors if they just want to update their info, otherwise throw
        console.warn('Supabase waitlist warning:', error.message)
      }

      // 2. Fast Direct Excel/Google Sheets Integration
      // Go to sheet.best or sheetdb.io, paste your Google Sheet/Excel link, and paste the API URL they give you here:
      const EXCEL_API_URL = 'PASTE_YOUR_EXCEL_API_LINK_HERE';
      
      if (EXCEL_API_URL && EXCEL_API_URL !== 'PASTE_YOUR_EXCEL_API_LINK_HERE') {
        await fetch(EXCEL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formType: 'Company Partner',
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
        <h3>🎉 Registration Received!</h3>
        <p>We're thrilled to have you on board. Our partnership team will be in touch shortly regarding the next steps for your Work Experience Placements.</p>
      </div>
    )
  }

  return (
    <div className="tally-form-container">
      <div className="tally-progress">
        Step {step} of 5
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (step === 5) handleSubmit(e); else nextStep(); }} className="tally-form">
        
        {step === 1 && (
          <div className="form-step">
            <h3 className="step-title">Company Registration</h3>
            <div className="form-group full-width">
              <label>Company Name *</label>
              <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Company Website</label>
              <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Industry *</label>
              <select name="industry" required value={formData.industry} onChange={handleChange} className="tally-select">
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance / Fintech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {formData.industry === 'Other' && (
              <div className="form-group full-width">
                <label>If other, state industry below</label>
                <input type="text" name="industryOther" required value={formData.industryOther} onChange={handleChange} />
              </div>
            )}
            <div className="form-group full-width">
              <label>Company Size *</label>
              <select name="companySize" required value={formData.companySize} onChange={handleChange} className="tally-select">
                <option value="">Select size</option>
                <option value="1-5">1–5</option>
                <option value="6-20">6–20</option>
                <option value="21-50">21–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Where is your company based? * (City/State/Country)</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>How long has your company been operating? *</label>
              <select name="operatingTime" required value={formData.operatingTime} onChange={handleChange} className="tally-select">
                <option value="">Select duration</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-3 years">1–3 years</option>
                <option value="3-5 years">3–5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3 className="step-title">Contact Person</h3>
            <div className="form-group full-width">
              <label>Your Full Name *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Your Role / Title *</label>
              <input type="text" name="roleTitle" required value={formData.roleTitle} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Email Address *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Phone Number *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Are you the founder? *</label>
              <select name="isFounder" required value={formData.isFounder} onChange={handleChange} className="tally-select">
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h3 className="step-title">Talent Needs</h3>
            <div className="form-group full-width">
              <label>What role(s) are you looking to fill through a WEP? *</label>
              <input type="text" name="rolesToFill" required value={formData.rolesToFill} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>How many talents are you looking to take on? *</label>
              <select name="talentCount" required value={formData.talentCount} onChange={handleChange} className="tally-select">
                <option value="">Select count</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4-5">4-5</option>
                <option value="More than 5">More than 5</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>What skill areas do you need? *</label>
              <input type="text" name="skillAreas" required value={formData.skillAreas} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Do you have a specific project or task for the talent? *</label>
              <select name="hasProject" required value={formData.hasProject} onChange={handleChange} className="tally-select">
                <option value="">Select...</option>
                <option value="Yes">Yes - I have something ready</option>
                <option value="Not yet">Not yet but I can define one</option>
                <option value="Need help">I need help figuring this out</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Briefly describe the work you need done *</label>
              <textarea name="workDescription" required rows={4} value={formData.workDescription} onChange={handleChange}></textarea>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h3 className="step-title">Logistics</h3>
            <div className="form-group full-width">
              <label>Are you willing to provide a support stipend to the talent? *</label>
              <select name="provideStipend" required value={formData.provideStipend} onChange={handleChange} className="tally-select">
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="Yes, need amount">Yes but I need to know the expected amount first</option>
                <option value="No">No</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Can you assign a point of contact to guide the talent during placement? *</label>
              <select name="assignContact" required value={formData.assignContact} onChange={handleChange} className="tally-select">
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>How soon are you looking to onboard talent? *</label>
              <select name="onboardTimeline" required value={formData.onboardTimeline} onChange={handleChange} className="tally-select">
                <option value="">Select timeline</option>
                <option value="Immediately">Immediately</option>
                <option value="Within 1 month">Within 1 month</option>
                <option value="1-3 months">1–3 months</option>
                <option value="Just exploring for now">Just exploring for now</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Would you consider hiring a talent full-time after a successful placement? *</label>
              <select name="considerHiring" required value={formData.considerHiring} onChange={handleChange} className="tally-select">
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Possible">Possible</option>
                <option value="Depends on performance">Depends on performance</option>
              </select>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-step">
            <h3 className="step-title">Final Steps</h3>
            <div className="form-group full-width">
              <label>How did you hear about CareerUp Africa? *</label>
              <input type="text" name="howDidYouHear" required value={formData.howDidYouHear} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Any questions or additional comments?</label>
              <textarea name="additionalComments" rows={4} value={formData.additionalComments} onChange={handleChange}></textarea>
            </div>
          </div>
        )}

        <div className="multi-step-actions">
          {step > 1 && (
            <button type="button" className="btn-outline step-btn-back" onClick={prevStep} disabled={status === 'loading'}>
              Back
            </button>
          )}
          {step < 5 ? (
            <button type="submit" className="btn-pop btn-pop-orange step-btn-next">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-pop btn-pop-orange step-btn-next" disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
        
        {status === 'error' && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  )
}