import { Link } from 'react-router-dom';
import './Legal.css';

export default function About() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>About CareerUp Africa</h1>
          <p className="legal-subtitle">
            Building Africa's next generation of competent professionals
          </p>
        </header>

        <div className="legal-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              CareerUp Africa exists to solve a critical problem: the gap between potential and proof. 
              Too many talented individuals struggle to demonstrate their capabilities to employers, 
              while too many startups struggle to find demonstrably competent talent.
            </p>
            <p>
              We believe in <strong>proof over potential</strong>. Instead of resumes and certificates, 
              we provide a platform where professionals execute real-world projects, receive structured 
              feedback, and earn validated badges that employers can independently verify.
            </p>
          </section>

          <section className="about-section">
            <h2>How We Work</h2>
            <p>
              CareerUp Africa is <strong>not</strong> a job board, freelance marketplace, or certificate 
              verification platform. We are a curated competence proving ground.
            </p>
            
            <div className="process-grid">
              <div className="process-card">
                <div className="process-number">1</div>
                <h3>Selective Vetting</h3>
                <p>
                  We vet every applicant through scenario-based questions that test thinking, 
                  not just certificates. Only those who demonstrate genuine problem-solving ability 
                  are admitted.
                </p>
              </div>

              <div className="process-card">
                <div className="process-number">2</div>
                <h3>Cohort-Based Learning</h3>
                <p>
                  Approved talent are organized into cohorts and manually matched with founders 
                  who need their skills. This isn't open access—it's intentional placement.
                </p>
              </div>

              <div className="process-card">
                <div className="process-number">3</div>
                <h3>Real-World Execution</h3>
                <p>
                  Participants execute actual startup projects—not simulations. They submit 
                  deliverables, receive structured feedback, and iterate until competence is proven.
                </p>
              </div>

              <div className="process-card">
                <div className="process-number">4</div>
                <h3>Validated Badges</h3>
                <p>
                  Exceptional work earns independently verifiable badges. These aren't participation 
                  trophies—they're proof of demonstrated competence on real-world tasks.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Who We Serve</h2>
            
            <div className="audience-grid">
              <div className="audience-card">
                <h3>🎯 Talent</h3>
                <p>
                  Early career professionals who have potential but lack the portfolio to prove it. 
                  Through CareerUp, you build demonstrable competence by executing real projects 
                  and earning validated credentials.
                </p>
              </div>

              <div className="audience-card">
                <h3>🚀 Founders</h3>
                <p>
                  Startup founders who need competent help but can't afford to hire incorrectly. 
                  You get vetted talent who prove their abilities on your actual projects, with 
                  our admin team ensuring quality.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Values</h2>
            
            <div className="values-list">
              <div className="value-item">
                <strong>Proof Over Potential:</strong> We care about what you can do, not what you claim you can do.
              </div>
              
              <div className="value-item">
                <strong>Transparency:</strong> Every process is clear. Every decision is explained. No black boxes.
              </div>
              
              <div className="value-item">
                <strong>Accountability:</strong> Feedback is specific and actionable. Progress is measurable. Badges are verifiable.
              </div>
              
              <div className="value-item">
                <strong>Quality Over Scale:</strong> We'd rather have 100 demonstrably competent professionals than 10,000 unvetted applicants.
              </div>
              
              <div className="value-item">
                <strong>Manual Over Automated:</strong> Matching is manual. Feedback is human. Badges are admin-approved. No algorithms replacing judgment.
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>What We're NOT</h2>
            
            <ul className="not-list">
              <li>Not a job board—we don't post jobs, we place vetted talent</li>
              <li>Not a freelance marketplace—we're not Upwork or Fiverr</li>
              <li>Not a certificate mill—our badges mean something because they're earned through proven work</li>
              <li>Not open access—we curate, vet, and match manually</li>
              <li>Not automated—real humans review, match, and validate everything</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Get Involved</h2>
            
            <div className="cta-grid">
              <div className="cta-card">
                <h3>Join as Talent</h3>
                <p>
                  Ready to prove your competence? Apply to join a cohort and start building 
                  your verified portfolio.
                </p>
                <Link to="/apply/talent" className="cta-btn">
                  Apply Now →
                </Link>
              </div>

              <div className="cta-card">
                <h3>Work with Us (Founders)</h3>
                <p>
                  Need vetted talent for your startup? Apply to provide real-world projects 
                  to our cohorts.
                </p>
                <Link to="/apply/founder" className="cta-btn">
                  Get Talent →
                </Link>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Questions?</h2>
            <p>
              Have questions about CareerUp Africa? Want to learn more about how we work?
            </p>
            <Link to="/contact" className="contact-link">
              Contact Us →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
