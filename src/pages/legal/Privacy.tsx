import './Legal.css';

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="legal-subtitle">
            How we collect, use, and protect your data
          </p>
        </header>

        <div className="legal-content">
          <section className="legal-section">
            <p>
              <strong>Effective Date:</strong> February 13, 2026<br />
              <strong>Last Updated:</strong> February 13, 2026
            </p>

            <p>
              CareerUp Africa ("we," "us," or "our") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>1. Information We Collect</h2>

            <h3>1.1 Information You Provide</h3>
            <p>We collect information you voluntarily provide when you:</p>
            <ul>
              <li>Create an account (name, email, password)</li>
              <li>Complete your profile (LinkedIn URL, skills, experience)</li>
              <li>Submit applications (talent or founder applications)</li>
              <li>Upload deliverables or work samples</li>
              <li>Provide feedback on tasks</li>
              <li>Contact us through forms or email</li>
            </ul>

            <h3>1.2 Information Collected Automatically</h3>
            <p>When you use our platform, we automatically collect:</p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>IP address and general location data</li>
              <li>Cookies and similar technologies (see Section 6)</li>
            </ul>

            <h3>1.3 Information from Third Parties</h3>
            <p>We may receive information from:</p>
            <ul>
              <li>LinkedIn (when you provide your LinkedIn profile URL)</li>
              <li>Authentication providers (if we implement social login)</li>
              <li>Payment processors (if applicable)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Information</h2>

            <p>We use your information to:</p>
            
            <h3>2.1 Provide Our Services</h3>
            <ul>
              <li>Create and manage your account</li>
              <li>Process applications and vet candidates</li>
              <li>Match talent with founders</li>
              <li>Facilitate task assignments and submissions</li>
              <li>Provide structured feedback</li>
              <li>Issue and verify badges</li>
            </ul>

            <h3>2.2 Communicate with You</h3>
            <ul>
              <li>Send application status updates</li>
              <li>Notify you of task assignments and deadlines</li>
              <li>Deliver feedback and badge notifications</li>
              <li>Respond to your inquiries</li>
              <li>Send administrative announcements</li>
            </ul>

            <h3>2.3 Improve Our Platform</h3>
            <ul>
              <li>Analyze usage patterns and trends</li>
              <li>Identify and fix technical issues</li>
              <li>Develop new features</li>
              <li>Conduct research and analytics</li>
            </ul>

            <h3>2.4 Ensure Security and Compliance</h3>
            <ul>
              <li>Prevent fraud and abuse</li>
              <li>Enforce our Terms of Service</li>
              <li>Comply with legal obligations</li>
              <li>Protect the rights and safety of our users</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Share Your Information</h2>

            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>

            <h3>3.1 Within the Platform</h3>
            <ul>
              <li><strong>Matched Founders:</strong> When you're matched with a founder, they can see your name, profile details, and work submissions</li>
              <li><strong>Matched Talent:</strong> When a founder is matched with talent, they can see the talent's profile and work history</li>
              <li><strong>Admins:</strong> Our admin team can access your information to facilitate matching, review work, and award badges</li>
              <li><strong>Badge Verification:</strong> When you earn a badge, the verification details (your name, badge details, validated work) are publicly accessible via the verification URL</li>
            </ul>

            <h3>3.2 Service Providers</h3>
            <p>We share information with third-party service providers who help us operate our platform:</p>
            <ul>
              <li>Hosting and infrastructure (Supabase, Vercel, etc.)</li>
              <li>Email delivery services</li>
              <li>Analytics providers</li>
              <li>Customer support tools</li>
            </ul>
            <p>These providers are contractually obligated to protect your data and use it only for the services they provide to us.</p>

            <h3>3.3 Legal Requirements</h3>
            <p>We may disclose your information if required to:</p>
            <ul>
              <li>Comply with legal processes (court orders, subpoenas)</li>
              <li>Enforce our agreements or policies</li>
              <li>Protect the rights, property, or safety of CareerUp Africa, our users, or others</li>
              <li>Respond to claims of illegal activity or policy violations</li>
            </ul>

            <h3>3.4 Business Transfers</h3>
            <p>
              If CareerUp Africa is involved in a merger, acquisition, or sale of assets, 
              your information may be transferred as part of that transaction. We will notify 
              you via email and/or prominent notice on our platform of any such change.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Data Retention</h2>

            <p>We retain your information for as long as:</p>
            <ul>
              <li>Your account is active</li>
              <li>Needed to provide you with services</li>
              <li>Required to comply with legal obligations</li>
              <li>Necessary to resolve disputes or enforce agreements</li>
            </ul>

            <p>
              When you delete your account, we will delete or anonymize your personal information within 
              90 days, except where we must retain it for legal or compliance reasons.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Your Privacy Rights</h2>

            <h3>5.1 Access and Portability</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>

            <h3>5.2 Correction and Deletion</h3>
            <p>You can:</p>
            <ul>
              <li>Update your profile information at any time through your account settings</li>
              <li>Request deletion of your account and associated data</li>
            </ul>

            <h3>5.3 Communication Preferences</h3>
            <p>You can:</p>
            <ul>
              <li>Opt out of non-essential emails (marketing, newsletters)</li>
              <li>Note: You cannot opt out of essential service emails (application status, task assignments)</li>
            </ul>

            <h3>5.4 Objection and Restriction</h3>
            <p>You can:</p>
            <ul>
              <li>Object to processing of your data for certain purposes</li>
              <li>Request restriction of processing in specific circumstances</li>
            </ul>

            <p>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:privacy@careerup.africa">privacy@careerup.africa</a>. 
              We will respond within 30 days.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Cookies and Tracking Technologies</h2>

            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Understand how you use our platform</li>
              <li>Improve user experience</li>
            </ul>

            <p>Types of cookies we use:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the platform to function (authentication, session management)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
            </ul>

            <p>
              You can control cookies through your browser settings, but disabling essential cookies 
              may prevent you from using certain features of our platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Data Security</h2>

            <p>We implement appropriate technical and organizational measures to protect your information:</p>
            <ul>
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Encryption at rest for sensitive data</li>
              <li>Access controls and authentication</li>
              <li>Regular security audits</li>
              <li>Secure hosting infrastructure</li>
            </ul>

            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>

            <p>
              CareerUp Africa is not intended for users under the age of 18. We do not knowingly 
              collect personal information from children. If we learn that we have collected 
              information from a child under 18, we will delete it promptly.
            </p>

            <p>
              If you believe we have collected information from a child, please contact us at{' '}
              <a href="mailto:privacy@careerup.africa">privacy@careerup.africa</a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. International Data Transfers</h2>

            <p>
              CareerUp Africa operates in Africa. If you access our platform from outside Africa, 
              your information may be transferred to, stored, and processed in the region where our 
              servers are located.
            </p>

            <p>
              By using our platform, you consent to the transfer of your information to these locations. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to This Privacy Policy</h2>

            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or for legal, regulatory, or operational reasons.
            </p>

            <p>
              When we make material changes, we will:
            </p>
            <ul>
              <li>Update the "Last Updated" date at the top of this policy</li>
              <li>Notify you via email</li>
              <li>Display a prominent notice on our platform</li>
            </ul>

            <p>
              Your continued use of our platform after changes become effective constitutes your 
              acceptance of the revised policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Contact Us</h2>

            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or 
              our data practices, please contact us:
            </p>

            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@careerup.africa">privacy@careerup.africa</a>
            </p>

            <p>
              <strong>General Inquiries:</strong>{' '}
              <a href="mailto:hello@careerup.africa">hello@careerup.africa</a>
            </p>

            <p>
              We will respond to your inquiry within 30 days.
            </p>
          </section>

          <div className="last-updated">
            Last updated: February 13, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
