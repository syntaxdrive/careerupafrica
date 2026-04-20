import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <img src="/Main Logo 1.png" alt="CareerUp Africa" height="40" style={{ display: 'block' }} />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/talent" className="nav-link">For Talent</Link>
          <Link to="/companies" className="nav-link">For Companies</Link>
          <Link to="/hr" className="nav-link">For HRs</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <div className={`mobile-nav-wrapper ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/talent" className="mobile-nav-link" onClick={closeMenu}>For Talent</Link>
          <Link to="/companies" className="mobile-nav-link" onClick={closeMenu}>For Companies</Link>
          <Link to="/hr" className="mobile-nav-link" onClick={closeMenu}>For HRs</Link>
        </nav>
      </div>
    </header>
  );
}
