import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './FAQ.css'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "Do I need prior work experience to apply?",
    answer: "No. You only need proof of learning — a course, certification, or demonstrable skill."
  },
  {
    question: "Is the placement paid?",
    answer: "Some partner companies provide a support stipend during placement, while others may not. You'll always be informed upfront before accepting a placement."
  },
  {
    question: "How long is a placement?",
    answer: "Placements are 4–6 weeks, structured and time-bound."
  },
  {
    question: "Who can apply?",
    answer: "Anyone — fresh graduates, late starters, career switchers, people with disabilities. Age is not a barrier."
  },
  {
    question: "What do companies get?",
    answer: "Access to pre-skilled, vetted, emerging talent they can evaluate before committing to a full-time hire."
  },
  {
    question: "Is CareerUp Africa free for talents?",
    answer: "Yes. Talents join at no cost."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <ChevronDown 
                  className={`faq-icon ${openIndex === index ? 'rotate' : ''}`} 
                  size={24} 
                />
              </div>
              <div 
                className="faq-answer-wrapper"
                style={{ 
                  maxHeight: openIndex === index ? '200px' : '0',
                  opacity: openIndex === index ? 1 : 0
                }}
              >
                <p className="faq-answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}