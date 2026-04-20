import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getTasksByFounder, getTasksByParticipant, type TaskWithDetails } from '../../lib/taskService';
import TaskCard from '../../components/tasks/TaskCard';
import './TaskList.css';

export default function TaskList() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isFounder = profile?.user_type === 'founder';
  const isParticipant = profile?.user_type === 'participant';

  useEffect(() => {
    loadTasks();
  }, [user, profile]);

  useEffect(() => {
    applyFilters();
  }, [tasks, statusFilter]);

  const loadTasks = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      if (isFounder) {
        const data = await getTasksByFounder(user.id);
        setTasks(data);
      } else if (isParticipant) {
        const data = await getTasksByParticipant(user.id);
        setTasks(data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const getTaskCounts = () => {
    return {
      all: tasks.length,
      not_started: tasks.filter((t) => t.status === 'not_started').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      submitted: tasks.filter((t) => t.status === 'submitted').length,
      under_review: tasks.filter((t) => t.status === 'under_review').length,
      revision_needed: tasks.filter((t) => t.status === 'revision_needed').length,
      approved: tasks.filter((t) => t.status === 'approved').length,
    };
  };

  const counts = getTaskCounts();

  if (isLoading) {
    return (
      <div className="task-list-page">
        <main className="task-list-content">
          <div className="loading-state">
            <p>Loading tasks...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="task-list-page">
      <main className="task-list-content">
        <div className="task-list-hero">
          <div>
            <h2>{isFounder ? 'Your Tasks' : 'Assigned Tasks'}</h2>
            <p className="text-secondary">
              {isFounder
                ? "Track tasks you've assigned to your matched talent"
                : "Complete tasks to demonstrate your competence and earn badges"}
            </p>
          </div>
          {isFounder && (
            <button onClick={() => navigate('/tasks/create')} className="btn-create">
              + Create Task
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="task-stats">
          <div className="stat-card">
            <div className="stat-value">{counts.all}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          {isFounder ? (
            <>
              <div className="stat-card">
                <div className="stat-value">{counts.submitted + counts.under_review}</div>
                <div className="stat-label">Awaiting Review</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{counts.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card">
                <div className="stat-value">{counts.not_started + counts.in_progress}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{counts.approved}</div>
                <div className="stat-label">Completed</div>
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="task-filters">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({counts.all})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'not_started' ? 'active' : ''}`}
            onClick={() => setStatusFilter('not_started')}
          >
            Not Started ({counts.not_started})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in_progress')}
          >
            In Progress ({counts.in_progress})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'submitted' ? 'active' : ''}`}
            onClick={() => setStatusFilter('submitted')}
          >
            Submitted ({counts.submitted})
          </button>
          {isFounder && (
            <button
              className={`filter-btn ${statusFilter === 'under_review' ? 'active' : ''}`}
              onClick={() => setStatusFilter('under_review')}
            >
              Under Review ({counts.under_review})
            </button>
          )}
          <button
            className={`filter-btn ${statusFilter === 'revision_needed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('revision_needed')}
          >
            Needs Revision ({counts.revision_needed})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved ({counts.approved})
          </button>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path
                d="M16 24H48M16 34H48M16 44H36"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <rect
                x="10"
                y="10"
                width="44"
                height="44"
                rx="4"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <h3>No Tasks Found</h3>
            <p>
              {statusFilter === 'all'
                ? isFounder
                  ? 'Create your first task to start validating talent.'
                  : 'No tasks have been assigned to you yet.'
                : `No tasks with status "${statusFilter.replace('_', ' ')}".`}
            </p>
            {isFounder && statusFilter === 'all' && (
              <button onClick={() => navigate('/tasks/create')} className="btn-primary">
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => navigate(`/tasks/${task.id}`)}
                viewMode={isFounder ? 'founder' : 'participant'}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
