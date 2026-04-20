import { MessageCircle, Mail } from 'lucide-react'
import './ContactSection.css'

export default function ContactSection() {
  return (
    <section className="contact-section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-grid">
          {/* WhatsApp Card */}
          <a href="https://wa.link/yda0m1" className="contact-card" target="_blank" rel="noopener noreferrer" title="WhatsApp Chat">
            <div className="contact-icon whatsapp-icon">
              <MessageCircle size={32} />
            </div>
            <h3>WhatsApp</h3>
            <p>Chat with us</p>
          </a>

          {/* Email Card */}
          <a href="mailto:hello@careerupafrica.com.ng" className="contact-card" title="Send Email">
            <div className="contact-icon email-icon">
              <Mail size={32} />
            </div>
            <h3>Email</h3>
            <p>hello@careerupafrica.com.ng</p>
          </a>
        </div>
      </div>
    </section>
  )
}