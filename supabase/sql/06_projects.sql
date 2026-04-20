-- =====================================================
-- PROJECTS TABLE
-- =====================================================
-- Real-world projects posted by founders for participants to work on

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  founder_id UUID REFERENCES founders(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Founders can manage their own projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE founders.id = projects.founder_id
      AND founders.profile_id = auth.uid()
    )
  );

CREATE POLICY "Participants can view active projects"
  ON projects FOR SELECT
  USING (
    status IN ('active', 'completed')
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'participant'
    )
  );

-- Triggers
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_founder_id ON projects(founder_id);
