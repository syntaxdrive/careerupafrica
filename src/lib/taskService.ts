import { supabase } from './supabase';

// =====================================================
// TYPES
// =====================================================

export type TaskStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'revision_needed'
  | 'approved'
  | 'badge_eligible';

export type SubmissionStatus = 'submitted' | 'under_review' | 'revision_needed' | 'approved';

export interface Task {
  id: string;
  title: string;
  description: string;
  founder_id: string;
  participant_id: string;
  due_date: string;
  difficulty_level: number;
  expected_hours: number;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskWithDetails extends Task {
  founder_name: string;
  founder_company: string;
  participant_name: string;
  submission?: Submission;
  has_submission: boolean;
}

export interface Submission {
  id: string;
  task_id: string;
  participant_id: string;
  submission_text: string;
  submission_url: string | null;
  notes: string | null;
  status: SubmissionStatus;
  reviewed_by: string | null;
  review_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionWithDetails extends Submission {
  task_title: string;
  participant_name: string;
  reviewer_name: string | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  participant_id: string;
  due_date: string;
  difficulty_level: number;
  expected_hours: number;
}

export interface SubmissionFormData {
  task_id: string;
  submission_text: string;
  submission_url?: string;
  notes?: string;
}

export interface ReviewData {
  status: SubmissionStatus;
  review_notes?: string;
  reviewed_by: string;
}

// =====================================================
// TASK CRUD OPERATIONS
// =====================================================

/**
 * Create a new task
 */
export async function createTask(taskData: TaskFormData, founderId: string): Promise<Task | null> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          founder_id: founderId,
          status: 'not_started',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  // Demo mode: localStorage
  const task: Task = {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...taskData,
    founder_id: founderId,
    status: 'not_started',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  tasks.push(task);
  localStorage.setItem('careerup_demo_tasks', JSON.stringify(tasks));

  return task;
}

/**
 * Get all tasks created by a founder
 */
export async function getTasksByFounder(founderId: string): Promise<TaskWithDetails[]> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(
          `
          *,
          founder:profiles!tasks_founder_id_fkey(full_name, company_name),
          participant:profiles!tasks_participant_id_fkey(full_name),
          submissions(*)
        `
        )
        .eq('founder_id', founderId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (
        data?.map((task: any) => ({
          ...task,
          founder_name: task.founder?.full_name || 'Unknown',
          founder_company: task.founder?.company_name || '',
          participant_name: task.participant?.full_name || 'Unknown',
          submission: task.submissions?.[0] || null,
          has_submission: (task.submissions?.length || 0) > 0,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching founder tasks:', error);
      return [];
    }
  }

  // Demo mode: localStorage
  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');
  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');

  const founderTasks = tasks.filter((t: Task) => t.founder_id === founderId);

  return founderTasks.map((task: Task) => {
    const founder = profiles.find((p: any) => p.id === task.founder_id);
    const participant = profiles.find((p: any) => p.id === task.participant_id);
    const submission = submissions.find((s: Submission) => s.task_id === task.id);

    return {
      ...task,
      founder_name: founder?.full_name || 'Unknown',
      founder_company: founder?.company_name || '',
      participant_name: participant?.full_name || 'Unknown',
      submission: submission || null,
      has_submission: !!submission,
    };
  });
}

/**
 * Get all tasks assigned to a participant
 */
export async function getTasksByParticipant(participantId: string): Promise<TaskWithDetails[]> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(
          `
          *,
          founder:profiles!tasks_founder_id_fkey(full_name, company_name),
          participant:profiles!tasks_participant_id_fkey(full_name),
          submissions(*)
        `
        )
        .eq('participant_id', participantId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      return (
        data?.map((task: any) => ({
          ...task,
          founder_name: task.founder?.full_name || 'Unknown',
          founder_company: task.founder?.company_name || '',
          participant_name: task.participant?.full_name || 'Unknown',
          submission: task.submissions?.[0] || null,
          has_submission: (task.submissions?.length || 0) > 0,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching participant tasks:', error);
      return [];
    }
  }

  // Demo mode: localStorage
  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');
  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');

  const participantTasks = tasks.filter((t: Task) => t.participant_id === participantId);

  return participantTasks.map((task: Task) => {
    const founder = profiles.find((p: any) => p.id === task.founder_id);
    const participant = profiles.find((p: any) => p.id === task.participant_id);
    const submission = submissions.find((s: Submission) => s.task_id === task.id);

    return {
      ...task,
      founder_name: founder?.full_name || 'Unknown',
      founder_company: founder?.company_name || '',
      participant_name: participant?.full_name || 'Unknown',
      submission: submission || null,
      has_submission: !!submission,
    };
  });
}

/**
 * Get a single task by ID with full details
 */
export async function getTaskById(taskId: string): Promise<TaskWithDetails | null> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(
          `
          *,
          founder:profiles!tasks_founder_id_fkey(full_name, company_name),
          participant:profiles!tasks_participant_id_fkey(full_name),
          submissions(*)
        `
        )
        .eq('id', taskId)
        .single();

      if (error) throw error;

      return {
        ...data,
        founder_name: data.founder?.full_name || 'Unknown',
        founder_company: data.founder?.company_name || '',
        participant_name: data.participant?.full_name || 'Unknown',
        submission: data.submissions?.[0] || null,
        has_submission: (data.submissions?.length || 0) > 0,
      };
    } catch (error) {
      console.error('Error fetching task:', error);
      return null;
    }
  }

  // Demo mode: localStorage
  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');
  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');

  const task = tasks.find((t: Task) => t.id === taskId);
  if (!task) return null;

  const founder = profiles.find((p: any) => p.id === task.founder_id);
  const participant = profiles.find((p: any) => p.id === task.participant_id);
  const submission = submissions.find((s: Submission) => s.task_id === task.id);

  return {
    ...task,
    founder_name: founder?.full_name || 'Unknown',
    founder_company: founder?.company_name || '',
    participant_name: participant?.full_name || 'Unknown',
    submission: submission || null,
    has_submission: !!submission,
  };
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  updates: Partial<TaskFormData>
): Promise<Task | null> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  // Demo mode: localStorage
  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);

