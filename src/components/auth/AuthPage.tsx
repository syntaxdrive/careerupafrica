import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'
import './AuthPage.css'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <h1 className="brand-title">CareerUp Africa</h1>
          <p className="brand-tagline">Proof Over Potential</p>
          <div className="brand-description">
            <p>
              Build demonstrable competence. Execute real-world projects.
              Earn validated badges.
            </p>
          </div>
        </div>

        <div className="auth-content">
          {isLogin ? (
            <Login 
              onToggleForm={() => setIsLogin(false)}
              onSuccess={handleSuccess}
            />
          ) : (
            <SignUp 
              onToggleForm={() => setIsLogin(true)}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  )
}
