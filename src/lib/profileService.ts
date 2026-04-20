import { supabase, isSupabaseReady } from './supabase';

// =====================================================
// TYPES
// =====================================================

export interface TalentProfileData {
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  availabilityHoursPerWeek?: number;
  portfolioLinks?: { title: string; url: string }[];
}

export interface FounderProfileData {
  companyLogoUrl?: string;
  companyDescription?: string;
  teamSize?: number;
  taskPreferences?: {
    preferredTaskTypes?: string[];
    industryFocus?: string;
    otherNotes?: string;
  };
}

export interface ParticipantProfile {
  id: string;
  profileId: string;
  cohortId: string | null;
  bio: string | null;
  skills: string[];
  avatarUrl: string | null;
  portfolioLinks: { title: string; url: string }[];
  availabilityHoursPerWeek: number | null;
  profileCompleted: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FounderProfile {
  id: string;
  profileId: string;
  companyName: string | null;
  industry: string | null;
  bio: string | null;
  companyLogoUrl: string | null;
  teamSize: number | null;
  taskPreferences: {
    preferredTaskTypes?: string[];
    industryFocus?: string;
    otherNotes?: string;
  };
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// TALENT PROFILE FUNCTIONS (PARTICIPANTS)
// =====================================================

/**
 * Get participant profile by user ID
 */
export async function getParticipantProfile(
  userId: string
): Promise<ParticipantProfile | null> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('profile_id', userId)
      .single();

    if (error) {
      console.error('Error fetching participant profile:', error);
      return null;
    }

    return data ? transformParticipantFromDb(data) : null;
  } else {
    // Demo mode
    const profiles = getLocalParticipantProfiles();
    return profiles.find((p) => p.profileId === userId) || null;
  }
}

/**
 * Update participant profile
 */
