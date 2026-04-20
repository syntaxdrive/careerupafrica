import { Award } from 'lucide-react'
import './Testimonials.css'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Amara K.',
      role: 'Operations Professional',
      company: 'Cohort 2',
      text: 'This was different. Not just another course certificate. I executed real tasks, got honest feedback during my 6-week shadowing, and earned a badge that shows what I can actually do.',
      badge: 'High Performer Badge'
    },
    {
      name: 'David O.',
      role: 'Founder',
      company: 'EdTech Startup',
      text: 'CareerUp Africa gave me access to vetted talent from their active cohort. They execute, I review, and we both know if it works before hiring. Structured and clear.',
      badge: null
    },
    {
      name: 'Grace M.',
      role: 'Content Strategist',
      company: 'Cohort 1',
      text: 'I took courses for months but could not demonstrate competence. Here, I proved it through 6-week shadowing. Founders see my verified work history, not my resume.',
      badge: 'Top Executor Badge'
    }
  ]

  return (
    <section className="testimonials">
      <div className="container">
        <h2>What They Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div>
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                  <div className="author-company">{testimonial.company}</div>
                </div>
                {testimonial.badge && (
                  <div className="earned-badge">
                    <Award size={16} style={{ marginRight: '4px' }} /> {testimonial.badge}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
