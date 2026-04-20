import { supabase } from './supabase';

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface FeedbackCriteria {
  understanding_rating: number; // 1-5
  execution_rating: number; // 1-5
  communication_rating: number; // 1-5
  timeliness_rating: number; // 1-5
  attention_rating: number; // 1-5
}

export interface Feedback {
  id: string;
  task_id: string;
  submission_id: string;
  participant_id: string;
  founder_id: string;
  overall_rating: number;
  understanding_rating: number;
  execution_rating: number;
  communication_rating: number;
  timeliness_rating: number;
  attention_rating: number;
  comments: string;
  revision_needed: boolean;
  badge_eligible: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedbackWithDetails extends Feedback {
  task_title?: string;
  participant_name?: string;
  participant_email?: string;
  founder_name?: string;
  founder_company?: string;
}

export interface FeedbackFormData {
  task_id: string;
  submission_id: string;
  participant_id: string;
  overall_rating: number;
  understanding_rating: number;
  execution_rating: number;
  communication_rating: number;
  timeliness_rating: number;
  attention_rating: number;
  comments: string;
  revision_needed: boolean;
  badge_eligible: boolean;
}

export interface FeedbackStats {
  total_feedback: number;
  average_overall: number;
  average_understanding: number;
  average_execution: number;
  average_communication: number;
  average_timeliness: number;
  average_attention: number;
  badge_eligible_count: number;
  revision_needed_count: number;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const isDemoMode = (): boolean => {
  return !supabase || localStorage.getItem('careerup_demo_mode') === 'true';
};

const calculateAverageRating = (feedback: Feedback[]): FeedbackStats => {
  if (feedback.length === 0) {
    return {
      total_feedback: 0,
      average_overall: 0,
      average_understanding: 0,
      average_execution: 0,
      average_communication: 0,
      average_timeliness: 0,
      average_attention: 0,
      badge_eligible_count: 0,
      revision_needed_count: 0,
    };
  }

  const sum = feedback.reduce(
    (acc, f) => ({
      overall: acc.overall + f.overall_rating,
      understanding: acc.understanding + f.understanding_rating,
      execution: acc.execution + f.execution_rating,
      communication: acc.communication + f.communication_rating,
      timeliness: acc.timeliness + f.timeliness_rating,
      attention: acc.attention + f.attention_rating,
      badge_eligible: acc.badge_eligible + (f.badge_eligible ? 1 : 0),
      revision_needed: acc.revision_needed + (f.revision_needed ? 1 : 0),
    }),
    {
      overall: 0,
      understanding: 0,
      execution: 0,
      communication: 0,
      timeliness: 0,
      attention: 0,
      badge_eligible: 0,
      revision_needed: 0,
    }
  );

  const count = feedback.length;

  return {
    total_feedback: count,
    average_overall: Math.round((sum.overall / count) * 10) / 10,
    average_understanding: Math.round((sum.understanding / count) * 10) / 10,
    average_execution: Math.round((sum.execution / count) * 10) / 10,
    average_communication: Math.round((sum.communication / count) * 10) / 10,
    average_timeliness: Math.round((sum.timeliness / count) * 10) / 10,
    average_attention: Math.round((sum.attention / count) * 10) / 10,
    badge_eligible_count: sum.badge_eligible,
    revision_needed_count: sum.revision_needed,
  };
};

// =====================================================
// CREATE FEEDBACK
// =====================================================

export const createFeedback = async (
  feedbackData: FeedbackFormData,
  founderId: string
): Promise<Feedback> => {
  if (isDemoMode()) {
    // Demo Mode - localStorage
    const feedbackList = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');

    const newFeedback: Feedback = {
      id: `feedback_${Date.now()}`,
      ...feedbackData,
      founder_id: founderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    feedbackList.push(newFeedback);
    localStorage.setItem('careerup_demo_feedback', JSON.stringify(feedbackList));

    // Update submission status in demo
    const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');
    const submissionIndex = submissions.findIndex((s: any) => s.id === feedbackData.submission_id);
    if (submissionIndex !== -1) {
      submissions[submissionIndex].status = feedbackData.revision_needed ? 'revision_needed' : 'approved';
      submissions[submissionIndex].reviewed_by = founderId;
      submissions[submissionIndex].reviewed_at = new Date().toISOString();
      submissions[submissionIndex].review_notes = feedbackData.comments;
      localStorage.setItem('careerup_demo_submissions', JSON.stringify(submissions));
    }

    // Update task status in demo
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
    const taskIndex = tasks.findIndex((t: any) => t.id === feedbackData.task_id);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = feedbackData.badge_eligible
        ? 'badge_eligible'
        : feedbackData.revision_needed
        ? 'revision_needed'
        : 'approved';
      localStorage.setItem('careerup_demo_tasks', JSON.stringify(tasks));
    }

    return newFeedback;
  }

  // Supabase Mode
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('feedback')
    .insert([
      {
        task_id: feedbackData.task_id,
        submission_id: feedbackData.submission_id,
        participant_id: feedbackData.participant_id,
        founder_id: founderId,
        overall_rating: feedbackData.overall_rating,
        understanding_rating: feedbackData.understanding_rating,
        execution_rating: feedbackData.execution_rating,
        communication_rating: feedbackData.communication_rating,
        timeliness_rating: feedbackData.timeliness_rating,
        attention_rating: feedbackData.attention_rating,
        comments: feedbackData.comments,
        revision_needed: feedbackData.revision_needed,
        badge_eligible: feedbackData.badge_eligible,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Update submission status
  await supabase
    .from('submissions')
    .update({
      status: feedbackData.revision_needed ? 'revision_needed' : 'approved',
      reviewed_by: founderId,
      reviewed_at: new Date().toISOString(),
      review_notes: feedbackData.comments,
    })
    .eq('id', feedbackData.submission_id);

  // Update task status
  await supabase
    .from('tasks')
    .update({
      status: feedbackData.badge_eligible
        ? 'badge_eligible'
        : feedbackData.revision_needed
        ? 'revision_needed'
        : 'approved',
    })
    .eq('id', feedbackData.task_id);

  return data;
};

// =====================================================
// GET FEEDBACK BY TASK
// =====================================================

export const getFeedbackByTask = async (taskId: string): Promise<FeedbackWithDetails[]> => {
  if (isDemoMode()) {
    // Demo Mode
    const feedbackList = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');
    const filteredFeedback = feedbackList.filter((f: Feedback) => f.task_id === taskId);

    // Enrich with details
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
    const participants = JSON.parse(localStorage.getItem('careerup_demo_participants') || '[]');
    const founders = JSON.parse(localStorage.getItem('careerup_demo_founders') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

    return filteredFeedback.map((f: Feedback) => {
      const task = tasks.find((t: any) => t.id === f.task_id);
      const participant = participants.find((p: any) => p.id === f.participant_id);
      const founder = founders.find((fo: any) => fo.id === f.founder_id);
      const participantProfile = profiles.find((p: any) => p.id === participant?.user_id);
      const founderProfile = profiles.find((p: any) => p.id === founder?.user_id);

      return {
        ...f,
        task_title: task?.title,
        participant_name: participantProfile?.full_name,
        participant_email: participantProfile?.email,
        founder_name: founderProfile?.full_name,
        founder_company: founder?.company_name,
      };
    });
  }

  // Supabase Mode
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('feedback')
    .select(
      `
      *,
      tasks!inner(title),
      participants!inner(
        user_id,
        profiles!inner(full_name, email)
      ),
      founders!inner(
        company_name,
        user_id,
        profiles!inner(full_name)
      )
    `
    )
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((f: any) => ({
    ...f,
    task_title: f.tasks?.title,
    participant_name: f.participants?.profiles?.full_name,
    participant_email: f.participants?.profiles?.email,
    founder_name: f.founders?.profiles?.full_name,
    founder_company: f.founders?.company_name,
  }));
};

// =====================================================
// GET FEEDBACK BY SUBMISSION
// =====================================================

export const getFeedbackBySubmission = async (
  submissionId: string
): Promise<FeedbackWithDetails | null> => {
  if (isDemoMode()) {
    // Demo Mode
    const feedbackList = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');
    const feedback = feedbackList.find((f: Feedback) => f.submission_id === submissionId);

    if (!feedback) return null;

    // Enrich with details
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
    const participants = JSON.parse(localStorage.getItem('careerup_demo_participants') || '[]');
    const founders = JSON.parse(localStorage.getItem('careerup_demo_founders') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

    const task = tasks.find((t: any) => t.id === feedback.task_id);
    const participant = participants.find((p: any) => p.id === feedback.participant_id);
    const founder = founders.find((fo: any) => fo.id === feedback.founder_id);
    const participantProfile = profiles.find((p: any) => p.id === participant?.user_id);
    const founderProfile = profiles.find((p: any) => p.id === founder?.user_id);

    return {
      ...feedback,
      task_title: task?.title,
      participant_name: participantProfile?.full_name,
      participant_email: participantProfile?.email,
      founder_name: founderProfile?.full_name,
      founder_company: founder?.company_name,
    };
  }

  // Supabase Mode
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('feedback')
    .select(
      `
      *,
      tasks!inner(title),
      participants!inner(
        user_id,
        profiles!inner(full_name, email)
      ),
      founders!inner(
        company_name,
        user_id,
        profiles!inner(full_name)
      )
    `
    )
    .eq('submission_id', submissionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return {
    ...data,
    task_title: data.tasks?.title,
    participant_name: data.participants?.profiles?.full_name,
    participant_email: data.participants?.profiles?.email,
    founder_name: data.founders?.profiles?.full_name,
    founder_company: data.founders?.company_name,
  };
};

// =====================================================
// GET FEEDBACK HISTORY BY PARTICIPANT
// =====================================================

export const getFeedbackByParticipant = async (
  participantId: string
): Promise<FeedbackWithDetails[]> => {
  if (isDemoMode()) {
    // Demo Mode
    const feedbackList = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');
    const filteredFeedback = feedbackList.filter((f: Feedback) => f.participant_id === participantId);

    // Enrich with details
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
    const founders = JSON.parse(localStorage.getItem('careerup_demo_founders') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

    return filteredFeedback
      .map((f: Feedback) => {
        const task = tasks.find((t: any) => t.id === f.task_id);
        const founder = founders.find((fo: any) => fo.id === f.founder_id);
        const founderProfile = profiles.find((p: any) => p.id === founder?.user_id);

        return {
          ...f,
          task_title: task?.title,
          founder_name: founderProfile?.full_name,
          founder_company: founder?.company_name,
        };
      })
      .sort((a: Feedback, b: Feedback) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Supabase Mode
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('feedback')
    .select(
      `
      *,
      tasks!inner(title),
      founders!inner(
        company_name,
        user_id,
        profiles!inner(full_name)
      )
    `
    )
    .eq('participant_id', participantId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((f: any) => ({
    ...f,
    task_title: f.tasks?.title,
    founder_name: f.founders?.profiles?.full_name,
    founder_company: f.founders?.company_name,
  }));
};

// =====================================================
// GET FEEDBACK BY FOUNDER
// =====================================================

export const getFeedbackByFounder = async (founderId: string): Promise<FeedbackWithDetails[]> => {
  if (isDemoMode()) {
    // Demo Mode
    const feedbackList = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');
    const filteredFeedback = feedbackList.filter((f: Feedback) => f.founder_id === founderId);

    // Enrich with details
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
    const participants = JSON.parse(localStorage.getItem('careerup_demo_participants') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

    return filteredFeedback
      .map((f: Feedback) => {
        const task = tasks.find((t: any) => t.id === f.task_id);
        const participant = participants.find((p: any) => p.id === f.participant_id);
        const participantProfile = profiles.find((p: any) => p.id === participant?.user_id);

        return {
          ...f,
          task_title: task?.title,
          participant_name: participantProfile?.full_name,
          participant_email: participantProfile?.email,
        };
      })
      .sort((a: Feedback, b: Feedback) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Supabase Mode
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('feedback')
    .select(
      `
      *,
      tasks!inner(title),
      participants!inner(
        user_id,
        profiles!inner(full_name, email)
      )
    `
    )
    .eq('founder_id', founderId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((f: any) => ({
    ...f,
    task_title: f.tasks?.title,
    participant_name: f.participants?.profiles?.full_name,
    participant_email: f.participants?.profiles?.email,
  }));
};

// =====================================================
// GET PARTICIPANT STATISTICS
// =====================================================

export const getParticipantFeedbackStats = async (
  participantId: string
): Promise<FeedbackStats> => {
  const feedback = await getFeedbackByParticipant(participantId);
  return calculateAverageRating(feedback);
};

// =====================================================
// UPDATE FEEDBACK
// =====================================================

export const updateFeedback = async (
  feedbackId: string,
  updates: Partial<FeedbackFormData>
): Promise<Feedback> => {
  if (isDemoMode()) {
    // Demo Mode
    const feedbackList = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');
    const feedbackIndex = feedbackList.findIndex((f: Feedback) => f.id === feedbackId);

    if (feedbackIndex === -1) {
      throw new Error('Feedback not found');
    }

    feedbackList[feedbackIndex] = {
      ...feedbackList[feedbackIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem('careerup_demo_feedback', JSON.stringify(feedbackList));
    return feedbackList[feedbackIndex];
  }

  // Supabase Mode
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('feedback')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', feedbackId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================================
// GET BADGE ELIGIBLE FEEDBACK (Admin)
// =====================================================

export const getBadgeEligibleFeedback = async (): Promise<FeedbackWithDetails[]> => {
  if (isDemoMode()) {
    // Demo Mode
    const feedbackList = JSON.parse(localStorage.getItem('careerup_demo_feedback') || '[]');
    const badgeEligible = feedbackList.filter((f: Feedback) => f.badge_eligible);

    // Enrich with details
    const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
    const participants = JSON.parse(localStorage.getItem('careerup_demo_participants') || '[]');
    const founders = JSON.parse(localStorage.getItem('careerup_demo_founders') || '[]');
    const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

    return badgeEligible.map((f: Feedback) => {
      const task = tasks.find((t: any) => t.id === f.task_id);
      const participant = participants.find((p: any) => p.id === f.participant_id);
      const founder = founders.find((fo: any) => fo.id === f.founder_id);
      const participantProfile = profiles.find((p: any) => p.id === participant?.user_id);
      const founderProfile = profiles.find((p: any) => p.id === founder?.user_id);

      return {
        ...f,
        task_title: task?.title,
        participant_name: participantProfile?.full_name,
        participant_email: participantProfile?.email,
        founder_name: founderProfile?.full_name,
        founder_company: founder?.company_name,
      };
    });
  }

  // Supabase Mode
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('feedback')
    .select(
      `
      *,
      tasks!inner(title),
      participants!inner(
        user_id,
        profiles!inner(full_name, email)
      ),
      founders!inner(
        company_name,
        user_id,
        profiles!inner(full_name)
      )
    `
    )
    .eq('badge_eligible', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((f: any) => ({
    ...f,
    task_title: f.tasks?.title,
    participant_name: f.participants?.profiles?.full_name,
    participant_email: f.participants?.profiles?.email,
    founder_name: f.founders?.profiles?.full_name,
    founder_company: f.founders?.company_name,
  }));
};
