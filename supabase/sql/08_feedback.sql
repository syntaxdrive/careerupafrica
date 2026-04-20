-- =====================================================
-- FEEDBACK TABLE
-- =====================================================
-- Structured founder feedback on participant task submissions
-- Supports detailed performance evaluation with multiple criteria

CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Relations
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  founder_id UUID REFERENCES founders(id) ON DELETE SET NULL,
  
  -- Overall Quality Rating (1-5 scale)
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5) NOT NULL,
  
  -- Criteria Ratings (1-5 scale each)
  understanding_rating INTEGER CHECK (understanding_rating >= 1 AND understanding_rating <= 5) NOT NULL,
  execution_rating INTEGER CHECK (execution_rating >= 1 AND execution_rating <= 5) NOT NULL,
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5) NOT NULL,
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5) NOT NULL,
  attention_rating INTEGER CHECK (attention_rating >= 1 AND attention_rating <= 5) NOT NULL,
  
  -- Written Feedback (enforced minimum in application)
  comments TEXT NOT NULL,
  
  -- Flags
  revision_needed BOOLEAN DEFAULT false,
  badge_eligible BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_task_id ON feedback(task_id);
CREATE INDEX IF NOT EXISTS idx_feedback_submission_id ON feedback(submission_id);
CREATE INDEX IF NOT EXISTS idx_feedback_participant_id ON feedback(participant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_founder_id ON feedback(founder_id);
CREATE INDEX IF NOT EXISTS idx_feedback_badge_eligible ON feedback(badge_eligible) WHERE badge_eligible = true;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Participants can view feedback on their own submissions
CREATE POLICY "Participants can view their own feedback"
  ON feedback FOR SELECT
  USING (
    participant_id IN (
      SELECT id FROM participants WHERE user_id = auth.uid()
    )
  );

-- Founders can view feedback they created
CREATE POLICY "Founders can view their own feedback"
  ON feedback FOR SELECT
  USING (
    founder_id IN (
      SELECT id FROM founders WHERE user_id = auth.uid()
    )
  );

-- Founders can create feedback for their tasks
CREATE POLICY "Founders can create feedback for their tasks"
  ON feedback FOR INSERT
  WITH CHECK (
    founder_id IN (
      SELECT id FROM founders WHERE user_id = auth.uid()
    )
    AND task_id IN (
      SELECT id FROM tasks WHERE founder_id IN (
        SELECT id FROM founders WHERE user_id = auth.uid()
      )
    )
  );

-- Founders can update their own feedback
CREATE POLICY "Founders can update their own feedback"
  ON feedback FOR UPDATE
  USING (
    founder_id IN (
      SELECT id FROM founders WHERE user_id = auth.uid()
    )
  );

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Admins can update any feedback (for moderation)
CREATE POLICY "Admins can update any feedback"
  ON feedback FOR UPDATE
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

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_updated_at();

-- =====================================================
-- DEMO DATA (Optional - for testing)
-- =====================================================

-- Sample feedback entries will be created through the application
