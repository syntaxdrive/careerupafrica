import './WhatIsWep.css'

export default function WhatIsWep() {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="what-is-wep-section">
      <div className="container">
        <div className="wep-content">
          <h2 className="section-title">What is a Work Experience Placement?</h2>
          <p className="wep-text">
            A WEP is a short-term, structured placement (4–6 weeks) where you contribute to real business tasks inside a startup. It is not shadowing. It is not fetching tea. It is real work, real feedback, and a verified record of your performance. No prior experience required — just proof of skill.
          </p>
          <button className="btn-pop btn-pop-primary wep-btn" onClick={scrollToWaitlist}>Apply Now</button>
        </div>
      </div>
    </section>
  )
}