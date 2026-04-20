import React from 'react';
import './RatingScale.css';

interface RatingScaleProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
}

const RatingScale: React.FC<RatingScaleProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'medium',
  showLabel = true,
  label,
}) => {
  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Below Average';
      case 3:
        return 'Average';
      case 4:
        return 'Good';
      case 5:
        return 'Excellent';
      default:
        return 'Not Rated';
    }
  };

  return (
    <div className={`rating-scale ${readonly ? 'readonly' : 'interactive'} size-${size}`}>
      {label && <div className="rating-label">{label}</div>}
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            className={`star ${rating <= value ? 'filled' : 'empty'}`}
            onClick={() => handleClick(rating)}
            disabled={readonly}
            aria-label={`${rating} star${rating > 1 ? 's' : ''}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill={rating <= value ? '#F97316' : '#E5E7EB'}
                stroke={rating <= value ? '#F97316' : '#9CA3AF'}
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
      {showLabel && (
        <div className="rating-text">
          <span className="rating-value">{value.toFixed(1)}</span>
          <span className="rating-description">{getRatingLabel(Math.round(value))}</span>
        </div>
      )}
    </div>
  );
};

export default RatingScale;
