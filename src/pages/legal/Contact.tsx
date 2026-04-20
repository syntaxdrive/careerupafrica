import { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Legal.css';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      // In demo mode or without email service, just show success
      // In production, this would call an API endpoint to send the email
      console.log('Contact form submission:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>Contact Us</h1>
          <p className="legal-subtitle">
            Have questions? We're here to help
          </p>
        </header>

        <div className="legal-content">
          <section className="about-section">
            <h2>Get in Touch</h2>
            <p>
              Whether you're a prospective talent, founder, or just curious about CareerUp Africa, 
              we'd love to hear from you. Fill out the form below and we'll get back to you as 
              soon as possible.
            </p>

            {success && (
              <div className="success-message">
                <strong>Message sent successfully!</strong> We'll get back to you within 24-48 hours.
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span className="field-error">{errors.name.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <span className="field-error">{errors.email.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  {...register('subject', { required: 'Please select a subject' })}
                >
                  <option value="">Select a topic...</option>
                  <option value="general">General Inquiry</option>
                  <option value="talent">Talent Application Question</option>
                  <option value="founder">Founder Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback or Suggestion</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <span className="field-error">{errors.subject.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 20,
                      message: 'Message must be at least 20 characters'
                    }
                  })}
                  placeholder="Tell us how we can help..."
                />
                {errors.message && (
                  <span className="field-error">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </section>

          <section className="about-section">
            <h2>Other Ways to Reach Us</h2>
            
            <div className="contact-info">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:hello@careerup.africa">hello@careerup.africa</a>
              </p>

              <p>
                <strong>For Founders:</strong>{' '}
                <a href="mailto:founders@careerup.africa">founders@careerup.africa</a>
              </p>

              <p>
                <strong>For Talent:</strong>{' '}
                <a href="mailto:talent@careerup.africa">talent@careerup.africa</a>
              </p>

              <p>
                <strong>Response Time:</strong> We typically respond within 24-48 hours 
                during business days (Monday-Friday, 9 AM - 5 PM EAT).
              </p>
            </div>
          </section>

          <section className="about-section">
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-item">
              <h3>How long does the application review take?</h3>
              <p>
                We review talent applications within 5-7 business days. Founder applications 
                are typically reviewed within 3-5 business days.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do you charge talent to participate?</h3>
              <p>
                No. CareerUp Africa is completely free for talent. We believe in removing 
                barriers to opportunity.
              </p>
            </div>

            <div className="faq-item">
              <h3>How are talents matched with founders?</h3>
              <p>
                Our admin team manually reviews each talent's skills, availability, and 
                interests, then matches them with appropriate founders based on project needs 
                and skill fit.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I verify a badge I received from someone?</h3>
              <p>
                Yes! Every badge has a unique verification URL. Simply ask the person to 
                share their badge verification link, which will show you the full validation 
                details including the work they completed.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
