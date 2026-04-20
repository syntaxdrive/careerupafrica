-- =====================================================
-- DELIVERABLES TABLE
-- =====================================================
-- Specific tasks within projects assigned to participants

CREATE TABLE IF NOT EXISTS deliverables (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'under_review', 'needs_revision', 'approved', 'badge_eligible')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Participants can view their assigned deliverables"
  ON deliverables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM participants
      WHERE participants.id = deliverables.participant_id
      AND participants.profile_id = auth.uid()
    )
  );

CREATE POLICY "Founders can view deliverables for their projects"
  ON deliverables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN founders ON founders.id = projects.founder_id
      WHERE projects.id = deliverables.project_id
      AND founders.profile_id = auth.uid()
    )
  );

CREATE POLICY "Participants can update their deliverables"
  ON deliverables FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM participants
      WHERE participants.id = deliverables.participant_id
      AND participants.profile_id = auth.uid()
    )
  );

-- Triggers
CREATE TRIGGER update_deliverables_updated_at 
  BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_participant_id ON deliverables(participant_id);

-- =====================================================
-- SUBMISSIONS TABLE
-- =====================================================
-- Participant submissions for deliverables

CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_deliverable_id ON submissions(deliverable_id);
