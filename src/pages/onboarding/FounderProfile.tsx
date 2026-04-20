import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import {
  getFounderProfile,
  updateFounderProfile,
  type FounderProfileData,
} from '../../lib/profileService';
import './ProfileOnboarding.css';

interface FounderProfileFormData {
  companyLogoUrl: string;
  companyDescription: string;
  teamSize: number;
  preferredTaskTypes: string;
  industryFocus: string;
  otherNotes: string;
}

export default function FounderProfile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FounderProfileFormData>({
    defaultValues: {
      companyLogoUrl: '',
      companyDescription: '',
      teamSize: 1,
      preferredTaskTypes: '',
      industryFocus: '',
      otherNotes: '',
    },
  });

  const companyDescription = watch('companyDescription');

  // Load existing profile if any
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      try {
        const profile = await getFounderProfile(user.id);
        if (profile) {
          setValue('companyLogoUrl', profile.companyLogoUrl || '');
          setValue('companyDescription', profile.bio || '');
          setValue('teamSize', profile.teamSize || 1);
          setValue(
            'preferredTaskTypes',
            profile.taskPreferences?.preferredTaskTypes?.join(', ') || ''
          );
          setValue(
            'industryFocus',
            profile.taskPreferences?.industryFocus || ''
          );
          setValue('otherNotes', profile.taskPreferences?.otherNotes || '');

          // If profile is already completed, redirect to dashboard
          if (profile.profileCompleted) {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user, setValue, navigate]);

  const onSubmit = async (data: FounderProfileFormData) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Parse preferred task types from comma-separated string
      const taskTypesArray = data.preferredTaskTypes
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const profileData: FounderProfileData = {
        companyLogoUrl: data.companyLogoUrl || undefined,
        companyDescription: data.companyDescription,
        teamSize: data.teamSize,
        taskPreferences: {
          preferredTaskTypes: taskTypesArray,
          industryFocus: data.industryFocus || undefined,
          otherNotes: data.otherNotes || undefined,
        },
      };

      const result = await updateFounderProfile(user.id, profileData);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="profile-onboarding">
        <div className="profile-container">
          <div className="loading-state">Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-onboarding">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Complete Your Company Profile</h1>
          <p>
            Help us understand your company and match you with the right
            talent.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
          {/* Company Logo URL */}
          <div className="form-group">
            <label htmlFor="companyLogoUrl">
              Company Logo URL <span className="optional">(Optional)</span>
            </label>
            <input
              type="url"
              id="companyLogoUrl"
              {...register('companyLogoUrl')}
              placeholder="https://example.com/logo.png"
            />
            <p className="field-hint">
              Enter a URL to your company logo or leave blank for default
            </p>
          </div>

          {/* Company Description */}
          <div className="form-group">
            <label htmlFor="companyDescription">
              Company Description <span className="required">*</span>
            </label>
            <textarea
              id="companyDescription"
              {...register('companyDescription', {
                required: 'Company description is required',
                minLength: {
                  value: 50,
                  message: 'Description must be at least 50 characters',
                },
                maxLength: {
                  value: 500,
                  message: 'Description must be 500 characters or less',
                },
              })}
              placeholder="Tell us about your company, what you do, your mission, and what you're building..."
              rows={5}
              className={errors.companyDescription ? 'error' : ''}
            />
            <div className="char-count">
              <span
                className={companyDescription?.length > 500 ? 'error' : ''}
              >
                {companyDescription?.length || 0} / 500 characters
              </span>
            </div>
            {errors.companyDescription && (
              <p className="error-text">{errors.companyDescription.message}</p>
            )}
          </div>

          {/* Team Size */}
          <div className="form-group">
            <label htmlFor="teamSize">
              Current Team Size <span className="required">*</span>
            </label>
            <input
              type="number"
              id="teamSize"
              {...register('teamSize', {
                required: 'Team size is required',
                min: { value: 1, message: 'Team size must be at least 1' },
                max: {
                  value: 1000,
                  message: 'Please enter a valid team size',
                },
              })}
              min="1"
              max="1000"
              className={errors.teamSize ? 'error' : ''}
            />
            <p className="field-hint">
              How many people are currently on your team?
            </p>
            {errors.teamSize && (
              <p className="error-text">{errors.teamSize.message}</p>
            )}
          </div>

          {/* Preferred Task Types */}
          <div className="form-group">
            <label htmlFor="preferredTaskTypes">
              Preferred Task Types{' '}
              <span className="optional">(Optional)</span>
            </label>
            <input
              type="text"
              id="preferredTaskTypes"
              {...register('preferredTaskTypes')}
              placeholder="e.g., Content Creation, Market Research, Customer Support"
            />
            <p className="field-hint">
              What types of tasks do you typically need help with? (Separate
              with commas)
            </p>
          </div>

          {/* Industry Focus */}
          <div className="form-group">
            <label htmlFor="industryFocus">
              Industry Focus <span className="optional">(Optional)</span>
            </label>
            <input
              type="text"
              id="industryFocus"
              {...register('industryFocus')}
              placeholder="e.g., FinTech, EdTech, HealthTech, E-commerce"
            />
            <p className="field-hint">
              What industry or sector does your company operate in?
            </p>
          </div>

          {/* Other Notes */}
          <div className="form-group">
            <label htmlFor="otherNotes">
              Additional Notes <span className="optional">(Optional)</span>
            </label>
            <textarea
              id="otherNotes"
              {...register('otherNotes', {
                maxLength: {
                  value: 500,
                  message: 'Notes must be 500 characters or less',
                },
              })}
              placeholder="Any other information you'd like to share about your needs or preferences..."
              rows={3}
              className={errors.otherNotes ? 'error' : ''}
            />
            {errors.otherNotes && (
              <p className="error-text">{errors.otherNotes.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
