import { supabase, isSupabaseReady } from './supabase';

// =====================================================
// TYPES
// =====================================================

export interface ParticipantForMatching {
  id: string;
  profileId: string;
  fullName: string;
  skills: string[];
  bio: string | null;
  availabilityHoursPerWeek: number | null;
  cohortId: string | null;
  cohortName?: string;
  hasMatch: boolean;
}

export interface FounderForMatching {
  id: string;
  profileId: string;
  fullName: string;
  companyName: string | null;
  industry: string | null;
  bio: string | null;
  helpNeeded?: string;
  matchCount: number;
}

export interface Match {
  id: string;
  participantId: string;
  founderId: string;
  matchedBy: string | null;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  matchedAt: string;
  endedAt: string | null;
  notes: string | null;
  participant?: {
    fullName: string;
    skills: string[];
  };
  founder?: {
    fullName: string;
    companyName: string | null;
  };
}

export interface CreateMatchData {
  participantId: string;
  founderId: string;
  notes?: string;
}

// =====================================================
// MATCHING FUNCTIONS
// =====================================================

/**
 * Get unmatched participants (no active matches)
 */
export async function getUnmatchedParticipants(): Promise<ParticipantForMatching[]> {
  if (isSupabaseReady() && supabase) {
    const { data: participants, error } = await supabase
      .from('participants')
      .select(`
        id,
        profile_id,
        bio,
        skills,
        availability_hours_per_week,
        cohort_id,
        cohorts:cohort_id (
          name
        ),
        profiles:profile_id (
          full_name
        )
      `)
      .eq('status', 'active')
      .eq('profile_completed', true);

    if (error) {
      console.error('Error fetching unmatched participants:', error);
      return [];
    }

    // Check which participants have active matches
    const { data: activeMatches } = await supabase
      .from('matches')
      .select('participant_id')
      .eq('status', 'active');

    const matchedParticipantIds = new Set(activeMatches?.map((m) => m.participant_id) || []);

    return participants
      .filter((p) => !matchedParticipantIds.has(p.id))
      .map((p: any) => ({
        id: p.id,
        profileId: p.profile_id,
        fullName: p.profiles?.full_name || 'Unknown',
        skills: p.skills || [],
        bio: p.bio,
        availabilityHoursPerWeek: p.availability_hours_per_week,
        cohortId: p.cohort_id,
        cohortName: p.cohorts?.name,
        hasMatch: false,
      }));
  } else {
    // Demo mode
    const participants = getLocalParticipants();
    const matches = getLocalMatches();
    const matchedParticipantIds = new Set(
      matches.filter((m) => m.status === 'active').map((m) => m.participantId)
    );

    return participants
      .filter((p) => !matchedParticipantIds.has(p.id))
      .map((p) => ({
        id: p.id,
        profileId: p.profileId,
        fullName: p.fullName || 'Participant',
        skills: p.skills || [],
        bio: p.bio || null,
        availabilityHoursPerWeek: p.availabilityHoursPerWeek || null,
        cohortId: p.cohortId,
        cohortName: p.cohortName,
        hasMatch: false,
      }));
  }
}

/**
 * Get all founders (with match count)
 */
export async function getFoundersForMatching(): Promise<FounderForMatching[]> {
  if (isSupabaseReady() && supabase) {
    const { data: founders, error } = await supabase
      .from('founders')
      .select(`
        id,
        profile_id,
        company_name,
        industry,
        bio,
        profiles:profile_id (
          full_name
        )
      `)
      .eq('profile_completed', true);

    if (error) {
      console.error('Error fetching founders:', error);
      return [];
    }

    // Get match counts for each founder
    const foundersWithCounts = await Promise.all(
      founders.map(async (founder: any) => {
        if (!supabase) {
          return {
            id: founder.id,
            profileId: founder.profile_id,
            fullName: founder.profiles?.full_name || 'Unknown',
            companyName: founder.company_name,
            industry: founder.industry,
            bio: founder.bio,
            matchCount: 0,
          };
        }

        const { count } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true })
          .eq('founder_id', founder.id)
          .eq('status', 'active');

        return {
          id: founder.id,
          profileId: founder.profile_id,
          fullName: founder.profiles?.full_name || 'Unknown',
          companyName: founder.company_name,
          industry: founder.industry,
          bio: founder.bio,
          matchCount: count || 0,
        };
      })
    );

    return foundersWithCounts;
  } else {
    // Demo mode
    const founders = getLocalFounders();
    const matches = getLocalMatches();

    return founders.map((f) => ({
      id: f.id,
      profileId: f.profileId,
      fullName: f.fullName || 'Founder',
      companyName: f.companyName || null,
      industry: f.industry || null,
      bio: f.bio || null,
      matchCount: matches.filter((m) => m.founderId === f.id && m.status === 'active').length,
    }));
  }
}

