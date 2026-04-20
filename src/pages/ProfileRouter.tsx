import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * Profile Router
 * Redirects users to their type-specific profile page
 */
export default function ProfileRouter() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  useEffect(() => {
    if (!profile) {
      navigate('/dashboard');
      return;
    }

    // Redirect based on user type
    switch (profile.user_type) {
      case 'participant':
        navigate('/onboarding/talent');
        break;
      case 'founder':
        navigate('/onboarding/founder');
        break;
      case 'admin':
        navigate('/dashboard'); // Admins don't have a profile page yet
        break;
      default:
        navigate('/dashboard');
    }
  }, [profile, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.125rem',
      color: '#64748b' 
    }}>
      Redirecting to profile...
    </div>
  );
}
