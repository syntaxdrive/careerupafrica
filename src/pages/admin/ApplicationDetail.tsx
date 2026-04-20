import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApplicationById, updateApplication } from '../../lib/adminService';
import type { TalentApplication } from '../../lib/adminService';
import { countWords } from '../../data/scenarioQuestions';
import { useAuthStore } from '../../stores/authStore';
import './ApplicationDetail.css';

const scoringCriteria = [
  { key: 'score_clarity', label: 'Clarity of Thinking', description: 'Can they explain their thought process clearly?' },
  { key: 'score_structure', label: 'Practical Structure', description: 'Is their answer well-organized and logical?' },
  {
    key: 'score_actionability',
    label: 'Actionable Steps',
    description: 'Do they provide specific, concrete actions?',
  },
  {
    key: 'score_communication',
    label: 'Communication Quality',
    description: 'Is their writing professional and easy to understand?',
  },
  { key: 'score_originality', label: 'Originality', description: 'Do they show independent thinking?' },
];

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const [application, setApplication] = useState<TalentApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [scores, setScores] = useState<Record<string, number>>({});
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    if (!id) return;
    setLoading(true);
    const { data } = await fetchApplicationById(id);
    if (data) {
      setApplication(data);
      setNewStatus(data.status);
      setAdminNotes(data.admin_notes || '');
      setScores({
        score_clarity: data.score_clarity || 0,
        score_structure: data.score_structure || 0,
        score_actionability: data.score_actionability || 0,
        score_communication: data.score_communication || 0,
        score_originality: data.score_originality || 0,
      });
    }
    setLoading(false);
  };

  const handleScoreChange = (criterion: string, score: number) => {
    setScores((prev) => ({ ...prev, [criterion]: score }));
  };

  const handleSubmitReview = async () => {
    if (!id || !application) return;

    setSubmitting(true);
    const updates: any = {
      ...scores,
      admin_notes: adminNotes,
      status: newStatus,
      reviewer_id: profile?.id,
      reviewed_at: new Date().toISOString(),
    };

    const result = await updateApplication(id, updates);

    if (result.success) {
      alert('Review submitted successfully!');
      navigate('/admin/applications');
    } else {
      alert(`Failed to submit review: ${result.error}`);
    }

    setSubmitting(false);
  };

  const calculateAverageScore = (): number => {
    const validScores = Object.values(scores).filter((s) => s > 0);
    if (validScores.length === 0) return 0;
    return validScores.reduce((sum, s) => sum + s, 0) / validScores.length;
  };

  const formatRole = (role: string) => {
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="application-detail-page">
        <div className="loading-state">Loading application...</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="application-detail-page">
        <div className="error-state">
          <h2>Application Not Found</h2>
          <button onClick={() => navigate('/admin/applications')} className="btn-secondary">
            ← Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const avgScore = calculateAverageScore();

  return (
    <div className="application-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate('/admin/applications')} className="btn-back">
          ← Back to Applications
        </button>
        <div className="header-info">
          <h1>{application.full_name}</h1>
          <div className="header-meta">
            <span className="role-badge">{formatRole(application.role)}</span>
            <span className="hours-badge">{application.hours_per_week} hrs/week</span>
            <span className={`status-badge status-${application.status}`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        {/* Left Column: Application Info */}
        <div className="detail-main">
          {/* Basic Info */}
          <section className="info-section">
            <h2>Basic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <a href={`mailto:${application.email}`}>{application.email}</a>
              </div>
              <div className="info-item">
                <label>LinkedIn</label>
                {application.linkedin_url ? (
                  <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer">
                    View Profile →
                  </a>
                ) : (
                  <span className="text-muted">Not provided</span>
                )}
              </div>
              <div className="info-item">
                <label>Course</label>
                <span>{application.course_name || 'Not from a course'}</span>
              </div>
              <div className="info-item">
                <label>Applied</label>
                <span>{new Date(application.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </section>

          {/* Scenario Answers */}
          <section className="answers-section">
            <h2>Scenario Responses</h2>

            <div className="answer-block">
              <div className="answer-header">
                <h3>Question 1</h3>
                <span className="word-count">{countWords(application.scenario_answer_1)} words</span>
              </div>
              <p className="answer-text">{application.scenario_answer_1}</p>
            </div>

            <div className="answer-block">
              <div className="answer-header">
                <h3>Question 2</h3>
                <span className="word-count">{countWords(application.scenario_answer_2)} words</span>
              </div>
              <p className="answer-text">{application.scenario_answer_2}</p>
            </div>

            <div className="answer-block">
              <div className="answer-header">
                <h3>Question 3</h3>
                <span className="word-count">{countWords(application.scenario_answer_3)} words</span>
              </div>
              <p className="answer-text">{application.scenario_answer_3}</p>
            </div>
          </section>
        </div>

        {/* Right Column: Review Panel */}
        <div className="detail-sidebar">
          <div className="review-panel">
            <h2>Review Application</h2>

            {/* Scoring Criteria */}
            <div className="scoring-section">
              <h3>Scoring Criteria</h3>
              <p className="scoring-helper">Rate each criterion from 1 (poor) to 5 (excellent)</p>

              {scoringCriteria.map((criterion) => (
                <div key={criterion.key} className="score-item">
                  <div className="score-label">
                    <strong>{criterion.label}</strong>
                    <span className="score-description">{criterion.description}</span>
                  </div>
                  <div className="score-buttons">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        className={`score-btn ${scores[criterion.key] === score ? 'active' : ''}`}
                        onClick={() => handleScoreChange(criterion.key, score)}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {avgScore > 0 && (
                <div className="average-score">
                  <strong>Average Score:</strong> <span className="score-value">{avgScore.toFixed(1)}</span> / 5
                </div>
              )}
            </div>

            {/* Status Change */}
            <div className="status-section">
              <label htmlFor="status-select">
                <strong>Application Status</strong>
              </label>
              <select id="status-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_info">Needs More Info</option>
              </select>
            </div>

            {/* Admin Notes */}
            <div className="notes-section">
              <label htmlFor="admin-notes">
                <strong>Admin Notes</strong>
              </label>
              <textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this application..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmitReview} disabled={submitting} className="btn-submit">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
