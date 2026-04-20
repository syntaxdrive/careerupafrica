import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  getAllBadges,
  awardBadge,
  getBadgeEligibleTasks,
  getParticipantBadges,
  type Badge,
  type AwardBadgeData,
} from '../../lib/badgeService';
import BadgeCard from '../../components/badges/BadgeCard';
import './AwardBadge.css';

interface EligibleTask {
  id: string;
  title: string;
  description: string;
  participant_id: string;
  participant_name: string;
  participant_email: string;
  average_rating: number;
  updated_at: string;
}

export default function AwardBadge() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [eligibleTasks, setEligibleTasks] = useState<EligibleTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>(searchParams.get('badge_id') || '');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [validationNotes, setValidationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participantBadges, setParticipantBadges] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedParticipant) {
      loadParticipantBadges();
    }
  }, [selectedParticipant]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [badgesData, tasksData] = await Promise.all([
        getAllBadges(),
        getBadgeEligibleTasks(),
      ]);
      
      setBadges(badgesData);
      setEligibleTasks(tasksData);
      setError('');
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadParticipantBadges = async () => {
    if (!selectedParticipant) return;
    
    try {
      const badges = await getParticipantBadges(selectedParticipant);
      setParticipantBadges(badges.map(pb => pb.badge_id));
    } catch (err) {
      console.error('Error loading participant badges:', err);
    }
  };

  const handleAwardBadge = async () => {
    if (!selectedParticipant || !selectedBadgeId || selectedTaskIds.length === 0 || !user) {
      setError('Please select participant, badge, and at least one task');
      return;
    }

    if (participantBadges.includes(selectedBadgeId)) {
      setError('This participant already has this badge');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const awardData: AwardBadgeData = {
        participant_id: selectedParticipant,
        badge_id: selectedBadgeId,
        task_ids: selectedTaskIds,
        validation_notes: validationNotes,
      };

      await awardBadge(awardData, user.id);
      
      setSuccess('Badge awarded successfully!');
      
      // Reset form
      setTimeout(() => {
        setSelectedParticipant('');
        setSelectedBadgeId('');
        setSelectedTaskIds([]);
        setValidationNotes('');
        setSuccess('');
        loadData();
      }, 2000);
    } catch (err: any) {
      console.error('Error awarding badge:', err);
      setError(err.message || 'Failed to award badge');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const participants = Array.from(
    new Map(
      eligibleTasks.map(t => [t.participant_id, { id: t.participant_id, name: t.participant_name, email: t.participant_email }])
    ).values()
  );

  const participantTasks = selectedParticipant
    ? eligibleTasks.filter(t => t.participant_id === selectedParticipant)
    : [];

  const selectedBadge = badges.find(b => b.id === selectedBadgeId);

  if (isLoading) {
    return (
      <div className="award-badge-page">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="award-badge-page">
      <header className="page-header">
        <div>
          <h1>Award Badge</h1>
          <p className="page-subtitle">
            Review badge-eligible work and award competence badges
          </p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/admin/badges')}
        >
          ← Back to Badges
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="success-banner">
          {success}
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      <div className="award-workflow">
        {/* Step 1: Select Participant */}
        <div className="workflow-step">
          <div className="step-header">
            <span className="step-number">1</span>
            <h2>Select Participant</h2>
          </div>
          
          {eligibleTasks.length === 0 ? (
            <div className="empty-state-small">
              <p>No badge-eligible tasks found. Tasks need founder feedback marked as "badge-eligible" to appear here.</p>
              <button 
                className="btn-link"
                onClick={() => navigate('/admin/applications')}
              >
                View Feedback →
              </button>
            </div>
          ) : (
            <div className="participant-list">
              {participants.map((participant) => {
                const taskCount = eligibleTasks.filter(t => t.participant_id === participant.id).length;
                return (
                  <button
                    key={participant.id}
                    className={`participant-card ${selectedParticipant === participant.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedParticipant(participant.id);
                      setSelectedTaskIds([]);
                    }}
                  >
                    <div className="participant-avatar">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="participant-info">
                      <h3>{participant.name}</h3>
                      <p>{participant.email}</p>
                      <span className="task-count">{taskCount} eligible task{taskCount !== 1 ? 's' : ''}</span>
                    </div>
                    {selectedParticipant === participant.id && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="#10b981" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2: Select Badge */}
        {selectedParticipant && (
          <div className="workflow-step">
            <div className="step-header">
              <span className="step-number">2</span>
              <h2>Select Badge</h2>
            </div>
            
            {badges.length === 0 ? (
              <div className="empty-state-small">
                <p>No badges created yet.</p>
                <button 
                  className="btn-link"
                  onClick={() => navigate('/admin/badges')}
                >
                  Create Badge →
                </button>
              </div>
            ) : (
              <div className="badge-grid-mini">
                {badges.map((badge) => {
                  const alreadyHas = participantBadges.includes(badge.id);
                  return (
                    <button
                      key={badge.id}
                      className={`badge-select-card ${selectedBadgeId === badge.id ? 'selected' : ''} ${alreadyHas ? 'disabled' : ''}`}
                      onClick={() => !alreadyHas && setSelectedBadgeId(badge.id)}
                      disabled={alreadyHas}
                    >
                      <div className="badge-mini-icon" dangerouslySetInnerHTML={{ __html: badge.icon }} />
                      <h4>{badge.name}</h4>
                      <span className="badge-category-mini">{badge.category}</span>
                      {alreadyHas && <span className="already-earned">✓ Already Earned</span>}
                      {selectedBadgeId === badge.id && !alreadyHas && (
                        <div className="selected-overlay">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" fill="#10b981" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Tasks */}
        {selectedParticipant && selectedBadgeId && (
          <div className="workflow-step">
            <div className="step-header">
              <span className="step-number">3</span>
              <h2>Select Tasks That Earned This Badge</h2>
            </div>
            
            <div className="task-selection-list">
              {participantTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-selection-card ${selectedTaskIds.includes(task.id) ? 'selected' : ''}`}
                  onClick={() => toggleTaskSelection(task.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="task-selection-info">
                    <h4>{task.title}</h4>
                    <p>{task.description.substring(0, 120)}{task.description.length > 120 ? '...' : ''}</p>
                    <div className="task-meta">
                      <span className="rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        {task.average_rating.toFixed(1)}/5.0
                      </span>
                      <span className="date">
                        {new Date(task.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedTaskIds.length > 0 && (
              <div className="selected-count">
                {selectedTaskIds.length} task{selectedTaskIds.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        )}

        {/* Step 4: Validation Notes */}
        {selectedParticipant && selectedBadgeId && selectedTaskIds.length > 0 && (
          <div className="workflow-step">
            <div className="step-header">
              <span className="step-number">4</span>
              <h2>Add Validation Notes</h2>
            </div>
            
            <textarea
              className="validation-notes"
              rows={4}
              placeholder="Add notes about why this badge is being awarded, specific strengths demonstrated, or any additional context..."
              value={validationNotes}
              onChange={(e) => setValidationNotes(e.target.value)}
            />
            <small className="form-hint">Optional but recommended for transparency</small>
          </div>
        )}

        {/* Award Button */}
        {selectedParticipant && selectedBadgeId && selectedTaskIds.length > 0 && (
          <div className="award-summary">
            <div className="summary-content">
              <h3>Ready to Award Badge</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">Participant:</span>
                  <span className="summary-value">
                    {participants.find(p => p.id === selectedParticipant)?.name}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Badge:</span>
                  <span className="summary-value">{selectedBadge?.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tasks:</span>
                  <span className="summary-value">{selectedTaskIds.length} selected</span>
                </div>
              </div>
            </div>
            <button
              className="btn-award"
              onClick={handleAwardBadge}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Awarding...' : 'Award Badge'}
            </button>
          </div>
        )}
      </div>

      {/* Badge Preview */}
      {selectedBadgeId && selectedBadge && (
        <div className="badge-preview">
          <h3>Badge Preview</h3>
          <div className="preview-card">
            <BadgeCard badge={selectedBadge} variant="list" />
            <div className="badge-criteria">
              <h4>Earning Criteria:</h4>
              <p>{selectedBadge.criteria}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
