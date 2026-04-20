import type { TaskWithDetails } from '../../lib/taskService';
import './TaskCard.css';

interface TaskCardProps {
  task: TaskWithDetails;
  onClick: () => void;
  viewMode: 'founder' | 'participant';
}

export default function TaskCard({ task, onClick, viewMode }: TaskCardProps) {
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'approved';
  const daysUntilDue = Math.ceil(
    (new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'status-not-started';
      case 'in_progress':
        return 'status-in-progress';
      case 'submitted':
        return 'status-submitted';
      case 'under_review':
        return 'status-under-review';
      case 'revision_needed':
        return 'status-revision';
      case 'approved':
        return 'status-approved';
      case 'badge_eligible':
        return 'status-badge';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`} onClick={onClick}>
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`status-badge ${getStatusClass(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <div className="meta-row">
          <div className="meta-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 14C3 11.7909 5.23858 10 8 10C10.7614 10 13 11.7909 13 14"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>
              {viewMode === 'founder' ? task.participant_name : task.founder_name}
              {viewMode === 'founder' && task.founder_company && ` (${task.founder_company})`}
            </span>
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V8L11 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>
              Due: {new Date(task.due_date).toLocaleDateString()}
              {isOverdue && <span className="overdue-label"> (Overdue!)</span>}
              {!isOverdue && daysUntilDue <= 3 && daysUntilDue > 0 && (
                <span className="urgent-label"> ({daysUntilDue}d left)</span>
              )}
            </span>
          </div>

          <div className="meta-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 5H14M2 8H14M2 11H10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>
              Level {task.difficulty_level}/5 • {task.expected_hours}h
            </span>
          </div>
        </div>
      </div>

      {task.has_submission && (
        <div className="task-footer">
          <div className="submission-indicator">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 8L7 11L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Submission available</span>
          </div>
        </div>
      )}
    </div>
  );
}
