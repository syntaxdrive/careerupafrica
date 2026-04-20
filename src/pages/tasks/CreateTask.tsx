import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import { createTask, getMatchedParticipants, type TaskFormData } from '../../lib/taskService';
import './CreateTask.css';

export default function CreateTask() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TaskFormData>();

  useEffect(() => {
    loadParticipants();
  }, [user]);

  const loadParticipants = async () => {
    if (!user) return;

    setIsLoadingParticipants(true);
    const data = await getMatchedParticipants(user.id);
    setParticipants(data);
    setIsLoadingParticipants(false);

    if (data.length === 0) {
      setError("You don't have any active matches yet. Match with talent before creating tasks.");
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const task = await createTask(data, user.id);

      if (task) {
        navigate('/tasks');
      } else {
        setError('Failed to create task. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyLevel = watch('difficulty_level');

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Very Easy';
      case 2:
        return 'Easy';
      case 3:
        return 'Medium';
      case 4:
        return 'Hard';
      case 5:
        return 'Very Hard';
      default:
        return '';
    }
  };

  return (
    <div className="create-task-page">
      <div className="create-task-container">
        <div className="page-header">
          <button onClick={() => navigate('/tasks')} className="btn-back">
            ← Back to Tasks
          </button>
          <h1>Create New Task</h1>
          <p className="text-secondary">
            Assign a task or deliverable to your matched talent to validate their competence
          </p>
        </div>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {isLoadingParticipants ? (
          <div className="loading-state">
            <p>Loading matched talent...</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path
                d="M32 32C38.6274 32 44 26.6274 44 20C44 13.3726 38.6274 8 32 8C25.3726 8 20 13.3726 20 20C20 26.6274 25.3726 32 32 32Z"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                d="M12 56C12 47.1634 20.9543 40 32 40C43.0457 40 52 47.1634 52 56"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <h2>No Matched Talent</h2>
            <p>You need to be matched with talent before you can create tasks.</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="create-task-form">
            {/* Assign To */}
            <div className="form-group">
              <label htmlFor="participant_id">
                Assign To <span className="required">*</span>
              </label>
              <select
                id="participant_id"
                {...register('participant_id', { required: 'Please select a participant' })}
                className={errors.participant_id ? 'error' : ''}
              >
                <option value="">Select matched talent...</option>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.full_name}
                    {participant.skills?.length > 0 && ` (${participant.skills.slice(0, 3).join(', ')})`}
                  </option>
                ))}
              </select>
              {errors.participant_id && (
                <span className="error-message">{errors.participant_id.message}</span>
              )}
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">
                Task Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                {...register('title', {
                  required: 'Task title is required',
                  minLength: { value: 10, message: 'Title must be at least 10 characters' },
                  maxLength: { value: 100, message: 'Title must be less than 100 characters' },
                })}
                placeholder="e.g., Create onboarding email sequence"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title.message}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">
                Task Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                rows={8}
                {...register('description', {
                  required: 'Task description is required',
                  minLength: { value: 50, message: 'Description must be at least 50 characters' },
                })}
                placeholder="Describe the task in detail. Include:&#10;- What needs to be done&#10;- Expected deliverables&#10;- Success criteria&#10;- Any resources or guidelines"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && (
                <span className="error-message">{errors.description.message}</span>
              )}
              <span className="field-hint">Minimum 50 characters</span>
            </div>

            {/* Due Date and Expected Hours */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="due_date">
                  Due Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="due_date"
                  {...register('due_date', {
                    required: 'Due date is required',
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || 'Due date must be today or in the future';
                    },
                  })}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.due_date ? 'error' : ''}
                />
                {errors.due_date && <span className="error-message">{errors.due_date.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="expected_hours">
                  Expected Hours <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="expected_hours"
                  step="0.5"
                  min="0.5"
                  max="100"
                  {...register('expected_hours', {
                    required: 'Expected hours is required',
                    min: { value: 0.5, message: 'Minimum 0.5 hours' },
                    max: { value: 100, message: 'Maximum 100 hours' },
                    valueAsNumber: true,
                  })}
                  placeholder="e.g., 8"
                  className={errors.expected_hours ? 'error' : ''}
                />
                {errors.expected_hours && (
                  <span className="error-message">{errors.expected_hours.message}</span>
                )}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="form-group">
              <label htmlFor="difficulty_level">
                Difficulty Level <span className="required">*</span>
              </label>
              <div className="difficulty-container">
                <input
                  type="range"
                  id="difficulty_level"
                  min="1"
                  max="5"
                  step="1"
                  defaultValue="3"
                  {...register('difficulty_level', {
                    required: 'Difficulty level is required',
                    valueAsNumber: true,
                  })}
                  className="difficulty-slider"
                />
                <div className="difficulty-labels">
                  <span className="current-difficulty">
                    Level {difficultyLevel || 3}: {getDifficultyLabel(Number(difficultyLevel) || 3)}
                  </span>
                </div>
                <div className="difficulty-scale">
                  <span>Very Easy</span>
                  <span>Easy</span>
                  <span>Medium</span>
                  <span>Hard</span>
                  <span>Very Hard</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="button" onClick={() => navigate('/tasks')} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Creating Task...' : 'Create Task'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
