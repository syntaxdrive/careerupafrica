-- =====================================================
-- TALENT APPLICATIONS TABLE
-- =====================================================
-- Stores talent application submissions with scenario-based answers
-- Used for manual vetting by admins before approving talent

CREATE TABLE IF NOT EXISTS talent_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Basic Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('operations', 'virtual_assistant', 'project_management', 'content', 'marketing', 'other')),
  course_name TEXT, -- Optional: CareerUp course they're from
  hours_per_week INTEGER NOT NULL CHECK (hours_per_week >= 1 AND hours_per_week <= 40),
  
  -- Scenario Responses (250+ words each)
  scenario_answer_1 TEXT NOT NULL,
  scenario_answer_2 TEXT NOT NULL,
  scenario_answer_3 TEXT NOT NULL,
  
  -- Consent
  has_consented BOOLEAN NOT NULL DEFAULT false,
  
  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'needs_info')),
  
  -- Admin Review
  admin_notes TEXT,
  reviewer_id UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Scoring (filled by admin during review)
  score_clarity INTEGER CHECK (score_clarity >= 1 AND score_clarity <= 5),
  score_structure INTEGER CHECK (score_structure >= 1 AND score_structure <= 5),
  score_actionability INTEGER CHECK (score_actionability >= 1 AND score_actionability <= 5),
  score_communication INTEGER CHECK (score_communication >= 1 AND score_communication <= 5),
  score_originality INTEGER CHECK (score_originality >= 1 AND score_originality <= 5),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE talent_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit an application"
  ON talent_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
  ON talent_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update applications"
  ON talent_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- Triggers
CREATE TRIGGER update_talent_applications_updated_at 
  BEFORE UPDATE ON talent_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_talent_applications_status ON talent_applications(status);
CREATE INDEX IF NOT EXISTS idx_talent_applications_role ON talent_applications(role);
CREATE INDEX IF NOT EXISTS idx_talent_applications_created_at ON talent_applications(created_at DESC);
