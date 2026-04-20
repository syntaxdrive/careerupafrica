import { useNavigate } from 'react-router-dom'
import './HeroSection.css'

export default function HeroSection() {
  const navigate = useNavigate();

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <h1 className="hero-title">
          Your first real work starts here.
        </h1>
        <p className="hero-subtext">
          Bridging the gap between learning and employability in Africa through structured <span className="highlight-text">work experience placements</span> that connect skilled emerging talent to real business opportunities for ALL AGES ACROSS Africa.
        </p>
        <div className="hero-buttons">
          <button className="btn-pop btn-pop-primary" onClick={scrollToWaitlist}>Join the Waitlist</button>
          <button className="btn-pop btn-pop-secondary" onClick={() => navigate('/companies')}>Partner with us</button>
        </div>
      </div>
    </section>
  )
}
