import { useEffect, useState, useRef } from 'react'
import { UserCheck, Handshake, Briefcase, DollarSign, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import './HowItWorks.css'

const steps = [
  {
    icon: UserCheck,
    title: 'Sign Up',
    desc: 'Show proof of learning: a course, certification, or skill.',
    stepLabel: 'Step 1'
  },
  {
    icon: Handshake,
    title: 'Get Matched',
    desc: 'Matched to startups based on skills and role fit, not grades.',
    stepLabel: 'Step 2'
  },
  {
    icon: Briefcase,
    title: 'Work Experience Placement',
    desc: 'Contribute to real tasks in a structured, time-bound placement (4–6 weeks).',
    stepLabel: 'Step 3'
  },
  {
    icon: DollarSign,
    title: 'Earn a Stipend',
    desc: 'Some companies provide stipends; some may not. Talents are informed upfront.',
    stepLabel: 'Step 4'
  },
  {
    icon: Award,
    title: 'Get Validated',
    desc: 'Receive performance feedback and verified work experience to build a portfolio.',
    stepLabel: 'Step 5'
  }
];

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % steps.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;
    
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  return (
    <section className="how-it-works" style={{ background: 'var(--color-bg-secondary)', padding: '6rem clamp(0.5rem, 2vw, 2rem)', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--color-navy)', fontWeight: 800 }}>
            How It Works
          </h2>
        </div>
        
        <div className="carousel-wrapper" style={{ margin: '0 auto', maxWidth: '1200px', padding: isMobile ? '0 0.25rem' : '0 clamp(1rem, 5vw, 4rem)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button className="carousel-arrow left" onClick={prevSlide} aria-label="Previous" style={{ display: isMobile ? 'none' : 'flex', background: 'white', border: '1px solid var(--color-border)', borderRadius: '50%', width: '48px', height: '48px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 100, marginRight: '2rem', color: 'var(--color-navy)' }}>
            <ChevronLeft size={24} />
          </button>

          <div 
            className="perspective-carousel" 
            onTouchStart={handleTouchStart} 
            onTouchEnd={handleTouchEnd}
            style={{ width: '100%', maxWidth: isMobile ? 'min(95vw, 460px)' : '460px', height: '420px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px' }}
          >
            {steps.map((step, index) => {
                const isActive = index === activeIndex;
                const offset = index - activeIndex;
                
                // Wrap logic for infinite-like appearance
                let normalizedOffset = offset;
                if (offset > 2) normalizedOffset -= steps.length;
                if (offset < -2) normalizedOffset += steps.length;
                
                const translateFactor = isMobile ? 52 : 70;
                const scaleFactor = isMobile ? 0.09 : 0.15;
                const translateX = normalizedOffset * translateFactor; // percentage
                const scale = 1 - Math.abs(normalizedOffset) * scaleFactor;
                const zIndex = 20 - Math.abs(normalizedOffset);
                const opacity = isActive ? 1 : 0.4;
                
                return (
                  <div 
                    key={index}
                    onClick={() => { if (!isActive) setActiveIndex(index); }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'white',
                      borderRadius: '24px',
                      padding: isMobile ? '2rem 1.5rem' : '3rem 2rem',
                      boxShadow: isActive ? '0 20px 40px -15px rgba(30, 58, 138, 0.2)' : '0 10px 40px -10px rgba(15, 23, 42, 0.1)',
                      border: isActive ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
                      textAlign: 'center',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isActive ? 'default' : 'pointer',
                      transform: `translateX(${translateX}%) scale(${scale})`,
                      zIndex,
                      opacity,
                      filter: isActive ? 'none' : 'blur(2px)',
                      willChange: 'transform, opacity, filter',
                    }}
                  >
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-teal)' }}>
                      <step.icon size={40} />
                    </div>
                    <div style={{ color: 'var(--color-orange)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                      {step.stepLabel}
                    </div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', marginBottom: '1rem', lineHeight: '1.4' }}>{step.title}</h3>
                    <p style={{ color: 'var(--color-slate-600)', lineHeight: '1.6', fontSize: '1rem', margin: 0 }}>{step.desc}</p>
                  </div>
                );
            })}
          </div>

          <button className="carousel-arrow right" onClick={nextSlide} aria-label="Next" style={{ display: isMobile ? 'none' : 'flex', background: 'white', border: '1px solid var(--color-border)', borderRadius: '50%', width: '48px', height: '48px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 100, marginLeft: '2rem', color: 'var(--color-navy)' }}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-dots" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '3rem' }}>
          {steps.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActiveIndex(i)}
              style={{
                width: '12px', height: '12px', borderRadius: '50%', padding: 0,
                background: i === activeIndex ? 'var(--color-teal)' : 'var(--color-slate-300)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)'
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
