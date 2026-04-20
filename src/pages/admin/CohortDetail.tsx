import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getCohortById,
  updateCohort,
  getUnassignedParticipants,
  assignParticipantToCohort,
  type CohortWithDetails,
} from '../../lib/cohortService';
import './CohortDetail.css';

export default function CohortDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cohort, setCohort] = useState<CohortWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [unassignedParticipants, setUnassignedParticipants] = useState<
    Array<{ id: string; profileId: string; fullName: string; skills: string[] }>
  >([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (id) {
      loadCohort();
    }
  }, [id]);

  async function loadCohort() {
    if (!id) return;

    setIsLoading(true);
    const data = await getCohortById(id);

    if (data) {
      setCohort(data);
    } else {
      setError('Cohort not found');
    }

    setIsLoading(false);
  }

  async function loadUnassigned() {
    const participants = await getUnassignedParticipants();
    setUnassignedParticipants(participants);
  }

  async function handleStatusChange(newStatus: 'upcoming' | 'active' | 'completed') {
    if (!id) return;

    const result = await updateCohort(id, { status: newStatus });

    if (result.success) {
      await loadCohort();
    } else {
      setError(result.error || 'Failed to update status');
    }
  }

  async function handleAssignParticipant(participantId: string) {
    if (!id) return;

    setIsAssigning(true);
    const result = await assignParticipantToCohort(participantId, id);

    if (result.success) {
      setShowAssignModal(false);
      await loadCohort();
    } else {
      setError(result.error || 'Failed to assign participant');
    }

    setIsAssigning(false);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'status-upcoming';
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="cohort-detail">
        <div className="loading-state">Loading cohort details...</div>
      </div>
    );
  }

  if (error && !cohort) {
    return (
      <div className="cohort-detail">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/cohorts')} className="btn-primary">
            Back to Cohorts
          </button>
        </div>
      </div>
    );
  }

  if (!cohort) {
    return null;
  }

  return (
    <div className="cohort-detail">
      <main className="cohort-detail-content">
        <button onClick={() => navigate('/admin/cohorts')} className="back-btn">
          ← Back to Cohorts
        </button>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Cohort Header */}
        <div className="cohort-detail-header">
          <div className="header-left">
            <h2>{cohort.name}</h2>
            {cohort.description && <p className="cohort-subtitle">{cohort.description}</p>}
          </div>
          <div className="header-right">
            <span className={`status-badge ${getStatusBadgeClass(cohort.status)}`}>
              {cohort.status}
            </span>
            <select
              value={cohort.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as 'upcoming' | 'active' | 'completed')
              }
              className="status-dropdown"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-label">Start Date</div>
              <div className="stat-value">{formatDate(cohort.startDate)}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-label">End Date</div>
              <div className="stat-value">{formatDate(cohort.endDate)}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-label">Participants</div>
              <div className="stat-value">
                {cohort.participantCount} / {cohort.maxParticipants}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-label">Capacity</div>
              <div className="stat-value">
                {cohort.maxParticipants > 0
                  ? Math.round(((cohort.participantCount || 0) / cohort.maxParticipants) * 100)
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>

        {/* Participants Section */}
        <div className="participants-section">
          <div className="section-header">
            <h3>Participants ({cohort.participants.length})</h3>
            <button
              onClick={() => {
                loadUnassigned();
                setShowAssignModal(true);
              }}
              className="btn-add"
              disabled={
                cohort.maxParticipants > 0 &&
                (cohort.participantCount || 0) >= cohort.maxParticipants
              }
            >
              + Assign Participant
            </button>
          </div>

          {cohort.participants.length === 0 ? (
            <div className="empty-participants">
              <p>No participants assigned yet</p>
              <button
                onClick={() => {
                  loadUnassigned();
                  setShowAssignModal(true);
                }}
                className="btn-primary"
              >
                Assign First Participant
              </button>
            </div>
          ) : (
            <div className="participants-list">
              {cohort.participants.map((participant) => (
                <div key={participant.id} className="participant-card">
                  <div className="participant-info">
                    <h4>{participant.fullName}</h4>
                    <div className="participant-skills">
                      {participant.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`participant-status status-${participant.status}`}>
                    {participant.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Assign Participant Modal */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Assign Participant to Cohort</h3>
              <button onClick={() => setShowAssignModal(false)} className="close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              {unassignedParticipants.length === 0 ? (
                <div className="no-participants">
                  <p>No unassigned participants available</p>
                </div>
              ) : (
                <div className="assign-list">
                  {unassignedParticipants.map((participant) => (
                    <div key={participant.id} className="assign-item">
                      <div className="assign-info">
                        <h4>{participant.fullName}</h4>
                        <div className="participant-skills">
                          {participant.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignParticipant(participant.id)}
                        className="btn-assign"
                        disabled={isAssigning}
                      >
                        {isAssigning ? 'Assigning...' : 'Assign'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
