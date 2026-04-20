import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicationStats } from '../../lib/adminService';
import './Dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getApplicationStats();
    setStats(data);
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        <div className="dashboard-hero">
          <h2>Admin Dashboard</h2>
          <p className="text-secondary">Review applications & manage platform</p>
        </div>

        {/* Application Stats */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Talent Applications</h3>
            <button onClick={() => navigate('/admin/applications')} className="btn-primary">
              Review Applications →
            </button>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card card-clickable" onClick={() => navigate('/admin/applications')}>
              <h3>Total Applications</h3>
              <div className="stat">{loading ? '...' : stats.total}</div>
              <p>All time applications</p>
            </div>

            <div className="dashboard-card card-pending" onClick={() => navigate('/admin/applications?status=pending')}>
              <h3>Pending Review</h3>
              <div className="stat">{loading ? '...' : stats.pending}</div>
              <p>Awaiting your review</p>
            </div>

            <div
              className="dashboard-card card-reviewing"
              onClick={() => navigate('/admin/applications?status=under_review')}
            >
              <h3>Under Review</h3>
              <div className="stat">{loading ? '...' : stats.under_review}</div>
              <p>Currently reviewing</p>
            </div>

            <div className="dashboard-card card-approved" onClick={() => navigate('/admin/applications?status=approved')}>
              <h3>Approved</h3>
              <div className="stat">{loading ? '...' : stats.approved}</div>
              <p>Ready for cohort</p>
            </div>
          </div>
        </div>

        {/* Other Platform Stats */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Cohort Management</h3>
            <button onClick={() => navigate('/admin/cohorts')} className="btn-primary">
              Manage Cohorts →
            </button>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card card-clickable" onClick={() => navigate('/admin/cohorts')}>
              <h3>Total Cohorts</h3>
              <div className="stat">0</div>
              <p>Create your first cohort</p>
            </div>

            <div className="dashboard-card">
              <h3>Active Participants</h3>
              <div className="stat">0</div>
              <p>No participants yet</p>
            </div>

            <div className="dashboard-card">
              <h3>Badges Validated</h3>
              <div className="stat">0</div>
              <p>No badges validated yet</p>
            </div>

            <div className="dashboard-card">
              <h3>Platform Activity</h3>
              <div className="stat">Low</div>
              <p>Just getting started</p>
            </div>
          </div>
        </div>

        {/* Matching System */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Manual Matching</h3>
            <button onClick={() => navigate('/admin/matching')} className="btn-primary">
              Match Talent & Founders →
            </button>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card card-clickable" onClick={() => navigate('/admin/matching')}>
              <h3>Active Matches</h3>
              <div className="stat">0</div>
              <p>No active matches yet</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Matches</h3>
              <div className="stat">0</div>
              <p>Start matching talent with founders</p>
            </div>

            <div className="dashboard-card">
              <h3>Unmatched Talent</h3>
              <div className="stat">-</div>
              <p>Available for matching</p>
            </div>

            <div className="dashboard-card">
              <h3>Match Success Rate</h3>
              <div className="stat">-</div>
              <p>No data yet</p>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <p>🚧 Additional admin features coming soon</p>
        </div>
      </main>
    </div>
  );
}
