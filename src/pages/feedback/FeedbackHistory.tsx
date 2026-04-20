import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import {
  getFeedbackByParticipant,
  getParticipantFeedbackStats,
} from '../../lib/feedbackService';
import type { FeedbackWithDetails, FeedbackStats } from '../../lib/feedbackService';
import FeedbackCard from '../../components/feedback/FeedbackCard';
import RatingScale from '../../components/feedback/RatingScale';
import './FeedbackHistory.css';

const FeedbackHistory: React.FC = () => {
  const { user } = useAuthStore();
  const [feedbackList, setFeedbackList] = useState<FeedbackWithDetails[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'badge_eligible' | 'revision_needed'>('all');

  useEffect(() => {
    loadFeedbackData();
  }, [user]);

  const loadFeedbackData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [feedback, statistics] = await Promise.all([
        getFeedbackByParticipant(user.id),
        getParticipantFeedbackStats(user.id),
      ]);

      setFeedbackList(feedback);
      setStats(statistics);
    } catch (err) {
      console.error('Error loading feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredFeedback = (): FeedbackWithDetails[] => {
    switch (filter) {
      case 'badge_eligible':
        return feedbackList.filter((f) => f.badge_eligible);
      case 'revision_needed':
        return feedbackList.filter((f) => f.revision_needed);
      default:
        return feedbackList;
    }
  };

  const filteredFeedback = getFilteredFeedback();

  if (isLoading) {
    return (
      <div className="feedback-history-page">
        <div className="loading-state">Loading your feedback history...</div>
      </div>
    );
  }

  if (!stats || feedbackList.length === 0) {
    return (
      <div className="feedback-history-page">
        <header className="page-header">
          <h1>Feedback History</h1>
          <p className="page-subtitle">Track your performance and improvement over time</p>
        </header>

        <div className="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <h2>No Feedback Yet</h2>
          <p>
            You haven't received any feedback yet. Complete and submit tasks to receive
            performance evaluations from founders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-history-page">
      <header className="page-header">
        <h1>Feedback History</h1>
        <p className="page-subtitle">Track your performance and improvement over time</p>
      </header>

      {/* Statistics Cards */}
      <div className="stats-overview">
        <div className="stat-card overall-stat">
          <div className="stat-header">
            <h3>Overall Performance</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <RatingScale value={stats.average_overall} readonly={true} size="large" />
          <div className="stat-details">
            <span>{stats.total_feedback} evaluations</span>
          </div>
        </div>

        <div className="stat-card">
          <h4>Understanding</h4>
          <div className="stat-value">{stats.average_understanding.toFixed(1)}/5</div>
          <RatingScale
            value={stats.average_understanding}
            readonly={true}
            size="small"
            showLabel={false}
          />
        </div>

        <div className="stat-card">
          <h4>Execution</h4>
          <div className="stat-value">{stats.average_execution.toFixed(1)}/5</div>
          <RatingScale
            value={stats.average_execution}
            readonly={true}
            size="small"
            showLabel={false}
          />
        </div>

        <div className="stat-card">
          <h4>Communication</h4>
          <div className="stat-value">{stats.average_communication.toFixed(1)}/5</div>
          <RatingScale
            value={stats.average_communication}
            readonly={true}
            size="small"
            showLabel={false}
          />
        </div>

        <div className="stat-card">
          <h4>Timeliness</h4>
          <div className="stat-value">{stats.average_timeliness.toFixed(1)}/5</div>
          <RatingScale
            value={stats.average_timeliness}
            readonly={true}
            size="small"
            showLabel={false}
          />
        </div>

        <div className="stat-card">
          <h4>Attention to Detail</h4>
          <div className="stat-value">{stats.average_attention.toFixed(1)}/5</div>
          <RatingScale
            value={stats.average_attention}
            readonly={true}
            size="small"
            showLabel={false}
          />
        </div>
      </div>

      {/* Achievement Highlights */}
      <div className="achievement-highlights">
        <div className="highlight-card badge-eligible-card">
          <div className="highlight-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div className="highlight-content">
            <div className="highlight-value">{stats.badge_eligible_count}</div>
            <div className="highlight-label">Badge-Eligible Work</div>
          </div>
        </div>

        <div className="highlight-card revision-card">
          <div className="highlight-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div className="highlight-content">
            <div className="highlight-value">{stats.revision_needed_count}</div>
            <div className="highlight-label">Revisions Requested</div>
          </div>
        </div>

        <div className="highlight-card success-card">
          <div className="highlight-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="highlight-content">
            <div className="highlight-value">
              {stats.total_feedback - stats.revision_needed_count}
            </div>
            <div className="highlight-label">Approved Submissions</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="feedback-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Feedback ({feedbackList.length})
        </button>
        <button
          className={`filter-btn ${filter === 'badge_eligible' ? 'active' : ''}`}
          onClick={() => setFilter('badge_eligible')}
        >
          Badge-Eligible ({feedbackList.filter((f) => f.badge_eligible).length})
        </button>
        <button
          className={`filter-btn ${filter === 'revision_needed' ? 'active' : ''}`}
          onClick={() => setFilter('revision_needed')}
        >
          Revisions ({feedbackList.filter((f) => f.revision_needed).length})
        </button>
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              showTaskTitle={true}
              showParticipantInfo={false}
              showFounderInfo={true}
            />
          ))
        ) : (
          <div className="empty-filter-state">
            <p>No feedback matches the selected filter.</p>
          </div>
        )}
      </div>

      {/* Improvement Tips */}
      {stats.average_overall < 4 && (
        <div className="improvement-tips">
          <h3>Tips for Improvement</h3>
          <div className="tips-grid">
            {stats.average_understanding < 4 && (
              <div className="tip-card">
                <strong>Understanding Requirements</strong>
                <p>
                  Read task descriptions carefully. Ask clarifying questions before starting.
                  Break down complex requirements into smaller parts.
                </p>
              </div>
            )}
            {stats.average_execution < 4 && (
              <div className="tip-card">
                <strong>Execution Quality</strong>
                <p>
                  Double-check your work before submitting. Test thoroughly. Follow best
                  practices and standards.
                </p>
              </div>
            )}
            {stats.average_communication < 4 && (
              <div className="tip-card">
                <strong>Communication</strong>
                <p>
                  Be clear and concise. Provide context. Update stakeholders proactively.
                  Document your decisions.
                </p>
              </div>
            )}
            {stats.average_timeliness < 4 && (
              <div className="tip-card">
                <strong>Timeliness</strong>
                <p>
                  Plan your time effectively. Break tasks into milestones. Communicate early
                  if you need more time.
                </p>
              </div>
            )}
            {stats.average_attention < 4 && (
              <div className="tip-card">
                <strong>Attention to Detail</strong>
                <p>
                  Review your work multiple times. Look for edge cases. Pay attention to
                  formatting and presentation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackHistory;
