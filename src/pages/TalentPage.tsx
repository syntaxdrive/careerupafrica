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
        <section className="companies-intro">
          <div className="container">
            <div className="side-by-side reverse">
              <div className="side-content">
                <h2 className="section-title">Proof over potential.</h2>
                <p className="intro-text" style={{ textAlign: 'left' }}>
                  A degree or certificate shows you learned something, but companies hire people who can apply what they’ve learned.
                  CareerUp Africa bridges this gap through short, structured Work Experience Placements where you prove your competence to the people who matter most: founders and hiring managers.
                </p>
              </div>
              <div className="side-image">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students gaining skills" className="rounded-image shadow-md" />
              </div>
            </div>
          </div>
        </section>
      </div>

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
