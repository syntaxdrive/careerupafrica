import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import {
  getTaskById,
  updateTaskStatus,
  createSubmission,
  reviewSubmission,
  deleteTask,
  type TaskWithDetails,
  type SubmissionFormData,
  type SubmissionStatus,
} from '../../lib/taskService';
import { getFeedbackBySubmission, type FeedbackWithDetails } from '../../lib/feedbackService';
import FeedbackCard from '../../components/feedback/FeedbackCard';
import './TaskDetail.css';

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [task, setTask] = useState<TaskWithDetails | null>(null);
  const [structuredFeedback, setStructuredFeedback] = useState<FeedbackWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFounder = profile?.user_type === 'founder';
  const isParticipant = profile?.user_type === 'participant';
  const canSubmit = isParticipant && task && ['not_started', 'in_progress', 'revision_needed'].includes(task.status);
  const canReview = isFounder && task && task.submission && ['submitted', 'under_review'].includes(task.submission.status);

  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors },
  } = useForm<SubmissionFormData>();

  const {
    register: registerReview,
    handleSubmit: handleReviewForm,
    formState: { errors: reviewErrors },
  } = useForm<{ review_notes: string; status: SubmissionStatus }>();

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    if (!id) return;

    setIsLoading(true);
    const data = await getTaskById(id);
    setTask(data);

    // Load structured feedback if submission exists
    if (data?.submission?.id) {
      try {
        const feedback = await getFeedbackBySubmission(data.submission.id);
        setStructuredFeedback(feedback);
      } catch (err) {
        console.error('Error loading feedback:', err);
      }
    }

    setIsLoading(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    
    const success = await updateTaskStatus(id, newStatus as any);
    if (success) {
      loadTask();
    }
  };

  const onSubmitDeliverable = async (data: SubmissionFormData) => {
    if (!id || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const submission = await createSubmission(
        {
          ...data,
          task_id: id,
        },
        user.id
      );

      if (submission) {
        setShowSubmitForm(false);
        loadTask();
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onReviewSubmission = async (data: { review_notes: string; status: SubmissionStatus }) => {
    if (!task?.submission || !user) return;

    setIsSubmitting(true);
    const success = await reviewSubmission(task.submission.id, {
      status: data.status,
      review_notes: data.review_notes,
      reviewed_by: user.id,
    });

    if (success) {
      setShowReviewForm(false);
      loadTask();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this task?')) return;

    const success = await deleteTask(id);
    if (success) {
      navigate('/tasks');
    }
  };

  if (isLoading) {
    return (
      <div className="task-detail-page">
        <div className="task-detail-container">
          <div className="loading-state">
            <p>Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-detail-page">
        <div className="task-detail-container">
          <div className="empty-state">
            <h2>Task Not Found</h2>
            <p>The task you're looking for doesn't exist or you don't have permission to view it.</p>
            <button onClick={() => navigate('/tasks')} className="btn-primary">
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'approved';

  return (
    <div className="task-detail-page">
      <div className="task-detail-container">
        <button onClick={() => navigate('/tasks')} className="btn-back">
          ← Back to Tasks
        </button>

        <div className="task-detail-header">
          <div className="header-main">
            <h1>{task.title}</h1>
            <div className="task-badges">
              <span className={`status-badge status-${task.status.replace('_', '-')}`}>
                {task.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
              {isOverdue && <span className="overdue-badge">Overdue</span>}
            </div>
          </div>

          {isFounder && (
            <div className="header-actions">
              <button onClick={() => navigate(`/tasks/${id}/edit`)} className="btn-secondary">
                Edit Task
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="task-detail-body">
          {/* Task Info Card */}
          <div className="detail-card">
            <h2>Task Details</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Assigned To</span>
                <span className="value">{task.participant_name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Created By</span>
                <span className="value">
                  {task.founder_name}
                  {task.founder_company && <span className="sub-value">{task.founder_company}</span>}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Due Date</span>
                <span className="value">{new Date(task.due_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
              </div>
              <div className="detail-item">
                <span className="label">Difficulty</span>
                <span className="value">Level {task.difficulty_level}/5</span>
              </div>
              <div className="detail-item">
                <span className="label">Expected Time</span>
                <span className="value">{task.expected_hours} hours</span>
              </div>
              <div className="detail-item">
                <span className="label">Status</span>
                {isParticipant && ['not_started', 'in_progress'].includes(task.status) ? (
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="status-select"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                ) : (
                  <span className="value">
                    {task.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="detail-card">
            <h2>Description</h2>
            <p className="description-text">{task.description}</p>
          </div>

          {/* Submission Section */}
          {task.has_submission && task.submission ? (
            <div className="detail-card submission-card">
              <h2>Submission</h2>
              <div className="submission-info">
                <div className="submission-meta">
                  <span className="meta-label">Submitted:</span>
                  <span>{new Date(task.submission.submitted_at).toLocaleString()}</span>
                </div>
                {task.submission.reviewed_at && (
                  <div className="submission-meta">
                    <span className="meta-label">Reviewed:</span>
                    <span>{new Date(task.submission.reviewed_at).toLocaleString()}</span>
                  </div>
                )}
                <div className="submission-meta">
                  <span className="meta-label">Status:</span>
                  <span className={`status-badge status-${task.submission.status}`}>
                    {task.submission.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              </div>

              <div className="submission-content">
                <h3>Response</h3>
                <p>{task.submission.submission_text}</p>
              </div>

              {task.submission.submission_url && (
                <div className="submission-content">
                  <h3>Attached File/Link</h3>
                  <a href={task.submission.submission_url} target="_blank" rel="noopener noreferrer" className="submission-link">
                    {task.submission.submission_url}
                  </a>
                </div>
              )}

              {task.submission.notes && (
                <div className="submission-content">
                  <h3>Notes</h3>
                  <p>{task.submission.notes}</p>
                </div>
              )}

              {task.submission.review_notes && !structuredFeedback && (
                <div className="review-section">
                  <h3>Review Feedback</h3>
                  <p>{task.submission.review_notes}</p>
                </div>
              )}

              {/* Show structured feedback if it exists */}
              {structuredFeedback && (
                <div className="structured-feedback-section">
                  <h3>Performance Evaluation</h3>
                  <FeedbackCard
                    feedback={structuredFeedback}
                    showTaskTitle={false}
                    showParticipantInfo={false}
                    showFounderInfo={true}
                  />
                </div>
              )}

              {/* Review actions for founders */}
              {canReview && !structuredFeedback && (
                <div className="review-actions">
                  <button
                    onClick={() => navigate(`/feedback/review/${id}`)}
                    className="btn-primary"
                  >
                    Provide Structured Feedback
                  </button>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn-secondary"
                  >
                    Quick Review (Simple)
                  </button>
                </div>
              )}

              {showReviewForm && (
                <form onSubmit={handleReviewForm(onReviewSubmission)} className="review-form">
                  <div className="form-group">
                    <label>Review Status</label>
                    <select
                      {...registerReview('status', { required: 'Please select a status' })}
                      className={reviewErrors.status ? 'error' : ''}
                    >
                      <option value="">Select status...</option>
                      <option value="approved">Approve</option>
                      <option value="revision_needed">Request Revision</option>
                    </select>
                    {reviewErrors.status && <span className="error-message">{reviewErrors.status.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>Feedback</label>
                    <textarea
                      rows={5}
                      {...registerReview('review_notes', {
                        required: 'Please provide feedback',
                        minLength: { value: 20, message: 'Feedback must be at least 20 characters' },
                      })}
                      placeholder="Provide detailed feedback on the submission..."
                      className={reviewErrors.review_notes ? 'error' : ''}
                    />
                    {reviewErrors.review_notes && <span className="error-message">{reviewErrors.review_notes.message}</span>}
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : canSubmit ? (
            <div className="detail-card">
              <h2>Submit Deliverable</h2>
              {!showSubmitForm ? (
                <div>
                  <p className="submit-instructions">
                    Ready to submit your work? Click the button below to submit your deliverable for review.
                  </p>
                  <button onClick={() => setShowSubmitForm(true)} className="btn-primary">
                    Submit Deliverable
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm(onSubmitDeliverable)} className="submission-form">
                  <div className="form-group">
                    <label htmlFor="submission_text">
                      Your Response <span className="required">*</span>
                    </label>
                    <textarea
                      id="submission_text"
                      rows={10}
                      {...register('submission_text', {
                        required: 'Response is required',
                        minLength: { value: 100, message: 'Response must be at least 100 characters' },
                      })}
                      placeholder="Describe your work in detail. Explain your approach, what you learned, and how it meets the requirements..."
                      className={errors.submission_text ? 'error' : ''}
                    />
                    {errors.submission_text && <span className="error-message">{errors.submission_text.message}</span>}
                    <span className="field-hint">Minimum 100 characters</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="submission_url">File or Link (Optional)</label>
                    <input
                      type="url"
                      id="submission_url"
                      {...register('submission_url')}
                      placeholder="https://..."
                    />
                    <span className="field-hint">
                      Add a link to your work (Google Drive, GitHub, Figma, etc.)
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes (Optional)</label>
                    <textarea
                      id="notes"
                      rows={3}
                      {...register('notes')}
                      placeholder="Any additional context or notes for the reviewer..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={() => setShowSubmitForm(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
