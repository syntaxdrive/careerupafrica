import { supabase, isSupabaseReady } from './supabase';

// =====================================================
// TYPES
// =====================================================

export interface CohortData {
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  maxParticipants?: number;
  description?: string;
}

export interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  description: string | null;
  createdAt: string;
  updatedAt: string;
  participantCount?: number; // Computed field
}

export interface CohortWithDetails extends Cohort {
  participants: Array<{
    id: string;
    profileId: string;
    fullName: string;
    skills: string[];
    status: string;
  }>;
}

// =====================================================
// COHORT MANAGEMENT FUNCTIONS
// =====================================================

/**
 * Get all cohorts with participant counts
 */
export async function getAllCohorts(): Promise<Cohort[]> {
  if (isSupabaseReady() && supabase) {
    const { data: cohorts, error } = await supabase
      .from('cohorts')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching cohorts:', error);
      return [];
    }

    // Get participant counts for each cohort
    const cohortsWithCounts = await Promise.all(
      cohorts.map(async (cohort) => {
        if (!supabase) {
          return {
            ...transformCohortFromDb(cohort),
            participantCount: 0,
          };
        }

        const { count } = await supabase
          .from('participants')
          .select('*', { count: 'exact', head: true })
          .eq('cohort_id', cohort.id);

        return {
          ...transformCohortFromDb(cohort),
          participantCount: count || 0,
        };
      })
    );

    return cohortsWithCounts;
  } else {
    // Demo mode
    const cohorts = getLocalCohorts();
    const participants = getLocalParticipants();

    return cohorts.map((cohort) => ({
      ...cohort,
      participantCount: participants.filter((p) => p.cohortId === cohort.id).length,
    }));
  }
}

/**
 * Get cohort by ID with full details
 */
export async function getCohortById(cohortId: string): Promise<CohortWithDetails | null> {
  if (isSupabaseReady() && supabase) {
    const { data: cohort, error: cohortError } = await supabase
      .from('cohorts')
      .select('*')
      .eq('id', cohortId)
      .single();

    if (cohortError || !cohort) {
      console.error('Error fetching cohort:', cohortError);
      return null;
    }

    // Get participants in this cohort with profile data
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select(`
        id,
        profile_id,
        skills,
        status,
        profiles:profile_id (
          full_name
        )
      `)
      .eq('cohort_id', cohortId);

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
    }

    const transformedParticipants =
      participants?.map((p: any) => ({
        id: p.id,
        profileId: p.profile_id,
        fullName: p.profiles?.full_name || 'Unknown',
        skills: p.skills || [],
        status: p.status,
      })) || [];

    return {
      ...transformCohortFromDb(cohort),
      participants: transformedParticipants,
      participantCount: transformedParticipants.length,
    };
  } else {
    // Demo mode
    const cohorts = getLocalCohorts();
    const cohort = cohorts.find((c) => c.id === cohortId);
    if (!cohort) return null;

    const participants = getLocalParticipants();
    const cohortParticipants = participants.filter((p) => p.cohortId === cohortId);

    return {
      ...cohort,
      participants: cohortParticipants.map((p) => ({
        id: p.id,
        profileId: p.profileId,
        fullName: p.fullName || 'Participant',
        skills: p.skills || [],
        status: p.status,
      })),
      participantCount: cohortParticipants.length,
    };
  }
}

/**
 * Create a new cohort
 */
export async function createCohort(
  cohortData: CohortData
): Promise<{ success: boolean; cohortId?: string; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from('cohorts')
      .insert({
        name: cohortData.name,
        start_date: cohortData.startDate,
        end_date: cohortData.endDate,
        max_participants: cohortData.maxParticipants || 20,
        description: cohortData.description,
        status: 'upcoming',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating cohort:', error);
      return { success: false, error: error.message };
    }

    return { success: true, cohortId: data.id };
  } else {
    // Demo mode
    const cohorts = getLocalCohorts();
    const newCohort: Cohort = {
      id: crypto.randomUUID(),
      name: cohortData.name,
      startDate: cohortData.startDate,
      endDate: cohortData.endDate,
      maxParticipants: cohortData.maxParticipants || 20,
      status: 'upcoming',
      description: cohortData.description || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participantCount: 0,
    };

    cohorts.push(newCohort);
    localStorage.setItem('careerup_demo_cohorts', JSON.stringify(cohorts));

    return { success: true, cohortId: newCohort.id };
  }
}

/**
 * Update cohort
 */
