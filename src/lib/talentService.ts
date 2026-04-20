import { supabase } from './supabase';

// =====================================================
// TYPES
// =====================================================

export interface TalentWithMetrics {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_email: string;
  skills: string[];
  bio?: string;
  availability_hours: number;
  match_id: string;
  match_status: string;
  matched_at: string;
  
  // Metrics
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  submitted_tasks: number;
  average_rating: number;
  badge_eligible_count: number;
  last_activity?: string;
}

// =====================================================
// GET FOUNDER'S MATCHED TALENT WITH METRICS
// =====================================================

export const getFounderTalent = async (founderId: string): Promise<TalentWithMetrics[]> => {
  const isDemoMode = !supabase || localStorage.getItem('careerup_demo_mode') === 'true';

  if (isDemoMode) {
    // Demo Mode
    const matches = JSON.parse(localStorage.getItem('careerup_demo_matches') || '[]');
    const participants = JSON.parse(localStorage.getItem('careerup_demo_participants') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
    const feedback = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');

    // Get active matches for this founder
    const founderMatches = matches.filter(
      (m: any) => m.founder_id === founderId && m.status === 'active'
    );

    return founderMatches.map((match: any) => {
      const participant = participants.find((p: any) => p.id === match.participant_id);
      const participantProfile = profiles.find((p: any) => p.id === participant?.user_id);

      // Calculate metrics
      const participantTasks = tasks.filter((t: any) => t.participant_id === match.participant_id);
      const participantFeedback = feedback.filter((f: any) => f.participant_id === match.participant_id);

      const completedTasks = participantTasks.filter((t: any) =>
        ['approved', 'badge_eligible'].includes(t.status)
      ).length;
      const inProgressTasks = participantTasks.filter((t: any) =>
        ['not_started', 'in_progress'].includes(t.status)
      ).length;
      const submittedTasks = participantTasks.filter((t: any) =>
        ['submitted', 'under_review'].includes(t.status)
      ).length;

      const avgRating =
        participantFeedback.length > 0
          ? participantFeedback.reduce((acc: number, f: any) => acc + f.overall_rating, 0) /
            participantFeedback.length
          : 0;

      const badgeEligibleCount = participantFeedback.filter((f: any) => f.badge_eligible).length;

      // Find last activity
      const allDates = [
        ...participantTasks.map((t: any) => new Date(t.updated_at).getTime()),
        ...participantFeedback.map((f: any) => new Date(f.created_at).getTime()),
      ];
      const lastActivity = allDates.length > 0 ? new Date(Math.max(...allDates)).toISOString() : undefined;

      return {
        id: participant?.id || match.participant_id,
        participant_id: match.participant_id,
        participant_name: participantProfile?.full_name || 'Unknown',
        participant_email: participantProfile?.email || '',
        skills: participant?.skills || [],
        bio: participant?.bio,
        availability_hours: participant?.availability_hours_per_week || 0,
        match_id: match.id,
        match_status: match.status,
        matched_at: match.matched_at,
        total_tasks: participantTasks.length,
        completed_tasks: completedTasks,
        in_progress_tasks: inProgressTasks,
        submitted_tasks: submittedTasks,
        average_rating: Math.round(avgRating * 10) / 10,
        badge_eligible_count: badgeEligibleCount,
        last_activity: lastActivity,
      };
    });
  }

  // Supabase Mode
  if (!supabase) throw new Error('Supabase client not initialized');

  try {
    // Get matches with participant details
    const { data: matchesData, error: matchesError } = await supabase
      .from('matches')
      .select(
        `
        id,
        participant_id,
        founder_id,
        status,
        matched_at,
        participants!inner(
          id,
          user_id,
          skills,
          bio,
          availability_hours_per_week,
          profiles!inner(
            full_name,
            email
          )
        )
      `
      )
      .eq('founder_id', founderId)
      .eq('status', 'active');

    if (matchesError) throw matchesError;
    if (!matchesData || matchesData.length === 0) return [];

    // Get task counts and metrics for each participant
    const talentWithMetrics = await Promise.all(
      matchesData.map(async (match: any) => {
        if (!supabase) throw new Error('Supabase client not initialized');
        
        const participantId = match.participant_id;

        // Get tasks
        const { data: tasksData } = await supabase
          .from('tasks')
          .select('id, status, updated_at')
          .eq('participant_id', participantId);

        // Get feedback
        const { data: feedbackData } = await supabase
          .from('feedback')
          .select('overall_rating, badge_eligible, created_at')
          .eq('participant_id', participantId);

        const tasks = tasksData || [];
        const feedbackList = feedbackData || [];

        const completedTasks = tasks.filter((t: any) =>
          ['approved', 'badge_eligible'].includes(t.status)
        ).length;
        const inProgressTasks = tasks.filter((t: any) =>
          ['not_started', 'in_progress'].includes(t.status)
        ).length;
        const submittedTasks = tasks.filter((t: any) =>
          ['submitted', 'under_review'].includes(t.status)
        ).length;

        const avgRating =
          feedbackList.length > 0
            ? feedbackList.reduce((acc: number, f: any) => acc + f.overall_rating, 0) /
              feedbackList.length
            : 0;

        const badgeEligibleCount = feedbackList.filter((f: any) => f.badge_eligible).length;

        // Find last activity
        const allDates = [
          ...tasks.map((t: any) => new Date(t.updated_at).getTime()),
          ...feedbackList.map((f: any) => new Date(f.created_at).getTime()),
        ];
        const lastActivity =
          allDates.length > 0 ? new Date(Math.max(...allDates)).toISOString() : undefined;

        return {
          id: match.participants.id,
          participant_id: participantId,
          participant_name: match.participants.profiles.full_name,
          participant_email: match.participants.profiles.email,
          skills: match.participants.skills || [],
          bio: match.participants.bio,
          availability_hours: match.participants.availability_hours_per_week,
          match_id: match.id,
          match_status: match.status,
          matched_at: match.matched_at,
          total_tasks: tasks.length,
          completed_tasks: completedTasks,
          in_progress_tasks: inProgressTasks,
          submitted_tasks: submittedTasks,
          average_rating: Math.round(avgRating * 10) / 10,
          badge_eligible_count: badgeEligibleCount,
          last_activity: lastActivity,
        };
      })
    );

    return talentWithMetrics;
  } catch (error) {
    console.error('Error fetching founder talent:', error);
    throw error;
  }
};
