import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParticipantBadgeById, type ParticipantBadgeWithDetails } from '../../lib/badgeService';
import './BadgeDetail.css';

export default function BadgeDetail() {
  const { badgeId } = useParams<{ badgeId: string }>();
  const navigate = useNavigate();
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
        setError('Badge not found');
      } else {
        setBadge(data);
        setError('');
      }
    } catch (err) {
      console.error('Error loading badge:', err);
      setError('Failed to load badge details');
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

  const getVerificationUrl = (): string => {
    return `${window.location.origin}/badges/verify/${badgeId}`;
  };

  const handleShare = () => {
    const shareUrl = getVerificationUrl();
    
    if (navigator.share) {
      navigator.share({
        title: `${badge?.badge_name} Badge`,
        text: `Check out my ${badge?.badge_name} badge from CareerUp Africa!`,
        url: shareUrl,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Verification link copied to clipboard!');
      });
    }
  };

  const handleDownload = () => {
    // For MVP, just open print dialog
    // In the future, this could generate a PDF certificate
    window.print();
  };

  if (isLoading) {
    return (
      <div className="badge-detail-page">
        <div className="loading-state">Loading badge details...</div>
      </div>
    );
  }

  if (error || !badge) {
    return (
      <div className="badge-detail-page">
        <div className="error-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" />
          </svg>
          <h2>{error || 'Badge not found'}</h2>
          <button 
            className="btn-primary"
            onClick={() => navigate('/badges')}
          >
            ← Back to Badges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="badge-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/badges')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" />
          </svg>
          Back to Badges
        </button>
      </div>

      {/* Badge Hero */}
      <div className="badge-hero">
        <div className="badge-icon-large" dangerouslySetInnerHTML={{ __html: badge.badge_icon }} />
        <div className="badge-hero-info">
          <span className="badge-category-tag">{badge.badge_category}</span>
          <h1>{badge.badge_name}</h1>
          <p className="badge-description-large">{badge.badge_description}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button className="btn-action" onClick={handleShare}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke="currentColor" strokeWidth="2" />
          </svg>
          Share Badge
        </button>
        <button className="btn-action" onClick={handleDownload}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" />
          </svg>
          Download Certificate
        </button>
        <button 
          className="btn-action"
          onClick={() => navigate(`/badges/verify/${badgeId}`)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
          </svg>
          View Verification
        </button>
      </div>

      {/* Content Grid */}
      <div className="detail-grid">
        {/* Left Column */}
        <div className="detail-column">
          {/* Validation Info */}
          <div className="detail-card">
            <h2>Validation Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div>
                  <span className="info-label">Awarded On</span>
                  <span className="info-value">{formatDate(badge.validated_at)}</span>
                </div>
              </div>

              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div>
                  <span className="info-label">Validated By</span>
                  <span className="info-value">{badge.validator_name}</span>
                </div>
              </div>

              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div>
                  <span className="info-label">Tasks Completed</span>
                  <span className="info-value">{badge.task_titles.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Earning Criteria */}
          <div className="detail-card">
            <h2>How This Badge is Earned</h2>
            <p className="criteria-text">{badge.badge_criteria}</p>
          </div>

          {/* Validation Notes */}
          {badge.validation_notes && (
            <div className="detail-card validation-notes">
              <h2>Validator's Notes</h2>
              <p className="notes-text">{badge.validation_notes}</p>
              <div className="notes-signature">
                 - {badge.validator_name}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="detail-column">
          {/* Tasks That Earned This Badge */}
          <div className="detail-card">
            <h2>Work That Earned This Badge</h2>
            <div className="tasks-list">
              {badge.task_titles.length === 0 ? (
                <p className="empty-text">No tasks linked to this badge.</p>
              ) : (
                badge.task_titles.map((title, index) => (
                  <div key={index} className="task-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="#10b981" />
                    </svg>
                    <span>{title}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Verification Box */}
          <div className="detail-card verification-box">
            <h2>Verification</h2>
            <p className="verification-text">
              This badge can be independently verified. Share the verification link with employers or clients to prove your competence.
            </p>
            <div className="verification-url">
              <input 
                type="text" 
                readOnly 
                value={getVerificationUrl()}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button 
                className="btn-copy"
                onClick={() => {
                  navigator.clipboard.writeText(getVerificationUrl());
                  alert('Link copied!');
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate View (Print Only) */}
      <div className="certificate print-only">
        <div className="certificate-border">
          <div className="certificate-content">
            <h1 className="certificate-title">Certificate of Competence</h1>
            <div className="certificate-badge-icon" dangerouslySetInnerHTML={{ __html: badge.badge_icon }} />
            <h2 className="certificate-badge-name">{badge.badge_name}</h2>
            <p className="certificate-awarded-to">This certifies that</p>
            <h3 className="certificate-participant-name">{badge.participant_name}</h3>
            <p className="certificate-description">
              has successfully demonstrated competence in {badge.badge_category} through validated work on the CareerUp Africa platform.
            </p>
            <div className="certificate-footer">
              <div className="certificate-date">
                <p>Awarded: {formatDate(badge.validated_at)}</p>
              </div>
              <div className="certificate-validator">
                <p>Validated by: {badge.validator_name}</p>
              </div>
            </div>
            <div className="certificate-verification">
              <p>Verify at: {getVerificationUrl()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