  if (taskIndex === -1) return null;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  localStorage.setItem('careerup_demo_tasks', JSON.stringify(tasks));
  return tasks[taskIndex];
}

/**
 * Update task status
 */
export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<boolean> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  }

  // Demo mode: localStorage
  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);

  if (taskIndex === -1) return false;

  tasks[taskIndex].status = status;
  tasks[taskIndex].updated_at = new Date().toISOString();

  localStorage.setItem('careerup_demo_tasks', JSON.stringify(tasks));
  return true;
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  // Demo mode: localStorage
  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  const filteredTasks = tasks.filter((t: Task) => t.id !== taskId);

  if (filteredTasks.length === tasks.length) return false;

  localStorage.setItem('careerup_demo_tasks', JSON.stringify(filteredTasks));

  // Also delete submissions for this task
  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');
  const filteredSubmissions = submissions.filter((s: Submission) => s.task_id !== taskId);
  localStorage.setItem('careerup_demo_submissions', JSON.stringify(filteredSubmissions));

  return true;
}

// =====================================================
// SUBMISSION OPERATIONS
// =====================================================

/**
 * Create a submission for a task
 */
export async function createSubmission(
  submissionData: SubmissionFormData,
  participantId: string
): Promise<Submission | null> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          ...submissionData,
          participant_id: participantId,
          status: 'submitted',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating submission:', error);
      return null;
    }
  }

  // Demo mode: localStorage
  const submission: Submission = {
    id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...submissionData,
    participant_id: participantId,
    status: 'submitted',
    reviewed_by: null,
    review_notes: null,
    submitted_at: new Date().toISOString(),
    reviewed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    submission_url: submissionData.submission_url || null,
    notes: submissionData.notes || null,
  };

  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');
  submissions.push(submission);
  localStorage.setItem('careerup_demo_submissions', JSON.stringify(submissions));

  // Update task status to 'submitted'
  await updateTaskStatus(submissionData.task_id, 'submitted');

  return submission;
}

/**
 * Get submissions for a specific task
 */
