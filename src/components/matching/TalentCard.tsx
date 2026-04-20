import type { ParticipantForMatching } from '../../lib/matchingService';
import './MatchingComponents.css';

interface TalentCardProps {
  participant: ParticipantForMatching;
  isSelected: boolean;
  onSelect: () => void;
}

export default function TalentCard({ participant, isSelected, onSelect }: TalentCardProps) {
  return (
    <div
      className={`talent-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="card-header">
        <h4>{participant.fullName}</h4>
        {participant.cohortName && (
          <span className="cohort-badge">{participant.cohortName}</span>
        )}
      </div>

      {participant.bio && (
        <p className="card-bio">{participant.bio}</p>
      )}

      <div className="card-skills">
        {participant.skills.slice(0, 5).map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
        {participant.skills.length > 5 && (
          <span className="skill-tag more">+{participant.skills.length - 5} more</span>
        )}
      </div>

      <div className="card-footer">
        {participant.availabilityHoursPerWeek && (
          <div className="availability">
            <span className="label">Availability:</span>
            <span className="value">{participant.availabilityHoursPerWeek}h/week</span>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="selected-indicator">
          ✓ Selected
        </div>
      )}
    </div>
  );
}
