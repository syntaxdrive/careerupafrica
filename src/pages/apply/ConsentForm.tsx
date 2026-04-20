import { useForm } from 'react-hook-form';
import './ApplicationForms.css';
import type { TalentApplicationData } from './TalentApplication';

interface ConsentFormProps {
  applicationData: Partial<TalentApplicationData>;
  onComplete: (data: Partial<TalentApplicationData>) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

interface ConsentFormData {
  hasConsented: boolean;
}

export default function ConsentForm({ applicationData, onComplete, onBack, isSubmitting }: ConsentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsentFormData>({
    defaultValues: {
      hasConsented: false,
    },
  });

  const onSubmit = (data: ConsentFormData) => {
    onComplete(data);
  };

  // Helper to display role in readable format
  const formatRole = (role?: string): string => {
    if (!role) return 'N/A';
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="application-form">
      <h2>Review & Consent</h2>
      <p className="form-subtitle">Double-check your information before submitting.</p>

      {/* Application Summary */}
      <div className="application-summary">
        <h3>Your Application</h3>

        <div className="summary-item">
          <span className="summary-label">Name:</span>
          <span className="summary-value">{applicationData.fullName}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Email:</span>
          <span className="summary-value">{applicationData.email}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">LinkedIn:</span>
          <span className="summary-value">
            <a href={applicationData.linkedinUrl} target="_blank" rel="noopener noreferrer">
              {applicationData.linkedinUrl}
            </a>
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Role:</span>
          <span className="summary-value">{formatRole(applicationData.role)}</span>
        </div>

        {applicationData.courseName && (
          <div className="summary-item">
            <span className="summary-label">Course:</span>
            <span className="summary-value">{applicationData.courseName}</span>
          </div>
        )}

        <div className="summary-item">
          <span className="summary-label">Availability:</span>
          <span className="summary-value">{applicationData.hoursPerWeek} hours/week</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Scenario Answers:</span>
          <span className="summary-value">
            {applicationData.scenarioAnswer1 ? '✓' : '✗'} Question 1{' '}
            {applicationData.scenarioAnswer2 ? '| ✓ Question 2' : '| ✗ Question 2'}{' '}
            {applicationData.scenarioAnswer3 ? '| ✓ Question 3' : '| ✗ Question 3'}
          </span>
        </div>
      </div>

      {/* Consent Section */}
      <div className="warning-box">
        <p>
          <strong>Before you submit:</strong>
        </p>
        <p>
          By submitting this application, you confirm that:
          <br />
          • All information provided is accurate and truthful
          <br />
          • You're genuinely available for the hours/week you specified
          <br />
          • You understand this is a competency-based program, not a job guarantee
          <br />
          • Your scenario answers are your own original work
          <br />• You consent to us reviewing your LinkedIn profile and contacting references if needed
        </p>
      </div>

      {/* Consent Checkbox */}
      <div className="form-group">
        <label className="consent-checkbox">
          <input
            type="checkbox"
            {...register('hasConsented', {
              required: 'You must consent to submit your application',
            })}
          />
          <span>
            I have read and agree to the terms above. I understand that my application will be manually reviewed and
            that approval is not guaranteed.
          </span>
        </label>
        {errors.hasConsented && <span className="error-message">{errors.hasConsented.message}</span>}
      </div>

      {/* Info about next steps */}
      <div className="info-box">
        <p>
          <strong>What happens after you submit?</strong>
          <br />
          Our team will review your scenario answers within 5-7 business days. We're looking for clarity, structure,
          problem-solving approach, and communication skills. If approved, you'll receive an invite to the next cohort.
        </p>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary" disabled={isSubmitting}>
          ← Back
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}
