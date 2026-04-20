import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">CareerUp Africa</h3>
            <p className="footer-tagline">Proof Over Potential</p>
            <p className="footer-description">
              A cohort-based competence validation and hiring infrastructure.
            </p>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Get Started</h4>
            <ul className="footer-links">
              <li><Link to="/">Apply as Partner</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/legal/privacy">Privacy Policy</Link></li>
              <li><Link to="/legal/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} CareerUp Africa. All rights reserved.</p>
          <p className="footer-developer">
            Contact Developer: <a href="mailto:quakestartup@gmail.com">quakestartup@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