export async function updateParticipantProfile(
  userId: string,
  profileData: TalentProfileData
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const { error } = await supabase
      .from('participants')
      .update({
        avatar_url: profileData.avatarUrl,
        bio: profileData.bio,
        skills: profileData.skills,
        availability_hours_per_week: profileData.availabilityHoursPerWeek,
        portfolio_links: profileData.portfolioLinks,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', userId);

    if (error) {
      console.error('Error updating participant profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } else {
    // Demo mode - store in localStorage
    const profiles = getLocalParticipantProfiles();
    const index = profiles.findIndex((p) => p.profileId === userId);

    const updatedProfile: ParticipantProfile = {
      id: index >= 0 ? profiles[index].id : crypto.randomUUID(),
      profileId: userId,
      cohortId: index >= 0 ? profiles[index].cohortId : null,
      bio: profileData.bio || null,
      skills: profileData.skills || [],
      avatarUrl: profileData.avatarUrl || null,
      portfolioLinks: profileData.portfolioLinks || [],
      availabilityHoursPerWeek: profileData.availabilityHoursPerWeek || null,
      profileCompleted: true,
      status: index >= 0 ? profiles[index].status : 'active',
      createdAt: index >= 0 ? profiles[index].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      profiles[index] = updatedProfile;
    } else {
      profiles.push(updatedProfile);
    }

    localStorage.setItem(
      'careerup_demo_participant_profiles',
      JSON.stringify(profiles)
    );

    return { success: true };
  }
}

/**
 * Create initial participant record (called after application approval)
 */
export async function createParticipantRecord(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const { error } = await supabase.from('participants').insert({
      profile_id: userId,
      profile_completed: false,
      status: 'active',
    });

    if (error) {
      console.error('Error creating participant record:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } else {
    // Demo mode
    const profiles = getLocalParticipantProfiles();
    const newProfile: ParticipantProfile = {
      id: crypto.randomUUID(),
      profileId: userId,
      cohortId: null,
      bio: null,
      skills: [],
      avatarUrl: null,
      portfolioLinks: [],
      availabilityHoursPerWeek: null,
      profileCompleted: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    localStorage.setItem(
      'careerup_demo_participant_profiles',
      JSON.stringify(profiles)
    );

    return { success: true };
  }
}

// =====================================================
// FOUNDER PROFILE FUNCTIONS
// =====================================================

/**
 * Get founder profile by user ID
 */
export async function getFounderProfile(
  userId: string
): Promise<FounderProfile | null> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from('founders')
      .select('*')
      .eq('profile_id', userId)
      .single();

    if (error) {
      console.error('Error fetching founder profile:', error);
      return null;
    }

    return data ? transformFounderFromDb(data) : null;
  } else {
    // Demo mode
    const profiles = getLocalFounderProfiles();
    return profiles.find((f) => f.profileId === userId) || null;
  }
}

/**
 * Update founder profile
 */
export async function updateFounderProfile(
  userId: string,
  profileData: FounderProfileData
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const { error } = await supabase
      .from('founders')
      .update({
        company_logo_url: profileData.companyLogoUrl,
        bio: profileData.companyDescription, // Using bio field for company description
        team_size: profileData.teamSize,
        task_preferences: profileData.taskPreferences,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', userId);

    if (error) {
      console.error('Error updating founder profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } else {
    // Demo mode - store in localStorage
    const profiles = getLocalFounderProfiles();
    const index = profiles.findIndex((f) => f.profileId === userId);

    const updatedProfile: FounderProfile = {
      id: index >= 0 ? profiles[index].id : crypto.randomUUID(),
      profileId: userId,
      companyName: index >= 0 ? profiles[index].companyName : null,
      industry: index >= 0 ? profiles[index].industry : null,
      bio: profileData.companyDescription || null,
      companyLogoUrl: profileData.companyLogoUrl || null,
      teamSize: profileData.teamSize || null,
      taskPreferences: profileData.taskPreferences || {},
      profileCompleted: true,
      createdAt: index >= 0 ? profiles[index].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      profiles[index] = updatedProfile;
    } else {
      profiles.push(updatedProfile);
    }

    localStorage.setItem(
      'careerup_demo_founder_profiles',
      JSON.stringify(profiles)
    );

    return { success: true };
  }
}

/**
 * Create initial founder record (called after application approval)
 */
export async function createFounderRecord(
  userId: string,
  companyName?: string,
  industry?: string
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const { error } = await supabase.from('founders').insert({
      profile_id: userId,
      company_name: companyName,
      industry: industry,
      profile_completed: false,
    });

    if (error) {
      console.error('Error creating founder record:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } else {
    // Demo mode
    const profiles = getLocalFounderProfiles();
    const newProfile: FounderProfile = {
      id: crypto.randomUUID(),
      profileId: userId,
      companyName: companyName || null,
      industry: industry || null,
      bio: null,
      companyLogoUrl: null,
      teamSize: null,
      taskPreferences: {},
      profileCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    localStorage.setItem(
      'careerup_demo_founder_profiles',
      JSON.stringify(profiles)
    );

    return { success: true };
  }
}

// =====================================================
// DEMO MODE HELPERS
// =====================================================

function getLocalParticipantProfiles(): ParticipantProfile[] {
  const stored = localStorage.getItem('careerup_demo_participant_profiles');
  return stored ? JSON.parse(stored) : [];
}

function getLocalFounderProfiles(): FounderProfile[] {
  const stored = localStorage.getItem('careerup_demo_founder_profiles');
  return stored ? JSON.parse(stored) : [];
}

export function clearLocalProfiles(): void {
  localStorage.removeItem('careerup_demo_participant_profiles');
  localStorage.removeItem('careerup_demo_founder_profiles');
}

// =====================================================
// TRANSFORM HELPERS
// =====================================================

function transformParticipantFromDb(data: any): ParticipantProfile {
  return {
    id: data.id,
    profileId: data.profile_id,
    cohortId: data.cohort_id,
    bio: data.bio,
    skills: data.skills || [],
    avatarUrl: data.avatar_url,
    portfolioLinks: data.portfolio_links || [],
    availabilityHoursPerWeek: data.availability_hours_per_week,
    profileCompleted: data.profile_completed || false,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function transformFounderFromDb(data: any): FounderProfile {
  return {
    id: data.id,
    profileId: data.profile_id,
    companyName: data.company_name,
    industry: data.industry,
    bio: data.bio,
    companyLogoUrl: data.company_logo_url,
    teamSize: data.team_size,
    taskPreferences: data.task_preferences || {},
    profileCompleted: data.profile_completed || false,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
