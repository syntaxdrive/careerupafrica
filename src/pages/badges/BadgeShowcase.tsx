import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getParticipantBadges, type ParticipantBadgeWithDetails } from '../../lib/badgeService';
import BadgeCard from '../../components/badges/BadgeCard';
import './BadgeShowcase.css';

export default function BadgeShowcase() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [badges, setBadges] = useState<ParticipantBadgeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadBadges();
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getParticipantBadges(user.id);
      setBadges(data);
      setError('');
    } catch (err) {
      console.error('Error loading badges:', err);
      setError('Failed to load badges');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Array.from(new Set(badges.map(b => b.badge_category)));
  const filteredBadges = categoryFilter === 'all' 
    ? badges 
    : badges.filter(b => b.badge_category === categoryFilter);

  const getShareUrl = (badgeId: string): string => {
    return `${window.location.origin}/badges/verify/${badgeId}`;
  };

  const handleShare = (badge: ParticipantBadgeWithDetails) => {
    const shareUrl = getShareUrl(badge.id);
    
    if (navigator.share) {
      navigator.share({
        title: `${badge.badge_name} Badge`,
        text: `Check out my ${badge.badge_name} badge from CareerUp Africa!`,
        url: shareUrl,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Badge verification link copied to clipboard!');
      });
    }
  };

  if (isLoading) {
    return (
      <div className="badge-showcase-page">
        <div className="loading-state">Loading your badges...</div>
      </div>
    );
  }

  return (
    <div className="badge-showcase-page">
      <header className="showcase-header">
        <div>
          <h1>My Badges</h1>
          <p className="page-subtitle">
            Your validated competence badges proving your skills
          </p>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Stats */}
      {badges.length > 0 && (
        <div className="badge-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{badges.length}</div>
              <div className="stat-label">Total Badges</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M7 7h10M7 12h10M7 17h10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{categories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {badges.reduce((acc, b) => acc + b.task_titles.length, 0)}
              </div>
              <div className="stat-label">Tasks Validated</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="filter-bar">
          <button
            className={categoryFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setCategoryFilter('all')}
          >
            All ({badges.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={categoryFilter === category ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setCategoryFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} ({badges.filter(b => b.badge_category === category).length})
            </button>
          ))}
        </div>
      )}

      {/* Badges Grid */}
      {badges.length === 0 ? (
        <div className="empty-state">
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              strokeWidth="2"
            />
          </svg>
          <h2>No Badges Yet</h2>
          <p>
            Complete tasks and receive excellent feedback to earn competence badges. Badges are awarded by admins based on your validated work.
          </p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/tasks')}
          >
            View My Tasks
          </button>
        </div>
      ) : (
        <>
          <div className="badges-grid">
            {filteredBadges.map((badge) => (
              <div key={badge.id} className="badge-showcase-card">
                <BadgeCard 
                  participantBadge={badge}
                  onClick={() => navigate(`/badges/${badge.id}`)}
                />
                <div className="badge-actions">
                  <button 
                    className="btn-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/badges/${badge.id}`);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    View Details
                  </button>
                  <button 
                    className="btn-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(badge);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="info-box">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="info-content">
              <h3>About Your Badges</h3>
              <p>
                Each badge represents a validated competence in a specific area. Badges are awarded by CareerUp Africa admins after reviewing your completed tasks and founder feedback. You can share your badges with potential employers or clients to demonstrate your proven skills.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
