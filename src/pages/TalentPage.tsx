import Footer from '../components/landing/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Briefcase, Award, Zap } from 'lucide-react';
import './CompaniesPage.css'; // Reusing similar styling

export default function TalentPage() {
  useScrollReveal();

  return (
    <div className="companies-page talent-page">
      {/* Hero Section */}
      <section className="companies-hero talent-hero">
        <div className="container text-center">
          <h1 className="hero-title">Your First Real Work Experience Starts Here.</h1>
          <p className="hero-subtext">
            Stop dealing with the "need experience to get experience" trap. Get pre-vetted, matched, and start building your portfolio today.
          </p>
          <a 
            href="https://forms.gle/Y9YCECFJPtAnuGdF7" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-pop btn-pop-orange"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Value Section */}
      <div className="reveal-up">
        <section className="companies-value" style={{ padding: '6rem 0', background: 'var(--color-bg-secondary)' }}>
          <div className="container">
            <h2 className="section-title text-center">Why Join CareerUp Africa?</h2>
            <div className="value-grid">
              <div className="value-card">
                <div className="icon-wrapper"><Briefcase size={32} /></div>
                <h3>Real Business Value</h3>
                <p>Execute real tasks for active startups. Build a portfolio that actually proves your competence.</p>
              </div>
              <div className="value-card">
                <div className="icon-wrapper"><Award size={32} /></div>
                <h3>Validated Badges</h3>
                <p>You don't just finish tasks, you earn validated badges reviewed by startup founders.</p>
              </div>
              <div className="value-card">
                <div className="icon-wrapper"><Zap size={32} /></div>
                <h3>Fast-Track Your Career</h3>
                <p>Showcase actual work, skip the endless resume screening, and land your first big break faster.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <div className="reveal-up">
        <section style={{ padding: '5rem 0', textAlign: 'center', background: 'white' }}>
          <div className="container">
            <h2>Ready to Prove Your Potential?</h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'var(--color-slate-600)' }}>
              Join the growing network of early-career professionals launching with CareerUp Africa.
            </p>
            <a 
              href="https://forms.gle/Y9YCECFJPtAnuGdF7" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-pop btn-pop-primary form-cta-wide"
            >
              Complete the Talent Application
            </a>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
}