/**
 * Create a match
 */
export async function createMatch(
  matchData: CreateMatchData,
  adminId: string
): Promise<{ success: boolean; matchId?: string; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        participant_id: matchData.participantId,
        founder_id: matchData.founderId,
        matched_by: adminId,
        notes: matchData.notes,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating match:', error);
      return { success: false, error: error.message };
    }

    return { success: true, matchId: data.id };
  } else {
    // Demo mode
    const matches = getLocalMatches();
    const newMatch: Match = {
      id: crypto.randomUUID(),
      participantId: matchData.participantId,
      founderId: matchData.founderId,
      matchedBy: adminId,
      status: 'active',
      matchedAt: new Date().toISOString(),
      endedAt: null,
      notes: matchData.notes || null,
    };

    matches.push(newMatch);
    localStorage.setItem('careerup_demo_matches', JSON.stringify(matches));

    return { success: true, matchId: newMatch.id };
  }
}

/**
 * Get all matches with details
 */
export async function getAllMatches(): Promise<Match[]> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        participant_id,
        founder_id,
        matched_by,
        status,
        matched_at,
        ended_at,
        notes,
        participants:participant_id (
          profiles:profile_id (
            full_name
          ),
          skills
        ),
        founders:founder_id (
          company_name,
          profiles:profile_id (
            full_name
          )
        )
      `)
      .order('matched_at', { ascending: false });

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return data.map((m: any) => ({
      id: m.id,
      participantId: m.participant_id,
      founderId: m.founder_id,
      matchedBy: m.matched_by,
      status: m.status,
      matchedAt: m.matched_at,
      endedAt: m.ended_at,
      notes: m.notes,
      participant: {
        fullName: m.participants?.profiles?.full_name || 'Unknown',
        skills: m.participants?.skills || [],
      },
      founder: {
        fullName: m.founders?.profiles?.full_name || 'Unknown',
        companyName: m.founders?.company_name,
      },
    }));
  } else {
    // Demo mode
    const matches = getLocalMatches();
    const participants = getLocalParticipants();
    const founders = getLocalFounders();

    return matches.map((m) => {
      const participant = participants.find((p) => p.id === m.participantId);
      const founder = founders.find((f) => f.id === m.founderId);

      return {
        ...m,
        participant: {
          fullName: participant?.fullName || 'Unknown',
          skills: participant?.skills || [],
        },
        founder: {
          fullName: founder?.fullName || 'Unknown',
          companyName: founder?.companyName || null,
        },
      };
    });
  }
}

/**
 * Update match status
 */
export async function updateMatchStatus(
  matchId: string,
  status: 'active' | 'paused' | 'completed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseReady() && supabase) {
    const updateData: any = { status };
    if (status === 'completed' || status === 'cancelled') {
      updateData.ended_at = new Date().toISOString();
    }

    const { error } = await supabase.from('matches').update(updateData).eq('id', matchId);

    if (error) {
      console.error('Error updating match:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } else {
    // Demo mode
    const matches = getLocalMatches();
    const index = matches.findIndex((m) => m.id === matchId);

    if (index === -1) {
      return { success: false, error: 'Match not found' };
    }

    matches[index].status = status;
    if (status === 'completed' || status === 'cancelled') {
      matches[index].endedAt = new Date().toISOString();
    }

    localStorage.setItem('careerup_demo_matches', JSON.stringify(matches));
    return { success: true };
  }
}

// =====================================================
// DEMO MODE HELPERS
// =====================================================

interface LocalParticipant {
  id: string;
  profileId: string;
  fullName?: string;
  skills: string[];
  bio?: string | null;
  availabilityHoursPerWeek?: number | null;
  cohortId: string | null;
  cohortName?: string;
}

interface LocalFounder {
  id: string;
  profileId: string;
  fullName?: string;
  companyName: string | null;
  industry: string | null;
  bio: string | null;
}

function getLocalParticipants(): LocalParticipant[] {
  const stored = localStorage.getItem('careerup_demo_participant_profiles');
  return stored ? JSON.parse(stored) : [];
}

function getLocalFounders(): LocalFounder[] {
  const stored = localStorage.getItem('careerup_demo_founder_profiles');
  return stored ? JSON.parse(stored) : [];
}

function getLocalMatches(): Match[] {
  const stored = localStorage.getItem('careerup_demo_matches');
  return stored ? JSON.parse(stored) : [];
}

export function clearLocalMatches(): void {
  localStorage.removeItem('careerup_demo_matches');
}
