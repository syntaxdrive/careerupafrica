import { supabase } from './supabase';

// Email notification types
export type EmailType = 
  | 'application_approved'
  | 'application_rejected'
  | 'task_assigned'
  | 'task_deadline_reminder'
  | 'badge_awarded'
  | 'feedback_received'
  | 'application_submitted';

export interface EmailData {
  to: string;
  toName: string;
  type: EmailType;
  data: Record<string, any>;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  email: string;
  type: EmailType;
  subject: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  sentAt: Date;
}

// In-app notification store for demo mode
class NotificationStore {
  private notifications: NotificationRecord[] = [];
  private listeners: Set<(notifications: NotificationRecord[]) => void> = new Set();

  addNotification(notification: Omit<NotificationRecord, 'id' | 'sentAt' | 'read'>) {
    const newNotification: NotificationRecord = {
      ...notification,
      id: crypto.randomUUID(),
      sentAt: new Date(),
      read: false,
    };
    
    this.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notifyListeners();
    
    return newNotification;
  }

  getNotifications(userId: string): NotificationRecord[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  markAllAsRead(userId: string) {
    this.notifications
      .filter(n => n.userId === userId)
      .forEach(n => n.read = true);
    this.saveToStorage();
    this.notifyListeners();
  }

  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  subscribe(listener: (notifications: NotificationRecord[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  private saveToStorage() {
    try {
      localStorage.setItem('careerup_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('careerup_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          sentAt: new Date(n.sentAt),
        }));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  clear() {
    this.notifications = [];
    localStorage.removeItem('careerup_notifications');
    this.notifyListeners();
  }
}

export const notificationStore = new NotificationStore();

// Email templates
function getEmailSubject(type: EmailType, data: any): string {
  switch (type) {
    case 'application_approved':
      return `🎉 Your application to ${data.cohortName} has been approved!`;
    case 'application_rejected':
      return `Application Update - ${data.cohortName}`;
    case 'task_assigned':
      return `New Task Assigned: ${data.taskTitle}`;
    case 'task_deadline_reminder':
      return `⏰ Reminder: Task "${data.taskTitle}" due soon`;
    case 'badge_awarded':
      return `🏆 You've earned a new badge: ${data.badgeName}!`;
    case 'feedback_received':
      return `New feedback on your submission`;
    case 'application_submitted':
      return `✓ Application received for ${data.cohortName}`;
    default:
      return 'CareerUp Notification';
  }
}

function getEmailMessage(type: EmailType, data: any): string {
  switch (type) {
    case 'application_approved':
      return `Congratulations, ${data.participantName}! Your application to ${data.cohortName} has been approved. You can now access your tasks and start working on your program. Visit your dashboard to get started.`;
    
    case 'application_rejected':
      return `Dear ${data.participantName}, after careful review, we're unable to accept your application to ${data.cohortName} at this time. ${data.reason || 'We encourage you to apply again in the future or explore other opportunities on our platform.'}`;
    
    case 'task_assigned':
      return `Hi ${data.participantName}, you've been assigned a new task: "${data.taskTitle}". Due date: ${data.dueDate}. Description: ${data.taskDescription}`;
    
    case 'task_deadline_reminder':
      return `Hi ${data.participantName}, this is a reminder that your task "${data.taskTitle}" is due on ${data.dueDate}. Make sure to submit your work before the deadline!`;
    
    case 'badge_awarded':
      return `Congratulations, ${data.participantName}! You've earned the "${data.badgeName}" badge for ${data.cohortName}. Your badge is now visible on your public profile and can be verified at: ${data.verificationUrl}`;
    
    case 'feedback_received':
      return `Hi ${data.participantName}, you've received new feedback on your submission for "${data.taskTitle}". Rating: ${data.rating}/5. Check your dashboard to view the full feedback.`;
    
    case 'application_submitted':
      return `Dear ${data.participantName}, we've received your application to ${data.cohortName}. We'll review your motivation and experience, and get back to you soon. You can track your application status in your dashboard.`;
    
    default:
      return 'You have a new notification from CareerUp.';
  }
}

// Main email service
export class EmailService {
  private isSupabaseAvailable: boolean;

  constructor() {
    this.isSupabaseAvailable = !!supabase;
  }

  /**
   * Send an email notification
   * In demo mode: Creates an in-app notification
   * In production mode: Sends actual email via Supabase Edge Function
   */
  async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const subject = getEmailSubject(emailData.type, emailData.data);
      const message = getEmailMessage(emailData.type, emailData.data);

      // Demo mode: Store as in-app notification
      if (!this.isSupabaseAvailable) {
        notificationStore.addNotification({
          userId: emailData.data.userId || emailData.data.participantId || '',
          email: emailData.to,
          type: emailData.type,
          subject,
          message,
          data: emailData.data,
        });

        console.log('📧 [Demo Mode] Email notification created:', {
          to: emailData.to,
          type: emailData.type,
          subject,
        });

        return { success: true };
      }

      // Production mode: Call Supabase Edge Function
      const { error } = await supabase!.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          toName: emailData.toName,
          subject,
          message,
          type: emailData.type,
          data: emailData.data,
        },
      });

      if (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Email sent successfully:', emailData.type);
      return { success: true };
    } catch (error) {
      console.error('Email service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send multiple emails at once
   */
  async sendBulkEmails(emails: EmailData[]): Promise<{ success: boolean; sent: number; failed: number }> {
    const results = await Promise.allSettled(
      emails.map(email => this.sendEmail(email))
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - sent;

    return { success: failed === 0, sent, failed };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Initialize notification store
notificationStore.loadFromStorage();