export async function updateCohort(
  cohortId: string,
  updates: Partial<CohortData> & { status?: 'upcoming' | 'active' | 'completed' }
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.startDate) updateData.start_date = updates.startDate;
    if (updates.endDate) updateData.end_date = updates.endDate;
    if (updates.maxParticipants) updateData.max_participants = updates.maxParticipants;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status) updateData.status = updates.status;

    const { error } = await supabase
      .from('cohorts')
      .update(updateData)
      .eq('id', cohortId);

    if (error) {
      console.error('Error updating cohort:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } else {
    // Demo mode
    const cohorts = getLocalCohorts();
    const index = cohorts.findIndex((c) => c.id === cohortId);

    if (index === -1) {
      return { success: false, error: 'Cohort not found' };
    }

    if (updates.name) cohorts[index].name = updates.name;
    if (updates.startDate) cohorts[index].startDate = updates.startDate;
    if (updates.endDate) cohorts[index].endDate = updates.endDate;
    if (updates.maxParticipants) cohorts[index].maxParticipants = updates.maxParticipants;
    if (updates.description !== undefined) cohorts[index].description = updates.description;
    if (updates.status) cohorts[index].status = updates.status;
    cohorts[index].updatedAt = new Date().toISOString();

    localStorage.setItem('careerup_demo_cohorts', JSON.stringify(cohorts));
    return { success: true };
  }
}

/**
 * Assign participant to cohort
 */
export async function assignParticipantToCohort(
  participantId: string,
  cohortId: string
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const { error } = await supabase
      .from('participants')
      .update({ cohort_id: cohortId })
      .eq('id', participantId);

    if (error) {
      console.error('Error assigning participant to cohort:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } else {
    // Demo mode
    const participants = getLocalParticipants();
    const index = participants.findIndex((p) => p.id === participantId);

    if (index === -1) {
      return { success: false, error: 'Participant not found' };
    }

    participants[index].cohortId = cohortId;
    localStorage.setItem('careerup_demo_participant_profiles', JSON.stringify(participants));
    return { success: true };
  }
}

/**
 * Get unassigned participants (no cohort)
 */
export async function getUnassignedParticipants(): Promise<
  Array<{
    id: string;
    profileId: string;
    fullName: string;
    skills: string[];
  }>
> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from('participants')
      .select(`
        id,
        profile_id,
        skills,
        profiles:profile_id (
          full_name
        )
      `)
      .is('cohort_id', null)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching unassigned participants:', error);
      return [];
    }

    return data.map((p: any) => ({
      id: p.id,
      profileId: p.profile_id,
      fullName: p.profiles?.full_name || 'Unknown',
      skills: p.skills || [],
    }));
  } else {
    // Demo mode
    const participants = getLocalParticipants();
    return participants
      .filter((p) => !p.cohortId && p.status === 'active')
      .map((p) => ({
        id: p.id,
        profileId: p.profileId,
        fullName: p.fullName || 'Participant',
        skills: p.skills || [],
      }));
  }
}

/**
 * Delete cohort
 */
export async function deleteCohort(cohortId: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const { error } = await supabase.from('cohorts').delete().eq('id', cohortId);

    if (error) {
      console.error('Error deleting cohort:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } else {
    // Demo mode
    const cohorts = getLocalCohorts();
    const filtered = cohorts.filter((c) => c.id !== cohortId);
    localStorage.setItem('careerup_demo_cohorts', JSON.stringify(filtered));
    return { success: true };
  }
}

// =====================================================
// DEMO MODE HELPERS
// =====================================================

interface LocalParticipant {
  id: string;
  profileId: string;
  cohortId: string | null;
  fullName?: string;
  skills: string[];
  status: string;
}

function getLocalCohorts(): Cohort[] {
  const stored = localStorage.getItem('careerup_demo_cohorts');
  return stored ? JSON.parse(stored) : [];
}

function getLocalParticipants(): LocalParticipant[] {
  const stored = localStorage.getItem('careerup_demo_participant_profiles');
  return stored ? JSON.parse(stored) : [];
}

export function clearLocalCohorts(): void {
  localStorage.removeItem('careerup_demo_cohorts');
}

// =====================================================
// TRANSFORM HELPERS
// =====================================================

function transformCohortFromDb(data: any): Cohort {
  return {
    id: data.id,
    name: data.name,
    startDate: data.start_date,
    endDate: data.end_date,
    maxParticipants: data.max_participants || 20,
    status: data.status,
    description: data.description,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
