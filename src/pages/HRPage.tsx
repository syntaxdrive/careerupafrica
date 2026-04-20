import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './HRPage.css'
import { GraduationCap, Award, Network, Share2, Star, Clock, HeartHandshake, Map, Globe } from 'lucide-react'

export default function HRPage() {
  useScrollReveal();

  return (
    <div className="hr-page">
      {/* Hero Section */}
      <section className="hr-hero">
        <div className="container text-center">
          <h1 className="hero-title">You've Seen the Gap. Now Help Us Close It.</h1>
          <p className="hero-subtext">
            As an HR professional or industry expert, you know exactly how broken the entry-level hiring system is in Africa. CareerUp Africa is building the fix — and we need people like you at the centre of it.
          </p>
          <a
            href="https://forms.gle/W7LkriAMfSfJL9VDA"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pop btn-pop-primary form-cta-wide"
          >
            Join as a Professional Partner
          </a>
        </div>
      </section>

      {/* Intro Section */}
      <div className="reveal-up">
        <section className="hr-intro">
          <div className="container text-center">
            <h2 className="section-title">The hiring pipeline is broken. You can help rebuild it.</h2>
            <p className="intro-text">
              Every year, thousands of skilled graduates across Africa are turned away from opportunities they are qualified for — simply because they lack formal work experience. As HR professionals and industry leaders, you sit at the exact point where this problem is most visible and most fixable. CareerUp Africa is creating a structured pathway from learning to employment, and we're inviting experienced professionals to be part of the solution.
            </p>
          </div>
        </section>
      </div>

      {/* How to Contribute */}
      <div className="reveal-up">
        <section className="hr-contribute">
          <div className="container">
            <h2 className="section-title text-center">There are several ways to contribute</h2>
            <div className="value-grid">
            <div className="value-card">
              <div className="icon-wrapper"><GraduationCap size={32} /></div>
              <h3>As a Mentor</h3>
              <p>Guide talents through their placement. Share your experience, challenge their thinking, and help them grow into professionals who perform — not just professionals who attended school.</p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper"><Award size={32} /></div>
              <h3>As a Validator / Evaluator</h3>
              <p>Review talent performance at the end of placements. Your assessment becomes part of their verified work record — the credential that gets them hired.</p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper"><Network size={32} /></div>
              <h3>As a Hiring Pipeline Partner</h3>
              <p>Use CareerUp Africa as a sourcing tool. Talents who complete placements are pre-vetted, performance-rated, and work-ready. Build your junior talent pipeline here before your competitors do.</p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper"><Share2 size={32} /></div>
              <h3>As an Advocate</h3>
              <p>Refer talents from your network. Recommend CareerUp Africa to companies in your industry. Help us grow the movement across Africa.</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    {/* What's in it for you */}
      <div className="reveal-up">
        <section className="hr-benefits">
          <div className="container">
            <h2 className="section-title text-center">What's in it for you?</h2>
            <div className="benefit-list">
              <div className="benefit-item">
                <Star className="benefit-icon" />
                <p>Recognition as a CareerUp Africa Professional Partner</p>
              </div>
              <div className="benefit-item">
                <Clock className="benefit-icon" />
                <p>Early access to a curated pipeline of skilled, work-ready emerging talent</p>
              </div>
              <div className="benefit-item">
                <HeartHandshake className="benefit-icon" />
                <p>The ability to shape the next generation of professionals in your industry</p>
              </div>
              <div className="benefit-item">
                <Globe className="benefit-icon" />
                <p>A network of like-minded HR and industry leaders across Africa</p>
              </div>
              <div className="benefit-item">
                <Map className="benefit-icon" />
                <p>The satisfaction of being part of something that actually matters</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Built For You Section */}
      <div className="reveal-up">
        <section className="built-for-you">
          <div className="container">
            <h2 className="section-title text-center">You're the right fit if...</h2>
            <div className="value-grid">
              <div className="value-card tight">
                <div className="check-icon-large">✓</div>
                <p>You have 3+ years of experience in HR, talent acquisition, people operations, or any professional field</p>
              </div>
              <div className="value-card tight">
                <div className="check-icon-large">✓</div>
                <p>You work in or alongside African startups, corporates, or SMEs</p>
              </div>
              <div className="value-card tight">
                <div className="check-icon-large">✓</div>
                <p>You care about fixing the broken entry-level hiring system</p>
              </div>
              <div className="value-card tight">
                <div className="check-icon-large">✓</div>
                <p>You want to contribute beyond your day job</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Form Section */}
      <div className="reveal-up">
        <section className="hr-form-section" id="hr-form-section" style={{ background: 'var(--color-navy)', padding: '5rem 0' }}>
          <div className="container text-center">
            <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800 }}>
              Register as a Professional Partner
            </h2>
            <p style={{ color: 'white', opacity: 0.9, marginBottom: '3rem' }}>
              Join the network of industry leaders closing the entry-level experience gap.
            </p>
            <a 
              href="https://forms.gle/W7LkriAMfSfJL9VDA" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-pop btn-pop-primary form-cta-wide"
              style={{ fontSize: '1.25rem', padding: '1.25rem 4rem' }}
            >
              Join as a Professional Partner
            </a>
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