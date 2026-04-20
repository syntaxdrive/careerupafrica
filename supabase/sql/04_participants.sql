-- =====================================================
-- PARTICIPANTS TABLE
-- =====================================================
-- Approved talent who have joined a cohort

CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,
  bio TEXT,
  skills TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Participants can view their own data"
  ON participants FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Founders and admins can view participants"
  ON participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('founder', 'admin')
    )
  );

CREATE POLICY "Participants can update their own data"
  ON participants FOR UPDATE
  USING (profile_id = auth.uid());

-- Triggers
CREATE TRIGGER update_participants_updated_at 
  BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_participants_cohort_id ON participants(cohort_id);
