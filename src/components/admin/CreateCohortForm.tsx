import { useForm } from 'react-hook-form';
import type { CohortData } from '../../lib/cohortService';
import '../../pages/admin/CohortManagement.css';

interface CreateCohortFormProps {
  onSubmit: (data: CohortData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function CreateCohortForm({ onSubmit, onCancel, isLoading }: CreateCohortFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CohortData>({
    defaultValues: {
      maxParticipants: 20,
    },
  });

  return (
    <div className="cohort-form-overlay">
      <div className="cohort-form-modal">
        <div className="cohort-form-header">
          <h2>Create New Cohort</h2>
          <button onClick={onCancel} className="close-btn" disabled={isLoading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="cohort-form">
          {/* Cohort Name */}
          <div className="form-group">
            <label htmlFor="name">
              Cohort Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Cohort name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters',
                },
              })}
              placeholder="e.g., Cohort 5 - March 2026"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="startDate">
              Start Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              {...register('startDate', {
                required: 'Start date is required',
              })}
              className={errors.startDate ? 'error' : ''}
            />
            {errors.startDate && <p className="error-text">{errors.startDate.message}</p>}
          </div>

          {/* End Date */}
          <div className="form-group">
            <label htmlFor="endDate">
              End Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              {...register('endDate', {
                required: 'End date is required',
              })}
              className={errors.endDate ? 'error' : ''}
            />
            {errors.endDate && <p className="error-text">{errors.endDate.message}</p>}
          </div>

          {/* Max Participants */}
          <div className="form-group">
            <label htmlFor="maxParticipants">
              Max Participants <span className="required">*</span>
            </label>
            <input
              type="number"
              id="maxParticipants"
              {...register('maxParticipants', {
                required: 'Max participants is required',
                min: { value: 1, message: 'Must be at least 1' },
                max: { value: 100, message: 'Cannot exceed 100' },
                valueAsNumber: true,
              })}
              min="1"
              max="100"
              className={errors.maxParticipants ? 'error' : ''}
            />
            {errors.maxParticipants && (
              <p className="error-text">{errors.maxParticipants.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              Description <span className="optional">(Optional)</span>
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of this cohort's focus or goals..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Cohort'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
