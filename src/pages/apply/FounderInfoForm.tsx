import { useForm } from 'react-hook-form';
import '../apply/ApplicationForms.css';
import type { FounderApplicationData } from './FounderApplication';

interface FounderInfoFormProps {
  initialData: Partial<FounderApplicationData>;
  onComplete: (data: Partial<FounderApplicationData>) => void;
  onBack: () => void;
}

interface FounderInfoFormData {
  fullName: string;
  email: string;
  companyName: string;
  industry?: string;
  companyStage: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  helpNeeded: string;
  hoursPerWeek: number;
}

const companyStageOptions = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'pre_seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a_plus', label: 'Series A+' },
];

export default function FounderInfoForm({ initialData, onComplete, onBack }: FounderInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FounderInfoFormData>({
    defaultValues: {
      fullName: initialData.fullName || '',
      email: initialData.email || '',
      companyName: initialData.companyName || '',
      industry: initialData.industry || '',
      companyStage: initialData.companyStage || '',
      linkedinUrl: initialData.linkedinUrl || '',
      websiteUrl: initialData.websiteUrl || '',
      helpNeeded: initialData.helpNeeded || '',
      hoursPerWeek: initialData.hoursPerWeek || 10,
    },
  });

  const onSubmit = (data: FounderInfoFormData) => {
    onComplete(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="application-form">
      <h2>Tell us about your company</h2>
      <p className="form-subtitle">We'll match you with talent who can help build your vision.</p>

      {/* Full Name */}
      <div className="form-group">
        <label htmlFor="fullName">
          Full Name <span className="required">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
          placeholder="e.g. John Doe"
        />
        {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email">
          Email <span className="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          placeholder="john@company.com"
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </div>

      {/* Company Name */}
      <div className="form-group">
        <label htmlFor="companyName">
          Company Name <span className="required">*</span>
        </label>
        <input
          id="companyName"
          type="text"
          {...register('companyName', {
            required: 'Company name is required',
            minLength: { value: 2, message: 'Company name must be at least 2 characters' },
          })}
          placeholder="e.g. Acme Inc."
        />
        {errors.companyName && <span className="error-message">{errors.companyName.message}</span>}
      </div>

      {/* Industry */}
      <div className="form-group">
        <label htmlFor="industry">Industry</label>
        <input
          id="industry"
          type="text"
          {...register('industry')}
          placeholder="e.g. Fintech, E-commerce, SaaS"
        />
        <span className="helper-text">Optional - helps us match you with relevant talent</span>
      </div>

      {/* Company Stage */}
      <div className="form-group">
        <label htmlFor="companyStage">
          Company Stage <span className="required">*</span>
        </label>
        <select id="companyStage" {...register('companyStage', { required: 'Please select a company stage' })}>
          <option value="">-- Select stage --</option>
          {companyStageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.companyStage && <span className="error-message">{errors.companyStage.message}</span>}
      </div>

      {/* LinkedIn URL */}
      <div className="form-group">
        <label htmlFor="linkedinUrl">LinkedIn Profile</label>
        <input
          id="linkedinUrl"
          type="url"
          {...register('linkedinUrl', {
            pattern: {
              value: /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i,
              message: 'Must be a valid LinkedIn profile URL',
            },
          })}
          placeholder="https://linkedin.com/in/johndoe"
        />
        {errors.linkedinUrl && <span className="error-message">{errors.linkedinUrl.message}</span>}
      </div>

      {/* Website URL */}
      <div className="form-group">
        <label htmlFor="websiteUrl">Company Website</label>
        <input
          id="websiteUrl"
          type="url"
          {...register('websiteUrl', {
            pattern: {
              value: /^https?:\/\/.+\..+/i,
              message: 'Must be a valid URL',
            },
          })}
          placeholder="https://yourcompany.com"
        />
        {errors.websiteUrl && <span className="error-message">{errors.websiteUrl.message}</span>}
      </div>

      {/* Help Needed */}
      <div className="form-group">
        <label htmlFor="helpNeeded">
          What kind of help do you need? <span className="required">*</span>
        </label>
        <textarea
          id="helpNeeded"
          {...register('helpNeeded', {
            required: 'Please describe what kind of help you need',
            minLength: { value: 50, message: 'Please provide at least 50 characters of detail' },
          })}
          placeholder="Describe the projects, tasks, or areas where you need support. Be specific about deliverables and expectations."
          rows={5}
        />
        {errors.helpNeeded && <span className="error-message">{errors.helpNeeded.message}</span>}
        <span className="helper-text">
          Be specific: What tasks? What deliverables? What skills are you looking for?
        </span>
      </div>

      {/* Hours Per Week */}
      <div className="form-group">
        <label htmlFor="hoursPerWeek">
          Expected Hours/Tasks Per Week <span className="required">*</span>
        </label>
        <input
          id="hoursPerWeek"
          type="number"
          min="1"
          max="40"
          {...register('hoursPerWeek', {
            required: 'Hours per week is required',
            min: { value: 1, message: 'Must be at least 1 hour per week' },
            max: { value: 40, message: 'Cannot exceed 40 hours per week' },
            valueAsNumber: true,
          })}
        />
        {errors.hoursPerWeek && <span className="error-message">{errors.hoursPerWeek.message}</span>}
        <span className="helper-text">How much work do you expect per participant per week?</span>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Continue to Review →
        </button>
      </div>
    </form>
  );
}
