import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Badge, ParticipantBadgeWithDetails } from '../../lib/badgeService';
import './BadgeCard.css';

interface BadgeCardProps {
  badge?: Badge;
  participantBadge?: ParticipantBadgeWithDetails;
  variant?: 'grid' | 'list' | 'mini';
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  participantBadge,
  variant = 'grid',
  showActions = false,
  onEdit,
  onDelete,
  onClick,
}) => {
  const navigate = useNavigate();

  // Determine which data to use
  const badgeData = participantBadge || badge;
  const name = participantBadge ? participantBadge.badge_name : badge?.name;
  const description = participantBadge ? participantBadge.badge_description : badge?.description;
  const icon = participantBadge ? participantBadge.badge_icon : badge?.icon;
  const category = participantBadge ? participantBadge.badge_category : badge?.category;

  if (!badgeData) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (participantBadge) {
      navigate(`/badges/${participantBadge.id}`);
    } else if (badge) {
      navigate(`/admin/badges/${badge.id}`);
    }
  };

  return (
    <div 
      className={`badge-card badge-card-${variant} ${onClick || participantBadge || badge ? 'clickable' : ''}`}
      onClick={handleCardClick}
    >
      {/* Badge Icon/Image */}
      <div className="badge-icon-container">
        {icon ? (
          <div 
            className="badge-icon" 
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        ) : (
          <div className="badge-icon-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
        {category && (
          <span className="badge-category">{category}</span>
        )}
      </div>

      {/* Badge Info */}
      <div className="badge-info">
        <h3 className="badge-name">{name}</h3>
        {description && variant !== 'mini' && (
          <p className="badge-description">{description}</p>
        )}

        {/* Participant Badge Details */}
        {participantBadge && (
          <div className="badge-details">
            <div className="badge-detail-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>Earned {formatDate(participantBadge.validated_at)}</span>
            </div>
            
            {participantBadge.validator_name && (
              <div className="badge-detail-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Validated by {participantBadge.validator_name}</span>
              </div>
            )}

            {participantBadge.task_titles && participantBadge.task_titles.length > 0 && (
              <div className="badge-detail-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>{participantBadge.task_titles.length} Task{participantBadge.task_titles.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (badge) && (onEdit || onDelete) && (
          <div className="badge-actions" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <button 
                className="btn-action-secondary"
                onClick={onEdit}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" />
                </svg>
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="btn-action-danger"
                onClick={onDelete}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" />
                </svg>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
