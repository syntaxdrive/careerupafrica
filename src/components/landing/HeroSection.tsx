import { useNavigate } from 'react-router-dom'
import './HeroSection.css'

export default function HeroSection() {
  const navigate = useNavigate();

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
          <a href="https://forms.gle/Y9YCECFJPtAnuGdF7" target="_blank" rel="noopener noreferrer" className="btn-pop btn-pop-primary">Join the Waitlist</a>
          <button className="btn-pop btn-pop-secondary" onClick={() => navigate('/companies')}>Partner with us</button>
        </div>
      </div>
    </section>
  )
}
