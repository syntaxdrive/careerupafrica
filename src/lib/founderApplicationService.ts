// Founder application submission utilities for both Supabase and demo mode
import { supabase, isSupabaseReady } from './supabase';

export interface FounderApplicationSubmission {
  fullName: string;
  email: string;
  companyName: string;
  industry?: string;
  companyStage: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  helpNeeded: string;
  hoursPerWeek: number;
  hasConsented: boolean;
}

// Submit founder application (works in both Supabase and demo mode)
export async function submitFounderApplication(
  data: FounderApplicationSubmission
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseReady()) {
      // Supabase mode: Insert into database
      const { error } = await supabase!.from('founder_applications').insert([
        {
          full_name: data.fullName,
          email: data.email,
          company_name: data.companyName,
          industry: data.industry || null,
          company_stage: data.companyStage,
          linkedin_url: data.linkedinUrl || null,
          website_url: data.websiteUrl || null,
          help_needed: data.helpNeeded,
          hours_per_week: data.hoursPerWeek,
          has_consented: data.hasConsented,
          status: 'pending',
        },
      ]);

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } else {
      // Demo mode: Save to localStorage
      const applications = getLocalFounderApplications();
      const newApplication = {
        id: `founder_app_${Date.now()}`,
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      applications.push(newApplication);
      localStorage.setItem('careerup_demo_founder_applications', JSON.stringify(applications));

      console.log('Demo mode: Founder application saved to localStorage', newApplication);
      return { success: true };
    }
  } catch (error) {
    console.error('Founder application submission error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

// Get founder applications from localStorage (demo mode only)
export function getLocalFounderApplications(): any[] {
  try {
    const stored = localStorage.getItem('careerup_demo_founder_applications');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Clear demo founder applications (for testing)
export function clearLocalFounderApplications(): void {
  localStorage.removeItem('careerup_demo_founder_applications');
}
