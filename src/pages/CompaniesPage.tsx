import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './CompaniesPage.css'
import { CheckCircle2, Target, Zap, Briefcase, TrendingUp, Users } from 'lucide-react'

export default function CompaniesPage() {
  useScrollReveal();

  return (
    <div className="companies-page">
      {/* Hero Section */}
      <section className="companies-hero">
        <div className="container text-center">
          <h1 className="hero-title">Stop Waiting for Experienced Hires. Build Them.</h1>
          <p className="hero-subtext">
            CareerUp Africa gives you access to skilled, pre-vetted emerging talent — ready to contribute to real business tasks from day one. No hiring risk. No long-term commitment. Just results.
          </p>
          <a
            href="https://forms.gle/VjSNd1pm5vgrtuoL8"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pop btn-pop-orange"
          >
            Register Your Company
          </a>
        </div>
      </section>

      {/* Intro Section */}
      <div className="reveal-up">
        <section className="companies-intro">
          <div className="container text-center">
            <h2 className="section-title">The talent you need already exists. They just haven't had their first shot.</h2>
            <p className="intro-text">
              Across Africa, thousands of skilled young professionals are trained, motivated, and ready to work — but locked out of the job market because no one will give them their first opportunity. CareerUp Africa changes that. We identify, vet, and match these talents directly to your business needs through structured Work Experience Placements.
            </p>
          </div>
        </section>
      </div>

      {/* Why Partner Section */}
      <div className="reveal-up">
        <section className="companies-value">
          <div className="container">
            <h2 className="section-title text-center">Why partner with CareerUp Africa?</h2>
            <div className="value-grid">
            <div className="value-card">
              <div className="icon-wrapper"><CheckCircle2 size={32} /></div>
              <h3>Pre-vetted talent</h3>
              <p>Every talent is matched based on skill, not just enthusiasm.</p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper"><Zap size={32} /></div>
              <h3>Fast onboarding</h3>
              <p>Placements are structured and ready to deploy in days.</p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper"><Target size={32} /></div>
              <h3>Try before you hire</h3>
              <p>Evaluate performance in a real work environment before making any commitment.</p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper"><Briefcase size={32} /></div>
              <h3>Real output</h3>
              <p>Talents work on actual business tasks, not filler projects.</p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper"><TrendingUp size={32} /></div>
              <h3>Low cost, high value</h3>
              <p>No platform fees during our pilot phase. You only provide a support stipend.</p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper"><Users size={32} /></div>
              <h3>Build your pipeline</h3>
              <p>Discover talent early and extend or hire the ones that perform.</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    {/* Partner Meaning Section */}
      <div className="reveal-up">
        <section className="partner-meaning">
          <div className="container">
            <h2 className="section-title text-center">Here's what being a partner means</h2>
            <div className="meaning-list">
              <div className="meaning-item">
                <div className="check-icon">✓</div>
                <p>Provide a real task or project for the talent to work on</p>
              </div>
              <div className="meaning-item">
                <div className="check-icon">✓</div>
                <p>Assign a point of contact or team lead to guide the placement</p>
              </div>
              <div className="meaning-item">
                <div className="check-icon">✓</div>
                <p>Pay a modest support stipend to the talent for the duration</p>
              </div>
              <div className="meaning-item">
                <div className="check-icon">✓</div>
                <p>Give honest performance feedback at the end of the placement</p>
              </div>
            </div>
            <p className="text-center meaning-footer">
              <strong>That's it. No lengthy contracts. No platform fees. No obligation to hire.</strong>
            </p>
          </div>
        </section>
      </div>

      {/* Built For You Section */}
      <div className="reveal-up">
        <section className="built-for-you">
          <div className="container">
            <h2 className="section-title text-center">This is built for you if...</h2>
            <div className="value-grid">
              <div className="value-card tight">
                <div className="check-icon-large">✓</div>
                <p>You're a startup or early-stage company with real work that needs doing</p>
              </div>
              <div className="value-card tight">
                <div className="check-icon-large">✓</div>
                <p>You're a founder who needs skilled support but can't justify a full-time hire yet</p>
              </div>
              <div className="value-card tight">
                <div className="check-icon-large">✓</div>
                <p>You're an HR or people team looking to build an early talent pipeline</p>
              </div>
              <div className="value-card tight">
                <div className="check-icon-large">✓</div>
                <p>You believe in giving emerging talent a real shot</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pilot Phase Callout */}
      <div className="reveal-up">
        <section className="pilot-phase">
          <div className="container text-center">
            <h2>Pilot Phase</h2>
            <p>
              We are currently in our pilot phase. Companies joining now get priority matching, dedicated onboarding support, and <strong>zero platform fees</strong> — forever locked in as founding partners.
            </p>
            <div id="company-form-section" style={{ marginTop: '3rem' }}>
              <a 
                href="https://forms.gle/VjSNd1pm5vgrtuoL8" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-pop btn-pop-primary form-cta-wide"
                style={{ fontSize: '1.25rem', padding: '1.25rem 3rem' }}
              >
                Apply as a Partner Company
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="reveal-up">
        <ContactSection />
      </div>
      
      <Footer />
    </div>
  )
}