-- =====================================================
-- TASKS TABLE
-- Tasks/deliverables created by founders for participants
-- =====================================================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Assignment
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Task Details
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  expected_hours DECIMAL(5, 2), -- Expected time commitment in hours
  
  -- Status Tracking
  status VARCHAR(50) DEFAULT 'not_started' CHECK (
    status IN (
      'not_started',
      'in_progress',
      'submitted',
      'under_review',
      'revision_needed',
      'approved',
      'badge_eligible'
    )
  ),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SUBMISSIONS TABLE
-- Deliverable submissions by participants
-- =====================================================

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Submission Content
  submission_text TEXT NOT NULL,
  submission_url TEXT, -- Optional file/link
  notes TEXT, -- Participant notes
  
  -- Review Status
  status VARCHAR(50) DEFAULT 'submitted' CHECK (
    status IN (
      'submitted',
      'under_review',
      'revision_needed',
      'approved'
    )
  ),
  
  -- Review Info
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_founder ON tasks(founder_id);
CREATE INDEX IF NOT EXISTS idx_tasks_participant ON tasks(participant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Submissions indexes
CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_participant ON submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Tasks Policies

-- Founders can view their own tasks
CREATE POLICY "Founders can view their own tasks"
  ON tasks FOR SELECT
  USING (
    founder_id = auth.uid()
  );

-- Participants can view tasks assigned to them
CREATE POLICY "Participants can view their assigned tasks"
  ON tasks FOR SELECT
  USING (
    participant_id = auth.uid()
  );

-- Admins can view all tasks
CREATE POLICY "Admins can view all tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Founders can create tasks for their matched participants
CREATE POLICY "Founders can create tasks for matched participants"
  ON tasks FOR INSERT
  WITH CHECK (
    founder_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.founder_id = auth.uid()
      AND matches.participant_id = tasks.participant_id
      AND matches.status = 'active'
    )
  );

-- Founders can update their own tasks
CREATE POLICY "Founders can update their own tasks"
  ON tasks FOR UPDATE
  USING (founder_id = auth.uid())
  WITH CHECK (founder_id = auth.uid());

-- Founders can delete their own tasks
CREATE POLICY "Founders can delete their own tasks"
  ON tasks FOR DELETE
  USING (founder_id = auth.uid());

-- Participants can update status of their own tasks
CREATE POLICY "Participants can update their task status"
  ON tasks FOR UPDATE
  USING (participant_id = auth.uid())
  WITH CHECK (participant_id = auth.uid());

-- Admins can manage all tasks
CREATE POLICY "Admins can manage all tasks"
  ON tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Submissions Policies

-- Participants can view their own submissions
CREATE POLICY "Participants can view their submissions"
  ON submissions FOR SELECT
  USING (participant_id = auth.uid());

-- Founders can view submissions for their tasks
CREATE POLICY "Founders can view submissions for their tasks"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = submissions.task_id
      AND tasks.founder_id = auth.uid()
    )
  );

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Participants can create submissions for their tasks
CREATE POLICY "Participants can submit for their tasks"
  ON submissions FOR INSERT
  WITH CHECK (
    participant_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = submissions.task_id
      AND tasks.participant_id = auth.uid()
    )
  );

-- Participants can update their own pending submissions
CREATE POLICY "Participants can update pending submissions"
  ON submissions FOR UPDATE
  USING (
    participant_id = auth.uid()
    AND status = 'submitted'
  )
  WITH CHECK (participant_id = auth.uid());

-- Founders can update submissions for their tasks (review)
CREATE POLICY "Founders can review submissions"
  ON submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = submissions.task_id
      AND tasks.founder_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = submissions.task_id
      AND tasks.founder_id = auth.uid()
    )
  );

-- Admins can manage all submissions
CREATE POLICY "Admins can manage all submissions"
  ON submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update tasks.updated_at on change
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_tasks_updated_at();

-- Update submissions.updated_at on change
CREATE OR REPLACE FUNCTION update_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_submissions_updated_at();

-- Update task status when submission is created
CREATE OR REPLACE FUNCTION update_task_status_on_submission()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tasks
  SET status = 'submitted'
  WHERE id = NEW.task_id
  AND status IN ('not_started', 'in_progress', 'revision_needed');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_status_on_submission
  AFTER INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_task_status_on_submission();
