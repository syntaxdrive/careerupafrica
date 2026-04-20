import './ProblemSection.css'

export default function ProblemSection() {
  return (
    <section className="problem-section">
      <div className="container">
        <h2 className="section-title">The Problem We're Solving</h2>
        <p className="section-subtitle">
          Millions of skilled Africans are stuck in a loop: no experience means no job, and no job means no experience.
        </p>

        <div className="problem-grid">
          <div className="problem-card">
            <h3 className="problem-stat">65%</h3>
            <p className="problem-desc">of entry-level jobs in Africa require 2+ years of prior experience</p>
          </div>
          <div className="problem-card">
            <h3 className="problem-stat">53%</h3>
            <p className="problem-desc">of African graduates struggle to secure their first job within 2 years</p>
          </div>
          <div className="problem-card">
            <h3 className="problem-stat">12M+</h3>
            <p className="problem-desc">young Africans enter the job market every year with limited pathways</p>
          </div>
        </div>
      </div>
    </section>
  )
}