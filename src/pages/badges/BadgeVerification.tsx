import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getParticipantBadgeById, type ParticipantBadgeWithDetails } from '../../lib/badgeService';
import './BadgeVerification.css';

export default function BadgeVerification() {
  const { badgeId } = useParams<{ badgeId: string }>();
  const [badge, setBadge] = useState<ParticipantBadgeWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (badgeId) {
      loadBadge();
    }
  }, [badgeId]);

  const loadBadge = async () => {
    if (!badgeId) return;

    try {
      setIsLoading(true);
      const data = await getParticipantBadgeById(badgeId);
      
      if (!data) {
        setError('Badge not found or verification ID is invalid');
      } else {
        setBadge(data);
        setError('');
      }
    } catch (err) {
      console.error('Error verifying badge:', err);
      setError('Failed to verify badge. Please check the verification link.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="badge-verification-page">
        <div className="verification-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Verifying badge...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !badge) {
    return (
      <div className="badge-verification-page">
        <div className="verification-container">
          <div className="verification-error">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <h1>Verification Failed</h1>
            <p>{error || 'Badge not found or verification ID is invalid'}</p>
            <div className="error-details">
              <p className="small">This could mean:</p>
              <ul>
                <li>The verification link is incorrect or expired</li>
                <li>The badge has been revoked</li>
                <li>The badge ID doesn't exist in our system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="badge-verification-page">
      <div className="verification-container">
        {/* Verified Badge */}
        <div className="verification-success">
          <div className="verified-checkmark">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h1>Badge Verified ✓</h1>
          <p className="verification-subtitle">
            This badge has been independently verified as authentic
          </p>
        </div>

        {/* Badge Details */}
        <div className="verified-badge-card">
          <div className="badge-main-info">
            <div className="verified-badge-icon" dangerouslySetInnerHTML={{ __html: badge.badge_icon }} />
            <div className="verified-badge-details">
              <span className="verified-category">{badge.badge_category}</span>
              <h2>{badge.badge_name}</h2>
              <p className="verified-description">{badge.badge_description}</p>
            </div>
          </div>

          <div className="verification-divider"></div>

          {/* Recipient Info */}
          <div className="verification-section">
            <h3>Awarded To</h3>
            <div className="recipient-info">
              <div className="recipient-avatar">
                {badge.participant_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="recipient-name">{badge.participant_name}</p>
                <p className="recipient-email">{badge.participant_email}</p>
              </div>
            </div>
          </div>

          <div className="verification-divider"></div>

          {/* Validation Info */}
          <div className="verification-section">
            <h3>Validation Details</h3>
            <div className="validation-grid">
              <div className="validation-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div>
                  <span className="validation-label">Date Awarded</span>
                  <span className="validation-value">{formatDate(badge.validated_at)}</span>
                </div>
              </div>

              <div className="validation-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div>
                  <span className="validation-label">Validated By</span>
                  <span className="validation-value">{badge.validator_name}</span>
                </div>
              </div>

              <div className="validation-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div>
                  <span className="validation-label">Issued By</span>
                  <span className="validation-value">CareerUp Africa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="verification-divider"></div>

          {/* Earning Criteria */}
          <div className="verification-section">
            <h3>How This Badge Was Earned</h3>
            <p className="criteria-info">{badge.badge_criteria}</p>
          </div>

          {/* Work Completed */}
          {badge.task_titles && badge.task_titles.length > 0 && (
            <>
              <div className="verification-divider"></div>
              <div className="verification-section">
                <h3>Work Validated ({badge.task_titles.length} Task{badge.task_titles.length !== 1 ? 's' : ''})</h3>
                <ul className="work-list">
                  {badge.task_titles.map((title, index) => (
                    <li key={index}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      {title}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Validator Notes */}
          {badge.validation_notes && (
            <>
              <div className="verification-divider"></div>
              <div className="verification-section validator-notes">
                <h3>Validator's Notes</h3>
                <p className="notes-content">{badge.validation_notes}</p>
                <p className="notes-signature">— {badge.validator_name}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="verification-footer">
          <div className="footer-logo">
            <h2>CareerUp Africa</h2>
            <p>Proof Over Potential</p>
          </div>
          <div className="footer-info">
            <p>
              This badge was issued through CareerUp Africa's competence validation platform. 
              CareerUp Africa connects early-career talent with founders through real work, 
              structured feedback, and validated badges.
            </p>
            <p className="verification-id">
              Verification ID: <code>{badge.id}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
