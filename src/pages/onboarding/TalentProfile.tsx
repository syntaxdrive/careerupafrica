import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import {
  getParticipantProfile,
  updateParticipantProfile,
  type TalentProfileData,
} from '../../lib/profileService';
import './ProfileOnboarding.css';

interface PortfolioLink {
  title: string;
  url: string;
}

interface TalentProfileFormData {
  avatarUrl: string;
  bio: string;
  skills: string;
  availabilityHoursPerWeek: number;
  portfolioLinks: PortfolioLink[];
}

export default function TalentProfile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TalentProfileFormData>({
    defaultValues: {
      avatarUrl: '',
      bio: '',
      skills: '',
      availabilityHoursPerWeek: 10,
      portfolioLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'portfolioLinks',
  });

  const bio = watch('bio');

  // Load existing profile if any
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      try {
        const profile = await getParticipantProfile(user.id);
        if (profile) {
          setValue('avatarUrl', profile.avatarUrl || '');
          setValue('bio', profile.bio || '');
          setValue('skills', profile.skills.join(', '));
          setValue(
            'availabilityHoursPerWeek',
            profile.availabilityHoursPerWeek || 10
          );
          setValue('portfolioLinks', profile.portfolioLinks || []);

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

  const onSubmit = async (data: TalentProfileFormData) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Parse skills from comma-separated string
      const skillsArray = data.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const profileData: TalentProfileData = {
        avatarUrl: data.avatarUrl || undefined,
        bio: data.bio,
        skills: skillsArray,
        availabilityHoursPerWeek: data.availabilityHoursPerWeek,
        portfolioLinks: data.portfolioLinks.filter(
          (link) => link.title && link.url
        ),
      };

      const result = await updateParticipantProfile(user.id, profileData);

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
          <h1>Complete Your Profile</h1>
          <p>
            Help us showcase your skills and match you with the right
            opportunities.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
          {/* Avatar URL */}
          <div className="form-group">
            <label htmlFor="avatarUrl">
              Profile Picture URL <span className="optional">(Optional)</span>
            </label>
            <input
              type="url"
              id="avatarUrl"
              {...register('avatarUrl')}
              placeholder="https://example.com/your-photo.jpg"
            />
            <p className="field-hint">
              Enter a URL to your profile picture or leave blank for default
            </p>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label htmlFor="bio">
              Bio <span className="required">*</span>
            </label>
            <textarea
              id="bio"
              {...register('bio', {
                required: 'Bio is required',
                maxLength: {
                  value: 250,
                  message: 'Bio must be 250 characters or less',
                },
                minLength: {
                  value: 20,
                  message: 'Bio must be at least 20 characters',
                },
              })}
              placeholder="Tell us about yourself, your experience, and what you're looking to achieve..."
              rows={4}
              className={errors.bio ? 'error' : ''}
            />
            <div className="char-count">
              <span className={bio?.length > 250 ? 'error' : ''}>
                {bio?.length || 0} / 250 characters
              </span>
            </div>
            {errors.bio && (
              <p className="error-text">{errors.bio.message}</p>
            )}
          </div>

          {/* Skills */}
          <div className="form-group">
            <label htmlFor="skills">
              Skills <span className="required">*</span>
            </label>
            <input
              type="text"
              id="skills"
              {...register('skills', {
                required: 'At least one skill is required',
              })}
              placeholder="e.g., Project Management, Content Writing, Data Analysis"
              className={errors.skills ? 'error' : ''}
            />
            <p className="field-hint">
              Enter your skills separated by commas
            </p>
            {errors.skills && (
              <p className="error-text">{errors.skills.message}</p>
            )}
          </div>

          {/* Availability */}
          <div className="form-group">
            <label htmlFor="availabilityHoursPerWeek">
              Available Hours Per Week <span className="required">*</span>
            </label>
            <input
              type="number"
              id="availabilityHoursPerWeek"
              {...register('availabilityHoursPerWeek', {
                required: 'Availability is required',
                min: { value: 1, message: 'Must be at least 1 hour' },
                max: { value: 40, message: 'Cannot exceed 40 hours' },
              })}
              min="1"
              max="40"
              className={errors.availabilityHoursPerWeek ? 'error' : ''}
            />
            {errors.availabilityHoursPerWeek && (
              <p className="error-text">
                {errors.availabilityHoursPerWeek.message}
              </p>
            )}
          </div>

          {/* Portfolio Links */}
          <div className="form-group">
            <label>
              Portfolio / Work Samples{' '}
              <span className="optional">(Optional)</span>
            </label>
            <p className="field-hint">
              Add links to your previous work, projects, or portfolio
            </p>

            {fields.map((field, index) => (
              <div key={field.id} className="portfolio-link-group">
                <div className="portfolio-inputs">
                  <input
                    type="text"
                    {...register(`portfolioLinks.${index}.title`)}
                    placeholder="Project title"
                    className="portfolio-title"
                  />
                  <input
                    type="url"
                    {...register(`portfolioLinks.${index}.url`)}
                    placeholder="https://..."
                    className="portfolio-url"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="remove-link-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ title: '', url: '' })}
              className="add-link-btn"
            >
              + Add Portfolio Link
            </button>
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
