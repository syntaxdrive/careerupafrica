import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore, type UserType } from '../../stores/authStore'
import { isSupabaseReady } from '../../lib/supabase'
import './AuthForms.css'

interface SignUpFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  userType: UserType
}

interface SignUpProps {
  onToggleForm: () => void
  onSuccess?: () => void
}

export default function SignUp({ onToggleForm, onSuccess }: SignUpProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      userType: 'participant'
    }
  })
  const signUp = useAuthStore((state) => state.signUp)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const password = watch('password')

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true)
    setError(null)

    const { error } = await signUp(
      data.email,
      data.password,
      data.fullName,
      data.userType
    )

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="auth-form">
        <div className="success-message">
          <h2>Account Created</h2>
          <p>Check your email to verify your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Start building demonstrable competence</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="userType">I am a</label>
          <select
            id="userType"
            {...register('userType', { required: 'Please select your role' })}
          >
            <option value="participant">Participant - Build competence</option>
            <option value="founder">Founder - Provide projects</option>
            {!isSupabaseReady() && (
              <option value="admin">Admin - Manage platform (Demo only)</option>
            )}
          </select>
          {errors.userType && (
            <span className="field-error">{errors.userType.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            {...register('fullName', { 
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <span className="field-error">{errors.fullName.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="you@example.com"
          />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            placeholder="••••••••"
          />
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={onToggleForm}
            className="link-button"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
