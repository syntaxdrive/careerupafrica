import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import { getTaskById } from '../../lib/taskService';
import { createFeedback, getFeedbackBySubmission } from '../../lib/feedbackService';
import type { TaskWithDetails } from '../../lib/taskService';
import type { FeedbackFormData, FeedbackWithDetails } from '../../lib/feedbackService';
import RatingScale from '../../components/feedback/RatingScale';
import FeedbackCard from '../../components/feedback/FeedbackCard';
import './ReviewSubmission.css';

const ReviewSubmission: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [task, setTask] = useState<TaskWithDetails | null>(null);
  const [existingFeedback, setExistingFeedback] = useState<FeedbackWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      overall_rating: 3,
      understanding_rating: 3,
      execution_rating: 3,
      communication_rating: 3,
      timeliness_rating: 3,
      attention_rating: 3,
      comments: '',
      revision_needed: false,
      badge_eligible: false,
    },
  });

  // Watch rating values for interactive display
  const overallRating = watch('overall_rating');
  const understandingRating = watch('understanding_rating');
  const executionRating = watch('execution_rating');
  const communicationRating = watch('communication_rating');
  const timelinessRating = watch('timeliness_rating');
  const attentionRating = watch('attention_rating');
  const revisionNeeded = watch('revision_needed');

  useEffect(() => {
    loadTaskAndFeedback();
  }, [taskId]);

  const loadTaskAndFeedback = async () => {
    if (!taskId) return;

    try {
      setIsLoading(true);
      const taskData = await getTaskById(taskId);

      if (!taskData) {
        setError('Task not found');
        return;
      }

      setTask(taskData);

      // Check if feedback already exists
      if (taskData.submission?.id) {
        const feedback = await getFeedbackBySubmission(taskData.submission.id);
        setExistingFeedback(feedback);
      }
    } catch (err) {
      console.error('Error loading task:', err);
      setError('Failed to load task details');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FeedbackFormData) => {
    if (!task || !task.submission || !user) {
      setError('Missing required information');
      return;
    }

    // Validate word count (100+ words ≈ 500+ characters)
    const wordCount = data.comments.trim().split(/\s+/).length;
    if (wordCount < 100) {
      setError(`Feedback must be at least 100 words. Current: ${wordCount} words.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const feedbackData: FeedbackFormData = {
        task_id: task.id,
        submission_id: task.submission.id,
        participant_id: task.participant_id,
        overall_rating: data.overall_rating,
        understanding_rating: data.understanding_rating,
        execution_rating: data.execution_rating,
        communication_rating: data.communication_rating,
        timeliness_rating: data.timeliness_rating,
        attention_rating: data.attention_rating,
        comments: data.comments.trim(),
        revision_needed: data.revision_needed,
        badge_eligible: data.badge_eligible,
      };

      await createFeedback(feedbackData, user.id);

      // Navigate back to task detail or task list
      navigate(`/tasks/${taskId}`);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  const commentWordCount = getWordCount(watch('comments') || '');

  if (isLoading) {
    return (
      <div className="review-submission-page">
        <div className="loading-state">Loading submission...</div>
      </div>
    );
  }

  if (!task || !task.submission) {
    return (
      <div className="review-submission-page">
        <div className="error-message-banner">
          {error || 'No submission found for this task.'}
        </div>
        <button onClick={() => navigate('/tasks')} className="btn-secondary">
          Back to Tasks
        </button>
      </div>
    );
  }

  // Show existing feedback if it exists
  if (existingFeedback) {
    return (
      <div className="review-submission-page">
        <header className="page-header">
          <button onClick={() => navigate(`/tasks/${taskId}`)} className="back-button">
            ← Back to Task
          </button>
          <h1>Feedback Already Submitted</h1>
        </header>

        <FeedbackCard
          feedback={existingFeedback}
          showTaskTitle={true}
          showParticipantInfo={true}
          showFounderInfo={false}
        />

        <div className="form-actions">
          <button onClick={() => navigate(`/tasks/${taskId}`)} className="btn-primary">
            Back to Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-submission-page">
      <header className="page-header">
        <button onClick={() => navigate(`/tasks/${taskId}`)} className="back-button">
          ← Back to Task
        </button>
        <h1>Review Submission</h1>
        <p className="page-subtitle">
          Provide structured feedback to help the participant grow
        </p>
      </header>

      {/* Task and Submission Info */}
      <div className="submission-context">
        <h2>{task.title}</h2>
        <div className="context-meta">
          <span>
            Participant: <strong>{task.participant_name}</strong>
          </span>
          <span>
            Submitted:{' '}
            <strong>
              {task.submission.submitted_at
                ? new Date(task.submission.submitted_at).toLocaleDateString()
                : 'N/A'}
            </strong>
          </span>
        </div>

        <div className="submission-content">
          <h3>Submission Response</h3>
          <p className="submission-text">{task.submission.submission_text}</p>

          {task.submission.submission_url && (
            <div className="submission-link">
              <strong>Attached Link:</strong>{' '}
              <a href={task.submission.submission_url} target="_blank" rel="noopener noreferrer">
                {task.submission.submission_url}
              </a>
            </div>
          )}

          {task.submission.notes && (
            <div className="submission-notes">
              <strong>Participant Notes:</strong>
              <p>{task.submission.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="feedback-form">
        <h2 className="form-section-title">Performance Evaluation</h2>

        {error && <div className="error-banner">{error}</div>}

        {/* Overall Rating */}
        <div className="form-group overall-rating-group">
          <label>Overall Rating</label>
          <p className="field-hint">Rate the overall quality of this submission</p>
          <RatingScale
            value={overallRating}
            onChange={(rating) => setValue('overall_rating', rating)}
            size="large"
            showLabel={true}
          />
          <input type="hidden" {...register('overall_rating', { required: true })} />
        </div>

        {/* Criteria Ratings */}
        <div className="criteria-section">
          <h3>Detailed Criteria Assessment</h3>
          <p className="section-hint">
            Rate each criterion from 1 (Poor) to 5 (Excellent). Be specific and fair.
          </p>

          <div className="criteria-grid-form">
            <div className="form-group">
              <label>Understanding of Requirements</label>
              <p className="field-hint">Did they grasp what was needed?</p>
              <RatingScale
                value={understandingRating}
                onChange={(rating) => setValue('understanding_rating', rating)}
                size="medium"
                showLabel={false}
              />
              <input type="hidden" {...register('understanding_rating', { required: true })} />
            </div>

            <div className="form-group">
              <label>Execution Quality</label>
              <p className="field-hint">How well was the work executed?</p>
              <RatingScale
                value={executionRating}
                onChange={(rating) => setValue('execution_rating', rating)}
                size="medium"
                showLabel={false}
              />
              <input type="hidden" {...register('execution_rating', { required: true })} />
            </div>

            <div className="form-group">
              <label>Communication</label>
              <p className="field-hint">Clarity and professionalism</p>
              <RatingScale
                value={communicationRating}
                onChange={(rating) => setValue('communication_rating', rating)}
                size="medium"
                showLabel={false}
              />
              <input type="hidden" {...register('communication_rating', { required: true })} />
            </div>

            <div className="form-group">
              <label>Timeliness</label>
              <p className="field-hint">Was it submitted on time?</p>
              <RatingScale
                value={timelinessRating}
                onChange={(rating) => setValue('timeliness_rating', rating)}
                size="medium"
                showLabel={false}
              />
              <input type="hidden" {...register('timeliness_rating', { required: true })} />
            </div>

            <div className="form-group">
              <label>Attention to Detail</label>
              <p className="field-hint">Thoroughness and accuracy</p>
              <RatingScale
                value={attentionRating}
                onChange={(rating) => setValue('attention_rating', rating)}
                size="medium"
                showLabel={false}
              />
              <input type="hidden" {...register('attention_rating', { required: true })} />
            </div>
          </div>
        </div>

        {/* Written Feedback */}
        <div className="form-group comments-group">
          <label>Detailed Feedback *</label>
          <p className="field-hint">
            Provide specific, actionable feedback (minimum 100 words). Be direct, clear, and helpful.
          </p>
          <textarea
            rows={10}
            {...register('comments', {
              required: 'Detailed feedback is required',
              minLength: {
                value: 500,
                message: 'Feedback must be at least 500 characters (approximately 100 words)',
              },
            })}
            placeholder="Example: Your analysis of the problem was thorough and well-structured. You correctly identified the key issues and proposed practical solutions. However, I noticed a few areas for improvement:

1. The timeline estimates could be more realistic...
2. Consider adding more specific metrics...
3. The communication with stakeholders needs more detail...

Overall, this demonstrates strong analytical skills. With some refinement in project planning, this work would be excellent."
            className={errors.comments ? 'error' : ''}
          />
          <div className="character-count">
            <span className={commentWordCount >= 100 ? 'valid' : 'invalid'}>
              {commentWordCount} / 100 words minimum
            </span>
          </div>
          {errors.comments && <span className="error-message">{errors.comments.message}</span>}
        </div>

        {/* Flags */}
        <div className="flags-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" {...register('revision_needed')} />
              <span className="checkbox-text">
                <strong>Revision Needed</strong>
                <span className="checkbox-hint">
                  Select if the participant should revise and resubmit
                </span>
              </span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('badge_eligible')}
                disabled={revisionNeeded}
              />
              <span className="checkbox-text">
                <strong>Badge Eligible</strong>
                <span className="checkbox-hint">
                  This work demonstrates competence worthy of a badge (requires admin approval)
                </span>
              </span>
            </label>
            {revisionNeeded && (
              <p className="field-hint warning">
                Cannot be badge-eligible if revision is needed
              </p>
            )}
          </div>
        </div>

        {/* Feedback Guidelines */}
        <div className="guidelines-box">
          <h4>Feedback Guidelines</h4>
          <ul>
            <li>Be direct, specific, and actionable</li>
            <li>Focus on competence demonstrated, not potential</li>
            <li>Provide concrete examples from their work</li>
            <li>If requesting revision, clearly state what needs improvement</li>
            <li>Balance critique with recognition of strengths</li>
          </ul>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/tasks/${taskId}`)}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewSubmission;
