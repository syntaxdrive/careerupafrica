import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllCohorts,
  createCohort,
  type Cohort,
  type CohortData,
} from '../../lib/cohortService';
import CreateCohortForm from '../../components/admin/CreateCohortForm';
import './CohortManagement.css';

export default function CohortManagement() {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadCohorts();
  }, []);

  async function loadCohorts() {
    setIsLoading(true);
    const data = await getAllCohorts();
    setCohorts(data);
    setIsLoading(false);
  }

  async function handleCreateCohort(data: CohortData) {
    setIsCreating(true);
    setError(null);

    const result = await createCohort(data);

    if (result.success) {
      setShowCreateForm(false);
      await loadCohorts();
    } else {
      setError(result.error || 'Failed to create cohort');
    }

    setIsCreating(false);
  }

  const filteredCohorts = cohorts.filter((cohort) => {
    if (filterStatus === 'all') return true;
    return cohort.status === filterStatus;
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="cohort-management">
      <main className="cohort-content">
        <div className="cohort-hero">
          <div>
            <h2>Cohort Management</h2>
            <p className="text-secondary">Organize participants into structured intake groups</p>
          </div>
          <button onClick={() => setShowCreateForm(true)} className="btn-create">
            + Create Cohort
          </button>
        </div>

        {/* Filters */}
        <div className="cohort-filters">
          <button
            onClick={() => setFilterStatus('all')}
            className={filterStatus === 'all' ? 'filter-btn active' : 'filter-btn'}
          >
            All Cohorts
          </button>
          <button
            onClick={() => setFilterStatus('upcoming')}
            className={filterStatus === 'upcoming' ? 'filter-btn active' : 'filter-btn'}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={filterStatus === 'active' ? 'filter-btn active' : 'filter-btn'}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={filterStatus === 'completed' ? 'filter-btn active' : 'filter-btn'}
          >
            Completed
          </button>
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Cohorts List */}
        {isLoading ? (
          <div className="loading-state">Loading cohorts...</div>
        ) : filteredCohorts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No cohorts found</h3>
            <p>
              {filterStatus === 'all'
                ? 'Create your first cohort to get started'
                : `No ${filterStatus} cohorts at the moment`}
            </p>
            {filterStatus === 'all' && (
              <button onClick={() => setShowCreateForm(true)} className="btn-primary">
                Create First Cohort
              </button>
            )}
          </div>
        ) : (
          <div className="cohorts-grid">
            {filteredCohorts.map((cohort) => (
              <div
                key={cohort.id}
                className="cohort-card"
                onClick={() => navigate(`/admin/cohorts/${cohort.id}`)}
              >
                <div className="cohort-card-header">
                  <h3>{cohort.name}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(cohort.status)}`}>
                    {cohort.status}
                  </span>
                </div>

                <div className="cohort-card-body">
                  <div className="cohort-dates">
                    <div className="date-item">
                      <span className="date-label">Start:</span>
                      <span className="date-value">{formatDate(cohort.startDate)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">End:</span>
                      <span className="date-value">{formatDate(cohort.endDate)}</span>
                    </div>
                  </div>

                  {cohort.description && (
                    <p className="cohort-description">{cohort.description}</p>
                  )}

                  <div className="cohort-stats">
                    <div className="stat-item">
                      <span className="stat-value">{cohort.participantCount || 0}</span>
                      <span className="stat-label">
                        / {cohort.maxParticipants} Participants
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Cohort Modal */}
      {showCreateForm && (
        <CreateCohortForm
          onSubmit={handleCreateCohort}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isCreating}
        />
      )}
    </div>
  );
}
