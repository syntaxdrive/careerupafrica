import type { FounderForMatching } from '../../lib/matchingService';
import './MatchingComponents.css';

interface FounderCardProps {
  founder: FounderForMatching;
  isSelected: boolean;
  onSelect: () => void;
}

export default function FounderCard({ founder, isSelected, onSelect }: FounderCardProps) {
  return (
    <div
      className={`founder-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="card-header">
        <h4>{founder.fullName}</h4>
        {founder.matchCount > 0 && (
          <span className="match-count-badge">{founder.matchCount} active</span>
        )}
      </div>

      {founder.companyName && (
        <div className="company-info">
          <span className="company-name">{founder.companyName}</span>
          {founder.industry && (
            <span className="industry-tag">{founder.industry}</span>
          )}
        </div>
      )}

      {founder.bio && (
        <p className="card-bio">{founder.bio}</p>
      )}

      {founder.helpNeeded && (
        <div className="help-needed">
          <span className="label">Help Needed:</span>
          <p className="help-text">{founder.helpNeeded}</p>
        </div>
      )}

      {isSelected && (
        <div className="selected-indicator">
          ✓ Selected
        </div>
      )}
    </div>
  );
}