export async function getSubmissionsByTask(taskId: string): Promise<SubmissionWithDetails[]> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(
          `
          *,
          task:tasks(title),
          participant:profiles!submissions_participant_id_fkey(full_name),
          reviewer:profiles!submissions_reviewed_by_fkey(full_name)
        `
        )
        .eq('task_id', taskId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return (
        data?.map((submission: any) => ({
          ...submission,
          task_title: submission.task?.title || 'Unknown',
          participant_name: submission.participant?.full_name || 'Unknown',
          reviewer_name: submission.reviewer?.full_name || null,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }

  // Demo mode: localStorage
  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');
  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

  const taskSubmissions = submissions.filter((s: Submission) => s.task_id === taskId);

  return taskSubmissions.map((submission: Submission) => {
    const task = tasks.find((t: Task) => t.id === submission.task_id);
    const participant = profiles.find((p: any) => p.id === submission.participant_id);
    const reviewer = submission.reviewed_by
      ? profiles.find((p: any) => p.id === submission.reviewed_by)
      : null;

    return {
      ...submission,
      task_title: task?.title || 'Unknown',
      participant_name: participant?.full_name || 'Unknown',
      reviewer_name: reviewer?.full_name || null,
    };
  });
}

/**
 * Get all submissions by a participant
 */
export async function getSubmissionsByParticipant(
  participantId: string
): Promise<SubmissionWithDetails[]> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(
          `
          *,
          task:tasks(title),
          participant:profiles!submissions_participant_id_fkey(full_name),
          reviewer:profiles!submissions_reviewed_by_fkey(full_name)
        `
        )
        .eq('participant_id', participantId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return (
        data?.map((submission: any) => ({
          ...submission,
          task_title: submission.task?.title || 'Unknown',
          participant_name: submission.participant?.full_name || 'Unknown',
          reviewer_name: submission.reviewer?.full_name || null,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching participant submissions:', error);
      return [];
    }
  }

  // Demo mode: localStorage
  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');
  const tasks = JSON.parse(localStorage.getItem('careerup_demo_tasks') || '[]');
  const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

  const participantSubmissions = submissions.filter(
    (s: Submission) => s.participant_id === participantId
  );

  return participantSubmissions.map((submission: Submission) => {
    const task = tasks.find((t: Task) => t.id === submission.task_id);
    const participant = profiles.find((p: any) => p.id === submission.participant_id);
    const reviewer = submission.reviewed_by
      ? profiles.find((p: any) => p.id === submission.reviewed_by)
      : null;

    return {
      ...submission,
      task_title: task?.title || 'Unknown',
      participant_name: participant?.full_name || 'Unknown',
      reviewer_name: reviewer?.full_name || null,
    };
  });
}

/**
 * Update a submission
 */
export async function updateSubmission(
  submissionId: string,
  updates: Partial<SubmissionFormData>
): Promise<Submission | null> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update(updates)
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating submission:', error);
      return null;
    }
  }

  // Demo mode: localStorage
  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');
  const submissionIndex = submissions.findIndex((s: Submission) => s.id === submissionId);

  if (submissionIndex === -1) return null;

  submissions[submissionIndex] = {
    ...submissions[submissionIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  localStorage.setItem('careerup_demo_submissions', JSON.stringify(submissions));
  return submissions[submissionIndex];
}

/**
 * Review a submission (founder/admin action)
 */
export async function reviewSubmission(
  submissionId: string,
  reviewData: ReviewData
): Promise<boolean> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          status: reviewData.status,
          review_notes: reviewData.review_notes,
          reviewed_by: reviewData.reviewed_by,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (error) throw error;

      // Get the submission to update task status
      const { data: submission } = await supabase
        .from('submissions')
        .select('task_id')
        .eq('id', submissionId)
        .single();

      if (submission) {
        // Update task status based on submission review
        let taskStatus: TaskStatus = 'under_review';
        if (reviewData.status === 'approved') taskStatus = 'approved';
        if (reviewData.status === 'revision_needed') taskStatus = 'revision_needed';

        await updateTaskStatus(submission.task_id, taskStatus);
      }

      return true;
    } catch (error) {
      console.error('Error reviewing submission:', error);
      return false;
    }
  }

  // Demo mode: localStorage
  const submissions = JSON.parse(localStorage.getItem('careerup_demo_submissions') || '[]');
  const submissionIndex = submissions.findIndex((s: Submission) => s.id === submissionId);

  if (submissionIndex === -1) return false;

  submissions[submissionIndex] = {
    ...submissions[submissionIndex],
    status: reviewData.status,
    review_notes: reviewData.review_notes,
    reviewed_by: reviewData.reviewed_by,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localStorage.setItem('careerup_demo_submissions', JSON.stringify(submissions));

  // Update task status based on review
  let taskStatus: TaskStatus = 'under_review';
  if (reviewData.status === 'approved') taskStatus = 'approved';
  if (reviewData.status === 'revision_needed') taskStatus = 'revision_needed';

  await updateTaskStatus(submissions[submissionIndex].task_id, taskStatus);

  return true;
}

/**
 * Get matched participants for a founder (for task assignment)
 */
export async function getMatchedParticipants(founderId: string): Promise<any[]> {
  // Check if Supabase is configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(
          `
          *,
          participant:profiles!matches_participant_id_fkey(id, full_name, skills)
        `
        )
        .eq('founder_id', founderId)
        .eq('status', 'active');

      if (error) throw error;

      return (
        data?.map((match: any) => ({
          id: match.participant?.id,
          full_name: match.participant?.full_name || 'Unknown',
          skills: match.participant?.skills || [],
        })) || []
      );
    } catch (error) {
      console.error('Error fetching matched participants:', error);
      return [];
    }
  }

  // Demo mode: localStorage
  const matches = JSON.parse(localStorage.getItem('careerup_demo_matches') || '[]');
  const profiles = JSON.parse(localStorage.getItem('careerup_demo_profiles') || '[]');

  const activeMatches = matches.filter(
    (m: any) => m.founder_id === founderId && m.status === 'active'
  );

  return activeMatches.map((match: any) => {
    const participant = profiles.find((p: any) => p.id === match.participant_id);
    return {
      id: participant?.id,
      full_name: participant?.full_name || 'Unknown',
      skills: participant?.skills || [],
    };
  });
}
