import { useForm } from 'react-hook-form';
import './ApplicationForms.css';
import type { TalentApplicationData } from './TalentApplication';

interface BasicInfoFormProps {
  initialData: Partial<TalentApplicationData>;
  onComplete: (data: Partial<TalentApplicationData>) => void;
  onBack: () => void;
}

interface BasicInfoFormData {
  fullName: string;
  email: string;
  linkedinUrl: string;
  role: string;
  courseName?: string;
  hoursPerWeek: number;
}

const roleOptions = [
  { value: 'operations', label: 'Operations' },
  { value: 'virtual_assistant', label: 'Virtual Assistant' },
  { value: 'project_management', label: 'Project Management' },
  { value: 'content', label: 'Content' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
];

export default function BasicInfoForm({ initialData, onComplete, onBack }: BasicInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    defaultValues: {
      fullName: initialData.fullName || '',
      email: initialData.email || '',
      linkedinUrl: initialData.linkedinUrl || '',
      role: initialData.role || '',
      courseName: initialData.courseName || '',
      hoursPerWeek: initialData.hoursPerWeek || 10,
    },
  });

  const onSubmit = (data: BasicInfoFormData) => {
    onComplete(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="application-form">
      <h2>Tell us about yourself</h2>
      <p className="form-subtitle">We'll use this info to match you with the right opportunities.</p>

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
          placeholder="e.g. Jane Doe"
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
          placeholder="jane@example.com"
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </div>

      {/* LinkedIn URL */}
      <div className="form-group">
        <label htmlFor="linkedinUrl">
          LinkedIn Profile <span className="required">*</span>
        </label>
        <input
          id="linkedinUrl"
          type="url"
          {...register('linkedinUrl', {
            required: 'LinkedIn profile is required',
            pattern: {
              value: /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i,
              message: 'Must be a valid LinkedIn profile URL (https://linkedin.com/in/...)',
            },
          })}
          placeholder="https://linkedin.com/in/janedoe"
        />
        {errors.linkedinUrl && <span className="error-message">{errors.linkedinUrl.message}</span>}
      </div>

      {/* Role */}
      <div className="form-group">
        <label htmlFor="role">
          Primary Role <span className="required">*</span>
        </label>
        <select id="role" {...register('role', { required: 'Please select a role' })}>
          <option value="">-- Select a role --</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.role && <span className="error-message">{errors.role.message}</span>}
      </div>

      {/* Course Name (Optional) */}
      <div className="form-group">
        <label htmlFor="courseName">CareerUp Course (if applicable)</label>
        <input
          id="courseName"
          type="text"
          {...register('courseName')}
          placeholder="e.g. Operations Fundamentals"
        />
        <span className="helper-text">Leave blank if you're not from a CareerUp course</span>
      </div>

      {/* Hours Per Week */}
      <div className="form-group">
        <label htmlFor="hoursPerWeek">
          Hours Available Per Week <span className="required">*</span>
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
        <span className="helper-text">Be realistic - we'll hold you to this commitment</span>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Continue to Scenarios →
        </button>
      </div>
    </form>
  );
}
