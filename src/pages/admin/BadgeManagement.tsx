import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  getAllBadges,
  createBadge,
  updateBadge,
  deleteBadge,
  type Badge,
  type BadgeFormData,
} from '../../lib/badgeService';
import BadgeCard from '../../components/badges/BadgeCard';
import './BadgeManagement.css';

export default function BadgeManagement() {
  const navigate = useNavigate();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BadgeFormData>();

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBadges();
      setBadges(data);
      setError('');
    } catch (err) {
      console.error('Error loading badges:', err);
      setError('Failed to load badges');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BadgeFormData) => {
    try {
      if (editingBadge) {
        await updateBadge(editingBadge.id, data);
      } else {
        await createBadge(data);
      }
      
      await loadBadges();
      setShowCreateForm(false);
      setEditingBadge(null);
      reset();
      setError('');
    } catch (err) {
      console.error('Error saving badge:', err);
      setError('Failed to save badge');
    }
  };

  const handleEdit = (badge: Badge) => {
    setEditingBadge(badge);
    setShowCreateForm(true);
    reset({
      name: badge.name,
      description: badge.description,
      criteria: badge.criteria,
      icon: badge.icon,
      category: badge.category,
    });
  };

  const handleDelete = async (badge: Badge) => {
    if (!window.confirm(`Are you sure you want to delete "${badge.name}"? This will remove it from all participants who have earned it.`)) {
      return;
    }

    try {
      await deleteBadge(badge.id);
      await loadBadges();
      setError('');
    } catch (err) {
      console.error('Error deleting badge:', err);
      setError('Failed to delete badge');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingBadge(null);
    reset();
  };

  const categories = Array.from(new Set(badges.map(b => b.category)));
  const filteredBadges = categoryFilter === 'all' 
    ? badges 
    : badges.filter(b => b.category === categoryFilter);

  if (isLoading) {
    return (
      <div className="badge-management-page">
        <div className="loading-state">Loading badges...</div>
      </div>
    );
  }

  return (
    <div className="badge-management-page">
      <header className="page-header">
        <div>
          <h1>Badge Management</h1>
          <p className="page-subtitle">
            Create and manage competence badges that participants can earn
          </p>
        </div>
        <button 
          className="btn-create"
          onClick={() => setShowCreateForm(true)}
        >
          + Create Badge
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBadge ? 'Edit Badge' : 'Create New Badge'}</h2>
              <button className="btn-close" onClick={handleCancel}>×</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="badge-form">
              <div className="form-group">
                <label htmlFor="name">Badge Name *</label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Badge name is required' })}
                  placeholder="e.g., Operations Excellence"
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select a category</option>
                  <option value="operations">Operations</option>
                  <option value="marketing">Marketing</option>
                  <option value="content">Content</option>
                  <option value="project-management">Project Management</option>
                  <option value="technical">Technical</option>
                  <option value="communication">Communication</option>
                  <option value="leadership">Leadership</option>
                  <option value="general">General</option>
                </select>
                {errors.category && <span className="error-message">{errors.category.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description', { 
                    required: 'Description is required',
                    minLength: { value: 20, message: 'Description must be at least 20 characters' }
                  })}
                  placeholder="What does this badge prove or validate?"
                />
                {errors.description && <span className="error-message">{errors.description.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="criteria">Earning Criteria *</label>
                <textarea
                  id="criteria"
                  rows={4}
                  {...register('criteria', { 
                    required: 'Criteria is required',
                    minLength: { value: 30, message: 'Criteria must be at least 30 characters' }
                  })}
                  placeholder="Describe what participants need to do to earn this badge"
                />
                {errors.criteria && <span className="error-message">{errors.criteria.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="icon">Icon (SVG Code) *</label>
                <textarea
                  id="icon"
                  rows={6}
                  {...register('icon', { required: 'Icon SVG is required' })}
                  placeholder='<svg>...</svg>'
                />
                {errors.icon && <span className="error-message">{errors.icon.message}</span>}
                <small className="form-hint">
                  Paste SVG code here. Use a star/shield/trophy design. Max 100x100px recommended.
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingBadge ? 'Update Badge' : 'Create Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="filter-bar">
          <button
            className={categoryFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setCategoryFilter('all')}
          >
            All Badges ({badges.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={categoryFilter === category ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setCategoryFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} ({badges.filter(b => b.category === category).length})
            </button>
          ))}
        </div>
      )}

      {/* Badge Grid */}
      {filteredBadges.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              strokeWidth="2"
            />
          </svg>
          <h2>No Badges Yet</h2>
          <p>
            {categoryFilter === 'all'
              ? 'Create your first badge to start validating competencies.'
              : `No badges in the "${categoryFilter}" category.`}
          </p>
          {categoryFilter === 'all' && (
            <button onClick={() => setShowCreateForm(true)} className="btn-primary">
              Create Your First Badge
            </button>
          )}
        </div>
      ) : (
        <div className="badges-grid">
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              showActions
              onEdit={() => handleEdit(badge)}
              onDelete={() => handleDelete(badge)}
              onClick={() => navigate(`/admin/badges/award?badge_id=${badge.id}`)}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {badges.length > 0 && (
        <div className="stats-footer">
          <div className="stat">
            <span className="stat-value">{badges.length}</span>
            <span className="stat-label">Total Badges</span>
          </div>
          <div className="stat">
            <span className="stat-value">{categories.length}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat">
            <button 
              className="btn-link"
              onClick={() => navigate('/admin/badges/award')}
            >
              Award Badges →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
