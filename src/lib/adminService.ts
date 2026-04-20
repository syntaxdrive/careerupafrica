// Admin service for managing talent applications
import { supabase, isSupabaseReady } from './supabase';
import { getLocalApplications } from './applicationService';
import { emailService } from './emailService';

export interface TalentApplication {
  id: string;
  full_name: string;
  email: string;
  linkedin_url: string;
  role: string;
  course_name?: string;
  hours_per_week: number;
  scenario_answer_1: string;
  scenario_answer_2: string;
  scenario_answer_3: string;
  has_consented: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_info';
  admin_notes?: string;
  rejection_reason?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  score_clarity?: number;
  score_structure?: number;
  score_actionability?: number;
  score_communication?: number;
  score_originality?: number;
  created_at: string;
  updated_at?: string;
}

// Fetch all applications (admin only)
export async function fetchApplications(filters?: {
  status?: string;
  role?: string;
}): Promise<{ data: TalentApplication[]; error?: string }> {
  try {
    if (isSupabaseReady()) {
      let query = supabase!.from('talent_applications').select('*').order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Fetch applications error:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } else {
      // Demo mode: Get from localStorage
      let applications = getLocalApplications();

      // Apply filters
      if (filters?.status) {
        applications = applications.filter((app: any) => app.status === filters.status);
      }
      if (filters?.role) {
        applications = applications.filter((app: any) => app.role === filters.role);
      }

      // Sort by created_at descending
      applications.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return { data: applications };
    }
  } catch (error) {
    console.error('Fetch applications error:', error);
    return { data: [], error: 'Failed to fetch applications' };
  }
}

// Fetch single application by ID
export async function fetchApplicationById(id: string): Promise<{ data: TalentApplication | null; error?: string }> {
  try {
    if (isSupabaseReady()) {
      const { data, error } = await supabase!.from('talent_applications').select('*').eq('id', id).single();

      if (error) {
        console.error('Fetch application error:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } else {
      // Demo mode
      const applications = getLocalApplications();
      const application = applications.find((app: any) => app.id === id);
      return { data: application || null };
    }
  } catch (error) {
    console.error('Fetch application error:', error);
    return { data: null, error: 'Failed to fetch application' };
  }
}

// Update application (review, scoring, status change)
export async function updateApplication(
  id: string,
  updates: Partial<TalentApplication>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current application first to send notifications
    const { data: currentApp } = await fetchApplicationById(id);
    
    if (isSupabaseReady()) {
      const { error } = await supabase!
        .from('talent_applications')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Update application error:', error);
        return { success: false, error: error.message };
      }

      // Send notification emails for status changes
      if (currentApp && updates.status && updates.status !== currentApp.status) {
        await sendStatusChangeNotification(currentApp, updates.status);
      }

      return { success: true };
    } else {
      // Demo mode
      const applications = getLocalApplications();
      const index = applications.findIndex((app: any) => app.id === id);

      if (index === -1) {
        return { success: false, error: 'Application not found' };
      }

      applications[index] = {
        ...applications[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem('careerup_demo_applications', JSON.stringify(applications));

      // Send notification for status changes in demo mode too
      if (currentApp && updates.status && updates.status !== currentApp.status) {
        await sendStatusChangeNotification({ ...currentApp, ...updates }, updates.status);
      }

      return { success: true };
    }
  } catch (error) {
    console.error('Update application error:', error);
    return { success: false, error: 'Failed to update application' };
  }
}

// Helper function to send status change notifications
async function sendStatusChangeNotification(application: TalentApplication, newStatus: string) {
  try {
    if (newStatus === 'approved') {
      await emailService.sendEmail({
        to: application.email,
        toName: application.full_name,
        type: 'application_approved',
        data: {
          participantName: application.full_name,
          participantId: application.id,
          cohortName: 'CareerUp Africa Talent Program',
          applicationId: application.id
        }
      });
    } else if (newStatus === 'rejected') {
      await emailService.sendEmail({
        to: application.email,
        toName: application.full_name,
        type: 'application_rejected',
        data: {
          participantName: application.full_name,
          participantId: application.id,
          cohortName: 'CareerUp Africa Talent Program',
          reason: application.rejection_reason || '',
          applicationId: application.id
        }
      });
    }
  } catch (error) {
    console.error('Failed to send status change notification:', error);
  }
}

// Get application statistics
export async function getApplicationStats(): Promise<{
  total: number;
  pending: number;
  under_review: number;
  approved: number;
  rejected: number;
}> {
  try {
    const { data } = await fetchApplications();

    return {
      total: data.length,
      pending: data.filter((app) => app.status === 'pending').length,
      under_review: data.filter((app) => app.status === 'under_review').length,
      approved: data.filter((app) => app.status === 'approved').length,
      rejected: data.filter((app) => app.status === 'rejected').length,
    };
  } catch (error) {
    return { total: 0, pending: 0, under_review: 0, approved: 0, rejected: 0 };
  }
}
