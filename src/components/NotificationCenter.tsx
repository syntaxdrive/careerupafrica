import { useState, useEffect } from 'react';
import { notificationStore } from '../lib/emailService';
import type { NotificationRecord } from '../lib/emailService';
import { useAuthStore } from '../stores/authStore';
import './NotificationCenter.css';

export default function NotificationCenter() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Load initial notifications
    updateNotifications();

    // Subscribe to changes
    const unsubscribe = notificationStore.subscribe(() => {
      updateNotifications();
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const updateNotifications = () => {
    if (!user) return;
    const userNotifications = notificationStore.getNotifications(user.id);
    setNotifications(userNotifications);
    setUnreadCount(notificationStore.getUnreadCount(user.id));
  };

  const handleMarkAsRead = (notificationId: string) => {
    notificationStore.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      notificationStore.markAllAsRead(user.id);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_approved':
        return '🎉';
      case 'application_rejected':
        return '📋';
      case 'task_assigned':
        return '📝';
      case 'task_deadline_reminder':
        return '⏰';
      case 'badge_awarded':
        return '🏆';
      case 'feedback_received':
        return '💬';
      case 'application_submitted':
        return '✓';
      default:
        return '📬';
    }
  };

  if (!user) return null;

  return (
    <div className="notification-center">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="bell-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button
                  className="mark-all-read"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <p>No notifications yet</p>
                  <span className="no-notif-icon">📭</span>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.subject}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {formatDate(notification.sentAt)}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="unread-indicator" />
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="notification-footer">
                <p className="demo-note">
                  💡 Demo Mode: These are in-app notifications. In production, they would be sent as emails.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
