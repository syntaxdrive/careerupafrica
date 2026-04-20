-- =====================================================
-- FOUNDERS TABLE
-- =====================================================
-- Company founders who post projects for participants

CREATE TABLE IF NOT EXISTS founders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  industry TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Founders can view their own data"
  ON founders FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Founders can update their own data"
  ON founders FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Admins can view all founders"
  ON founders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Triggers
CREATE TRIGGER update_founders_updated_at 
  BEFORE UPDATE ON founders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
