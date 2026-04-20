import React from 'react';
import type { FeedbackWithDetails } from '../../lib/feedbackService';
import RatingScale from './RatingScale';
import './FeedbackCard.css';

interface FeedbackCardProps {
  feedback: FeedbackWithDetails;
  showTaskTitle?: boolean;
  showParticipantInfo?: boolean;
  showFounderInfo?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  showTaskTitle = true,
  showParticipantInfo = false,
  showFounderInfo = true,
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCriteriaAverage = (): number => {
    return (
      (feedback.understanding_rating +
        feedback.execution_rating +
        feedback.communication_rating +
        feedback.timeliness_rating +
        feedback.attention_rating) /
      5
    );
  };

  return (
    <div className="feedback-card">
      {/* Header */}
      <div className="feedback-header">
        <div className="feedback-title-section">
          {showTaskTitle && feedback.task_title && (
            <h3 className="feedback-task-title">{feedback.task_title}</h3>
          )}
          <div className="feedback-meta">
            {showParticipantInfo && feedback.participant_name && (
              <span className="feedback-participant">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                {feedback.participant_name}
              </span>
            )}
            {showFounderInfo && feedback.founder_name && (
              <span className="feedback-founder">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 9H15M9 13H15M9 17H12" stroke="currentColor" strokeWidth="2" />
                </svg>
                {feedback.founder_name}
                {feedback.founder_company && ` • ${feedback.founder_company}`}
              </span>
            )}
            <span className="feedback-date">{formatDate(feedback.created_at)}</span>
          </div>
        </div>

        <div className="feedback-badges">
          {feedback.badge_eligible && (
            <span className="badge badge-eligible">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
              Badge Eligible
            </span>
          )}
          {feedback.revision_needed && (
            <span className="badge badge-revision">Revision Needed</span>
          )}
        </div>
      </div>

      {/* Overall Rating */}
      <div className="feedback-overall">
        <RatingScale value={feedback.overall_rating} readonly={true} size="large" showLabel={true} />
      </div>

      {/* Criteria Breakdown */}
      <div className="feedback-criteria">
        <h4 className="criteria-title">Performance Criteria</h4>
        <div className="criteria-grid">
          <div className="criteria-item">
            <label>Understanding of Requirements</label>
            <RatingScale
              value={feedback.understanding_rating}
              readonly={true}
              size="small"
              showLabel={false}
            />
            <span className="criteria-value">{feedback.understanding_rating}/5</span>
          </div>

          <div className="criteria-item">
            <label>Execution Quality</label>
            <RatingScale
              value={feedback.execution_rating}
              readonly={true}
              size="small"
              showLabel={false}
            />
            <span className="criteria-value">{feedback.execution_rating}/5</span>
          </div>

          <div className="criteria-item">
            <label>Communication</label>
            <RatingScale
              value={feedback.communication_rating}
              readonly={true}
              size="small"
              showLabel={false}
            />
            <span className="criteria-value">{feedback.communication_rating}/5</span>
          </div>

          <div className="criteria-item">
            <label>Timeliness</label>
            <RatingScale
              value={feedback.timeliness_rating}
              readonly={true}
              size="small"
              showLabel={false}
            />
            <span className="criteria-value">{feedback.timeliness_rating}/5</span>
          </div>

          <div className="criteria-item">
            <label>Attention to Detail</label>
            <RatingScale
              value={feedback.attention_rating}
              readonly={true}
              size="small"
              showLabel={false}
            />
            <span className="criteria-value">{feedback.attention_rating}/5</span>
          </div>

          <div className="criteria-item criteria-average">
            <label>Average Criteria Score</label>
            <div className="average-score">{getCriteriaAverage().toFixed(1)}/5</div>
          </div>
        </div>
      </div>

      {/* Written Feedback */}
      <div className="feedback-comments">
        <h4 className="comments-title">Detailed Feedback</h4>
        <p className="comments-text">{feedback.comments}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;
