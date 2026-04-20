-- =====================================================
-- FOUNDER APPLICATIONS TABLE
-- =====================================================
-- Stores founder application submissions for manual vetting
-- Used by admins to approve founders before they can post projects

CREATE TABLE IF NOT EXISTS founder_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Basic Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_stage TEXT NOT NULL CHECK (company_stage IN ('idea', 'pre_seed', 'seed', 'series_a_plus')),
  linkedin_url TEXT,
  website_url TEXT,
  
  -- Project Details
  help_needed TEXT NOT NULL, -- What kind of help they're looking for
  hours_per_week INTEGER NOT NULL CHECK (hours_per_week >= 1 AND hours_per_week <= 40),
  
  -- Consent
  has_consented BOOLEAN NOT NULL DEFAULT false,
  
  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'needs_info')),
  
  -- Admin Review
  admin_notes TEXT,
  reviewer_id UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE founder_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit a founder application"
  ON founder_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all founder applications"
  ON founder_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update founder applications"
  ON founder_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- Triggers
CREATE TRIGGER update_founder_applications_updated_at 
  BEFORE UPDATE ON founder_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_founder_applications_status ON founder_applications(status);
CREATE INDEX IF NOT EXISTS idx_founder_applications_company_stage ON founder_applications(company_stage);
CREATE INDEX IF NOT EXISTS idx_founder_applications_created_at ON founder_applications(created_at DESC);
