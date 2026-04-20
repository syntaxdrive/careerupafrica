import { supabase } from './supabase';
import { emailService } from './emailService';

// =====================================================
// TYPES
// =====================================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  criteria: string;
  icon: string;
  category: string;
  created_at: string;
}

export interface ParticipantBadge {
  id: string;
  participant_id: string;
  badge_id: string;
  validated_by: string;
  validated_at: string;
  task_ids: string[];
  validation_notes: string;
  created_at: string;
}

export interface ParticipantBadgeWithDetails extends ParticipantBadge {
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  badge_category: string;
  badge_criteria: string;
  participant_name: string;
  participant_email: string;
  validator_name: string;
  task_titles: string[];
}

export interface BadgeFormData {
  name: string;
  description: string;
  criteria: string;
  icon: string;
  category: string;
}

export interface AwardBadgeData {
  participant_id: string;
  badge_id: string;
  task_ids: string[];
  validation_notes: string;
}

// =====================================================
// BADGE CRUD OPERATIONS
// =====================================================

/**
 * Create a new badge type (Admin only)
 */
export async function createBadge(badgeData: BadgeFormData): Promise<Badge | null> {
  // Demo Mode
  if (!supabase) {
    const badge: Badge = {
      id: `badge_${Date.now()}`,
      name: badgeData.name,
      description: badgeData.description,
      criteria: badgeData.criteria,
      icon: badgeData.icon,
      category: badgeData.category,
      created_at: new Date().toISOString(),
    };

    const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
    badges.push(badge);
    localStorage.setItem('careerup_demo_badges', JSON.stringify(badges));

    return badge;
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('badges')
    .insert([
      {
        name: badgeData.name,
        description: badgeData.description,
        criteria: badgeData.criteria,
        icon: badgeData.icon,
        category: badgeData.category,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all badge types
 */
export async function getAllBadges(): Promise<Badge[]> {
  // Demo Mode
  if (!supabase) {
    const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
    return badges.sort((a: Badge, b: Badge) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get a single badge by ID
 */
export async function getBadgeById(badgeId: string): Promise<Badge | null> {
  // Demo Mode
  if (!supabase) {
    const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
    return badges.find((b: Badge) => b.id === badgeId) || null;
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('id', badgeId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a badge (Admin only)
 */
export async function updateBadge(badgeId: string, updates: Partial<BadgeFormData>): Promise<Badge | null> {
  // Demo Mode
  if (!supabase) {
    const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
    const index = badges.findIndex((b: Badge) => b.id === badgeId);
    
    if (index === -1) return null;

    badges[index] = { ...badges[index], ...updates };
    localStorage.setItem('careerup_demo_badges', JSON.stringify(badges));

    return badges[index];
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('badges')
    .update(updates)
    .eq('id', badgeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a badge (Admin only)
 */
export async function deleteBadge(badgeId: string): Promise<boolean> {
  // Demo Mode
  if (!supabase) {
    const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
    const filtered = badges.filter((b: Badge) => b.id !== badgeId);
    localStorage.setItem('careerup_demo_badges', JSON.stringify(filtered));

    // Also remove any participant badges with this badge_id
    const participantBadges = JSON.parse(localStorage.getItem('careerup_demo_participant_badges') || '[]');
    const filteredPB = participantBadges.filter((pb: ParticipantBadge) => pb.badge_id !== badgeId);
    localStorage.setItem('careerup_demo_participant_badges', JSON.stringify(filteredPB));

    return true;
  }

  // Supabase Mode
  const { error } = await supabase
    .from('badges')
    .delete()
    .eq('id', badgeId);

  if (error) throw error;
  return true;
}

// =====================================================
// PARTICIPANT BADGE OPERATIONS
// =====================================================

/**
 * Award a badge to a participant
 */
export async function awardBadge(awardData: AwardBadgeData, validatorId: string): Promise<ParticipantBadge | null> {
  // Demo Mode
  if (!supabase) {
    const participantBadge: ParticipantBadge = {
      id: `pb_${Date.now()}`,
      participant_id: awardData.participant_id,
      badge_id: awardData.badge_id,
      validated_by: validatorId,
      validated_at: new Date().toISOString(),
      task_ids: awardData.task_ids,
      validation_notes: awardData.validation_notes,
      created_at: new Date().toISOString(),
    };

    const participantBadges = JSON.parse(localStorage.getItem('careerup_demo_participant_badges') || '[]');
    
    // Check for duplicates
    const exists = participantBadges.some(
      (pb: ParticipantBadge) => pb.participant_id === awardData.participant_id && pb.badge_id === awardData.badge_id
    );
    
    if (exists) {
      throw new Error('Participant already has this badge');
    }

    participantBadges.push(participantBadge);
    localStorage.setItem('careerup_demo_participant_badges', JSON.stringify(participantBadges));

    // Send badge awarded notification
    await sendBadgeNotification(participantBadge);

    return participantBadge;
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('participant_badges')
    .insert([
      {
        participant_id: awardData.participant_id,
        badge_id: awardData.badge_id,
        validated_by: validatorId,
        task_ids: awardData.task_ids,
        validation_notes: awardData.validation_notes,
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Participant already has this badge');
    }
    throw error;
  }

  // Send badge awarded notification
  await sendBadgeNotification(data);

  return data;
}

// Helper function to send badge awarded notifications
async function sendBadgeNotification(participantBadge: ParticipantBadge): Promise<void> {
  try {
    // Get participant and badge details for the notification
    let participantEmail = '';
    let participantName = '';
    let badgeName = '';
    
    if (!supabase) {
      // Demo mode - get from localStorage
      const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');
      const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
      
      const participant = profiles.find((p: any) => p.id === participantBadge.participant_id);
      const badge = badges.find((b: Badge) => b.id === participantBadge.badge_id);
      
      participantEmail = participant?.email || '';
      participantName = participant?.full_name || 'Participant';
      badgeName = badge?.name || 'Badge';
    } else {
      // Supabase mode - query database
      const { data: participant } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', participantBadge.participant_id)
        .single();
        
      const { data: badge } = await supabase
        .from('badges')
        .select('name')
        .eq('id', participantBadge.badge_id)
        .single();
        
      participantEmail = participant?.email || '';
      participantName = participant?.full_name || 'Participant';
      badgeName = badge?.name || 'Badge';
    }

    if (participantEmail) {
      await emailService.sendEmail({
        to: participantEmail,
        toName: participantName,
        type: 'badge_awarded',
        data: {
          participantName,
          participantId: participantBadge.participant_id,
          badgeName,
          cohortName: 'CareerUp Africa Talent Program',
          verificationUrl: `${window.location.origin}/verify-badge/${participantBadge.id}`
        }
      });
    }
  } catch (error) {
    console.error('Failed to send badge notification:', error);
  }
}

/**
 * Get all badges earned by a participant
 */
export async function getParticipantBadges(participantId: string): Promise<ParticipantBadgeWithDetails[]> {
  // Demo Mode
  if (!supabase) {
    const participantBadges = JSON.parse(localStorage.getItem('careerup_demo_participant_badges') || '[]');
    const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');

    const filtered = participantBadges.filter((pb: ParticipantBadge) => pb.participant_id === participantId);

    return filtered.map((pb: ParticipantBadge) => {
      const badge = badges.find((b: Badge) => b.id === pb.badge_id);
      const validator = profiles.find((p: any) => p.id === pb.validated_by);
      const taskTitles = pb.task_ids.map((taskId: string) => {
        const task = tasks.find((t: any) => t.id === taskId);
        return task?.title || 'Unknown Task';
      });

      return {
        ...pb,
        badge_name: badge?.name || 'Unknown Badge',
        badge_description: badge?.description || '',
        badge_icon: badge?.icon || '',
        badge_category: badge?.category || '',
        badge_criteria: badge?.criteria || '',
        participant_name: '',
        participant_email: '',
        validator_name: validator?.full_name || 'Unknown',
        task_titles: taskTitles,
      };
    }).sort((a: ParticipantBadgeWithDetails, b: ParticipantBadgeWithDetails) => 
      new Date(b.validated_at).getTime() - new Date(a.validated_at).getTime()
    );
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('participant_badges')
    .select(
      `
      *,
      badges!inner(
        name,
        description,
        icon,
        category,
        criteria
      ),
      participants!inner(
        user_id,
        profiles!inner(full_name, email)
      ),
      validators:profiles!validated_by(full_name)
    `
    )
    .eq('participant_id', participantId)
    .order('validated_at', { ascending: false });

  if (error) throw error;

  // Get task titles for each badge
  const enrichedData = await Promise.all(
    (data || []).map(async (pb: any) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('id, title')
        .in('id', pb.task_ids || []);

      return {
        ...pb,
        badge_name: pb.badges?.name,
        badge_description: pb.badges?.description,
        badge_icon: pb.badges?.icon,
        badge_category: pb.badges?.category,
        badge_criteria: pb.badges?.criteria,
        participant_name: pb.participants?.profiles?.full_name,
        participant_email: pb.participants?.profiles?.email,
        validator_name: pb.validators?.full_name,
        task_titles: (tasksData || []).map((t: any) => t.title),
      };
    })
  );

  return enrichedData;
}

/**
 * Get all participants who have earned a specific badge
 */
export async function getBadgeRecipients(badgeId: string): Promise<ParticipantBadgeWithDetails[]> {
  // Demo Mode
  if (!supabase) {
    const participantBadges = JSON.parse(localStorage.getItem('careerup_demo_participant_badges') || '[]');
    const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
    const participants = JSON.parse(localStorage.getItem('careerup_demo_participants') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');

    const filtered = participantBadges.filter((pb: ParticipantBadge) => pb.badge_id === badgeId);
    const badge = badges.find((b: Badge) => b.id === badgeId);

    return filtered.map((pb: ParticipantBadge) => {
      const participant = participants.find((p: any) => p.id === pb.participant_id);
      const participantProfile = profiles.find((p: any) => p.id === participant?.user_id);
      const validator = profiles.find((p: any) => p.id === pb.validated_by);
      const taskTitles = pb.task_ids.map((taskId: string) => {
        const task = tasks.find((t: any) => t.id === taskId);
        return task?.title || 'Unknown Task';
      });

      return {
        ...pb,
        badge_name: badge?.name || 'Unknown Badge',
        badge_description: badge?.description || '',
        badge_icon: badge?.icon || '',
        badge_category: badge?.category || '',
        badge_criteria: badge?.criteria || '',
        participant_name: participantProfile?.full_name || 'Unknown',
        participant_email: participantProfile?.email || '',
        validator_name: validator?.full_name || 'Unknown',
        task_titles: taskTitles,
      };
    }).sort((a: ParticipantBadgeWithDetails, b: ParticipantBadgeWithDetails) => 
      new Date(b.validated_at).getTime() - new Date(a.validated_at).getTime()
    );
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('participant_badges')
    .select(
      `
      *,
      badges!inner(
        name,
        description,
        icon,
        category
      ),
      participants!inner(
        user_id,
        profiles!inner(full_name, email)
      ),
      validators:profiles!validated_by(full_name)
    `
    )
    .eq('badge_id', badgeId)
    .order('validated_at', { ascending: false });

  if (error) throw error;

  // Get task titles for each badge
  const enrichedData = await Promise.all(
    (data || []).map(async (pb: any) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('id, title')
        .in('id', pb.task_ids || []);

      return {
        ...pb,
        badge_name: pb.badges?.name,
        badge_description: pb.badges?.description,
        badge_icon: pb.badges?.icon,
        badge_category: pb.badges?.category,
        participant_name: pb.participants?.profiles?.full_name,
        participant_email: pb.participants?.profiles?.email,
        validator_name: pb.validators?.full_name,
        task_titles: (tasksData || []).map((t: any) => t.title),
      };
    })
  );

  return enrichedData;
}

/**
 * Get a single participant badge with full details (for verification)
 */
export async function getParticipantBadgeById(participantBadgeId: string): Promise<ParticipantBadgeWithDetails | null> {
  // Demo Mode
  if (!supabase) {
    const participantBadges = JSON.parse(localStorage.getItem('careerup_demo_participant_badges') || '[]');
    const badges = JSON.parse(localStorage.getItem('careerup_demo_badges') || '[]');
    const participants = JSON.parse(localStorage.getItem('careerup_demo_participants') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');

    const pb = participantBadges.find((pb: ParticipantBadge) => pb.id === participantBadgeId);
    if (!pb) return null;

    const badge = badges.find((b: Badge) => b.id === pb.badge_id);
    const participant = participants.find((p: any) => p.id === pb.participant_id);
    const participantProfile = profiles.find((p: any) => p.id === participant?.user_id);
    const validator = profiles.find((p: any) => p.id === pb.validated_by);
    const taskTitles = pb.task_ids.map((taskId: string) => {
      const task = tasks.find((t: any) => t.id === taskId);
      return task?.title || 'Unknown Task';
    });

    return {
      ...pb,
      badge_name: badge?.name || 'Unknown Badge',
      badge_description: badge?.description || '',
      badge_icon: badge?.icon || '',
      badge_category: badge?.category || '',
      badge_criteria: badge?.criteria || '',
      participant_name: participantProfile?.full_name || 'Unknown',
      participant_email: participantProfile?.email || '',
      validator_name: validator?.full_name || 'Unknown',
      task_titles: taskTitles,
    };
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('participant_badges')
    .select(
      `
      *,
      badges!inner(
        name,
        description,
        icon,
        category,
        criteria
      ),
      participants!inner(
        user_id,
        profiles!inner(full_name, email)
      ),
      validators:profiles!validated_by(full_name)
    `
    )
    .eq('id', participantBadgeId)
    .single();

  if (error) throw error;
  if (!data) return null;

  // Get task titles
  if (!supabase) throw new Error('Supabase client not initialized');
  
  const { data: tasksData } = await supabase
    .from('tasks')
    .select('id, title')
    .in('id', data.task_ids || []);

  return {
    ...data,
    badge_name: data.badges?.name,
    badge_description: data.badges?.description,
    badge_icon: data.badges?.icon,
    badge_category: data.badges?.category,
    badge_criteria: data.badges?.criteria,
    participant_name: data.participants?.profiles?.full_name,
    participant_email: data.participants?.profiles?.email,
    validator_name: data.validators?.full_name,
    task_titles: (tasksData || []).map((t: any) => t.title),
  };
}

/**
 * Get badge-eligible tasks (tasks with badge_eligible status and feedback)
 */
export async function getBadgeEligibleTasks(): Promise<any[]> {
  // Demo Mode
  if (!supabase) {
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
    const feedback = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');
    const participants = JSON.parse(localStorage.getItem('careerup_demo_participants') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

    const eligibleTasks = tasks.filter((t: any) => t.status === 'badge_eligible');

    return eligibleTasks.map((task: any) => {
      const taskFeedback = feedback.find((f: any) => f.task_id === task.id && f.badge_eligible);
      const participant = participants.find((p: any) => p.id === task.participant_id);
      const participantProfile = profiles.find((p: any) => p.id === participant?.user_id);

      return {
        ...task,
        participant_name: participantProfile?.full_name || 'Unknown',
        participant_email: participantProfile?.email || '',
        average_rating: taskFeedback?.overall_rating || 0,
      };
    }).sort((a: any, b: any) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  // Supabase Mode
  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
      *,
      participants!inner(
        user_id,
        profiles!inner(full_name, email)
      ),
      feedback!inner(
        overall_rating,
        badge_eligible
      )
    `
    )
    .eq('status', 'badge_eligible')
    .eq('feedback.badge_eligible', true)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((t: any) => ({
    ...t,
    participant_name: t.participants?.profiles?.full_name,
    participant_email: t.participants?.profiles?.email,
    average_rating: t.feedback?.[0]?.overall_rating || 0,
  }));
}

/**
 * Revoke a badge from a participant (Admin only)
 */
export async function revokeBadge(participantBadgeId: string): Promise<boolean> {
  // Demo Mode
  if (!supabase) {
    const participantBadges = JSON.parse(localStorage.getItem('careerup_demo_participant_badges') || '[]');
    const filtered = participantBadges.filter((pb: ParticipantBadge) => pb.id !== participantBadgeId);
    localStorage.setItem('careerup_demo_participant_badges', JSON.stringify(filtered));
    return true;
  }

  // Supabase Mode
  const { error } = await supabase
    .from('participant_badges')
    .delete()
    .eq('id', participantBadgeId);

  if (error) throw error;
  return true;
}
