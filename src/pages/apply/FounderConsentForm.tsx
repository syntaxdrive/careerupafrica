import { useForm } from 'react-hook-form';
import '../apply/ApplicationForms.css';
import type { FounderApplicationData } from './FounderApplication';

interface FounderConsentFormProps {
  applicationData: Partial<FounderApplicationData>;
  onComplete: (data: Partial<FounderApplicationData>) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

interface ConsentFormData {
  hasConsented: boolean;
}

const formatCompanyStage = (stage: string) => {
  const stageMap: Record<string, string> = {
    idea: 'Idea Stage',
    pre_seed: 'Pre-Seed',
    seed: 'Seed',
    series_a_plus: 'Series A+',
  };
  return stageMap[stage] || stage;
};

export default function FounderConsentForm({
  applicationData,
  onComplete,
  onBack,
  isSubmitting,
}: FounderConsentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsentFormData>({
    defaultValues: {
      hasConsented: applicationData.hasConsented || false,
    },
  });

  const onSubmit = (data: ConsentFormData) => {
    onComplete(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="application-form">
      <h2>Review Your Application</h2>
      <p className="form-subtitle">Please review your information before submitting.</p>

      {/* Application Summary */}
      <div className="application-summary">
        <h3>Application Summary</h3>

        <div className="summary-item">
          <span className="summary-label">Full Name:</span>
          <span className="summary-value">{applicationData.fullName}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Email:</span>
          <span className="summary-value">{applicationData.email}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Company:</span>
          <span className="summary-value">{applicationData.companyName}</span>
        </div>

        {applicationData.industry && (
          <div className="summary-item">
            <span className="summary-label">Industry:</span>
            <span className="summary-value">{applicationData.industry}</span>
          </div>
        )}

        <div className="summary-item">
          <span className="summary-label">Stage:</span>
          <span className="summary-value">{applicationData.companyStage && formatCompanyStage(applicationData.companyStage)}</span>
        </div>

        {applicationData.linkedinUrl && (
          <div className="summary-item">
            <span className="summary-label">LinkedIn:</span>
            <span className="summary-value">
              <a href={applicationData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                View Profile
              </a>
            </span>
          </div>
        )}

        {applicationData.websiteUrl && (
          <div className="summary-item">
            <span className="summary-label">Website:</span>
            <span className="summary-value">
              <a href={applicationData.websiteUrl} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </span>
          </div>
        )}

        <div className="summary-item">
          <span className="summary-label">Expected Hours/Week:</span>
          <span className="summary-value">{applicationData.hoursPerWeek} hours</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Help Needed:</span>
          <span className="summary-value">{applicationData.helpNeeded}</span>
        </div>
      </div>

      {/* Consent Section */}
      <div className="info-box">
        <p>
          <strong>By submitting this application, you agree to:</strong>
          <br />
          • Provide constructive feedback on deliverables within 48 hours
          <br />
          • Communicate clearly and professionally with matched talent
          <br />
          • Honor commitments around project scope and timelines
          <br />• Credit participants' work appropriately
        </p>
      </div>

      <div className="form-group">
        <label className="consent-checkbox">
          <input
            type="checkbox"
            {...register('hasConsented', {
              required: 'You must agree to the terms to submit your application',
            })}
          />
          <span>
            I agree to the terms above and understand that CareerUp Africa will review my application before granting
            access to post projects.
          </span>
        </label>
        {errors.hasConsented && <span className="error-message">{errors.hasConsented.message}</span>}
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
