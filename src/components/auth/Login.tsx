import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../stores/authStore'
import './AuthForms.css'

interface LoginFormData {
  email: string
  password: string
}

interface LoginProps {
  onToggleForm: () => void
  onSuccess?: () => void
}

export default function Login({ onToggleForm, onSuccess }: LoginProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()
  const signIn = useAuthStore((state) => state.signIn)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    const { error } = await signIn(data.email, data.password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setLoading(false)
      onSuccess?.()
    }
  }

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Sign In</h2>
        <p>Access your CareerUp Africa account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          New to CareerUp Africa?{' '}
          <button 
            type="button" 
            onClick={onToggleForm}
            className="link-button"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  )
}
