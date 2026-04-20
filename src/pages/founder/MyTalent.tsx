import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getFounderTalent, type TalentWithMetrics } from '../../lib/talentService';
import './MyTalent.css';

const MyTalent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [talent, setTalent] = useState<TalentWithMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTalent();
  }, [user]);

  const loadTalent = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getFounderTalent(user.id);
      setTalent(data);
      setError('');
    } catch (err) {
      console.error('Error loading talent:', err);
      setError('Failed to load your matched talent');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date().getTime();
    const date = new Date(dateString).getTime();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(dateString);
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return 'excellent';
    if (rating >= 4.0) return 'good';
    if (rating >= 3.0) return 'average';
    return 'poor';
  };

  if (isLoading) {
    return (
      <div className="my-talent-page">
        <div className="loading-state">Loading your talent...</div>
      </div>
    );
  }

  return (
    <div className="my-talent-page">
      <header className="page-header">
        <div>
          <h1>My Talent</h1>
          <p className="page-subtitle">
            Manage and review your matched participants
          </p>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Summary Stats */}
      {talent.length > 0 && (
        <div className="talent-summary">
          <div className="summary-card">
            <div className="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-value">{talent.length}</div>
              <div className="summary-label">Matched Talent</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M9 12h6m-6 4h6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-value">
                {talent.reduce((acc, t) => acc + t.total_tasks, 0)}
              </div>
              <div className="summary-label">Total Tasks</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-value">
                {talent.reduce((acc, t) => acc + t.badge_eligible_count, 0)}
              </div>
              <div className="summary-label">Badge-Eligible</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-value">
                {talent.reduce((acc, t) => acc + t.submitted_tasks, 0)}
              </div>
              <div className="summary-label">Awaiting Review</div>
            </div>
          </div>
        </div>
      )}

      {/* Talent List */}
      {talent.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              strokeWidth="2"
            />
          </svg>
          <h2>No Matched Talent Yet</h2>
          <p>
            You don't have any matched participants yet. Contact an admin to get matched with
            talent based on your needs.
          </p>
        </div>
      ) : (
        <div className="talent-grid">
          {talent.map((person) => (
            <div key={person.id} className="talent-card">
              {/* Header */}
              <div className="talent-header">
                <div className="talent-avatar">
                  {person.participant_name.charAt(0).toUpperCase()}
                </div>
                <div className="talent-info">
                  <h3>{person.participant_name}</h3>
                  <p className="talent-email">{person.participant_email}</p>
                </div>
              </div>

              {/* Bio */}
              {person.bio && <p className="talent-bio">{person.bio}</p>}

              {/* Skills */}
              {person.skills.length > 0 && (
                <div className="talent-skills">
                  {person.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                  {person.skills.length > 4 && (
                    <span className="skill-badge more">+{person.skills.length - 4}</span>
                  )}
                </div>
              )}

              {/* Performance Metrics */}
              <div className="talent-metrics">
                <div className="metric-row">
                  <span className="metric-label">Overall Rating:</span>
                  <span className={`metric-value rating-${getRatingColor(person.average_rating)}`}>
                    {person.average_rating > 0 ? (
                      <>
                        {person.average_rating.toFixed(1)}/5.0
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </>
                    ) : (
                      'No rating yet'
                    )}
                  </span>
                </div>

                <div className="metric-row">
                  <span className="metric-label">Tasks Completed:</span>
                  <span className="metric-value">
                    {person.completed_tasks} / {person.total_tasks}
                  </span>
                </div>

                <div className="metric-row">
                  <span className="metric-label">Badge-Eligible:</span>
                  <span className="metric-value badge-count">
                    {person.badge_eligible_count > 0 ? (
                      <>
                        {person.badge_eligible_count}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </>
                    ) : (
                      'None'
                    )}
                  </span>
                </div>

                {person.last_activity && (
                  <div className="metric-row">
                    <span className="metric-label">Last Activity:</span>
                    <span className="metric-value">{getTimeAgo(person.last_activity)}</span>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="talent-status">
                {person.submitted_tasks > 0 && (
                  <span className="status-badge pending">
                    {person.submitted_tasks} Awaiting Review
                  </span>
                )}
                {person.in_progress_tasks > 0 && (
                  <span className="status-badge progress">
                    {person.in_progress_tasks} In Progress
                  </span>
                )}
                <span className="status-badge availability">
                  {person.availability_hours}h/week
                </span>
              </div>

              {/* Actions */}
              <div className="talent-actions">
                <button
                  className="btn-action primary"
                  onClick={() => navigate(`/tasks/create?participant=${person.participant_id}`)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Create Task
                </button>
                <button
                  className="btn-action secondary"
                  onClick={() => navigate(`/tasks?participant=${person.participant_id}`)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  View Tasks
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTalent;
