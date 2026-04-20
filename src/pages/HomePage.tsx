import HeroSection from '../components/landing/HeroSection'
import ProblemSection from '../components/landing/ProblemSection'
import WhatIsWep from '../components/landing/WhatIsWep'
import WhatWeDo from '../components/landing/WhatWeDo'
import HowItWorks from '../components/landing/HowItWorks'
import FAQ from '../components/landing/FAQ'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './HomePage.css'

export default function HomePage() {
  useScrollReveal();

  return (
    <div className="homepage">
      <HeroSection />
      
      <div className="reveal-up">
        <ProblemSection />
      </div>
      
      <div className="reveal-up">
        <WhatIsWep />
      </div>
      
      <div className="reveal-up">
        <WhatWeDo />
      </div>
      
      <div className="reveal-up">
        <HowItWorks />
      </div>
      
      <section id="waitlist-section" className="reveal-up" style={{ background: 'var(--color-bg-secondary)', padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">Ready to Partner With Us?</h2>
          <p style={{ marginBottom: '3rem', fontSize: '1.125rem', color: 'var(--color-slate-600)' }}>Join the network of industry professionals transforming the African talent pipeline.</p>
          <a 
            href="https://forms.gle/W7LkriAMfSfJL9VDA" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-pop btn-pop-primary"
            style={{ fontSize: '1.25rem', padding: '1.25rem 4rem', display: 'inline-block' }}
          >
            Apply as HR / Professional
          </a>
        </div>
      </section>

      <div className="reveal-up">
        <FAQ />
      </div>
      
      <div className="reveal-up">
        <ContactSection />
      </div>
      
      <Footer />
    </div>
  )
}
