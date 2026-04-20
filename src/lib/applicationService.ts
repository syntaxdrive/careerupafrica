// Application submission utilities for both Supabase and demo mode
import { supabase, isSupabaseReady } from './supabase';
import { emailService } from './emailService';

export interface ApplicationSubmission {
  fullName: string;
  email: string;
  linkedinUrl: string;
  role: string;
  courseName?: string;
  hoursPerWeek: number;
  scenarioAnswer1: string;
  scenarioAnswer2: string;
  scenarioAnswer3: string;
  hasConsented: boolean;
}

// Submit application (works in both Supabase and demo mode)
export async function submitTalentApplication(data: ApplicationSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseReady()) {
      // Supabase mode: Insert into database
      const { error } = await supabase!.from('talent_applications').insert([
        {
          full_name: data.fullName,
          email: data.email,
          linkedin_url: data.linkedinUrl,
          role: data.role,
          course_name: data.courseName || null,
          hours_per_week: data.hoursPerWeek,
          scenario_answer_1: data.scenarioAnswer1,
          scenario_answer_2: data.scenarioAnswer2,
          scenario_answer_3: data.scenarioAnswer3,
          has_consented: data.hasConsented,
          status: 'pending',
        },
      ]);

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, error: error.message };
      }

      // Send application submission confirmation email
      await emailService.sendEmail({
        to: data.email,
        toName: data.fullName,
        type: 'application_submitted',
        data: {
          participantName: data.fullName,
          cohortName: 'CareerUp Africa Talent Program'
        }
      });

      return { success: true };
    } else {
      // Demo mode: Save to localStorage
      const applications = getLocalApplications();
      const newApplication = {
        id: `app_${Date.now()}`,
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      applications.push(newApplication);
      localStorage.setItem('careerup_demo_applications', JSON.stringify(applications));

      // Send application submission confirmation email in demo mode
      await emailService.sendEmail({
        to: data.email,
        toName: data.fullName,
        type: 'application_submitted',
        data: {
          participantName: data.fullName,
          participantId: newApplication.id,
          cohortName: 'CareerUp Africa Talent Program'
        }
      });

      console.log('Demo mode: Application saved to localStorage', newApplication);
      return { success: true };
    }
  } catch (error) {
    console.error('Application submission error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

// Get applications from localStorage (demo mode only)
export function getLocalApplications(): any[] {
  try {
    const stored = localStorage.getItem('careerup_demo_applications');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Clear demo applications (for testing)
export function clearLocalApplications(): void {
  localStorage.removeItem('careerup_demo_applications');
}
