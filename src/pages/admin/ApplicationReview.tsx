import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApplications } from '../../lib/adminService';
import type { TalentApplication } from '../../lib/adminService';
import './ApplicationReview.css';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'needs_info', label: 'Needs Info' },
];

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'operations', label: 'Operations' },
  { value: 'virtual_assistant', label: 'Virtual Assistant' },
  { value: 'project_management', label: 'Project Management' },
  { value: 'content', label: 'Content' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
];

export default function ApplicationReview() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadApplications();
  }, [statusFilter, roleFilter]);

  const loadApplications = async () => {
    setLoading(true);
    const filters: any = {};
    if (statusFilter) filters.status = statusFilter;
    if (roleFilter) filters.role = roleFilter;

    const { data } = await fetchApplications(filters);
    setApplications(data);
    setLoading(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'under_review':
        return 'badge-reviewing';
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'needs_info':
        return 'badge-needs-info';
      default:
        return '';
    }
  };

  const formatRole = (role: string) => {
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="application-review-page">
      <div className="review-header">
        <h1>Talent Applications</h1>
        <p>Review and approve applications based on scenario responses</p>
      </div>

      {/* Filters */}
      <div className="review-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="role-filter">Role</label>
          <select id="role-filter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-summary">
          Showing <strong>{applications.length}</strong> application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="loading-state">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <p>No applications found matching your filters.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card" onClick={() => navigate(`/admin/applications/${app.id}`)}>
              <div className="card-header">
                <div className="applicant-info">
                  <h3>{app.full_name}</h3>
                  <span className="email">{app.email}</span>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span className="role-tag">{formatRole(app.role)}</span>
                  <span className="hours-tag">{app.hours_per_week} hrs/week</span>
                  {app.course_name && <span className="course-tag">📚 {app.course_name}</span>}
                </div>

                <div className="card-footer">
                  <span className="date">Applied {formatDate(app.created_at)}</span>
                  {app.reviewed_at && <span className="reviewed">Reviewed {formatDate(app.reviewed_at)}</span>}
                </div>
              </div>

              <div className="card-action">
                <button className="btn-review">Review Application →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
