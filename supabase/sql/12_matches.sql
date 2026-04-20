-- =====================================================
-- MATCHES TABLE
-- =====================================================
-- Manual matching of participants to founders

CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  founder_id UUID REFERENCES founders(id) ON DELETE CASCADE NOT NULL,
  matched_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Participants can view their matches"
  ON matches FOR SELECT
  USING (
    participant_id IN (
      SELECT id FROM participants WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Founders can view their matches"
  ON matches FOR SELECT
  USING (
    founder_id IN (
      SELECT id FROM founders WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all matches"
  ON matches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Triggers
CREATE TRIGGER update_matches_updated_at 
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matches_participant_id ON matches(participant_id);
CREATE INDEX IF NOT EXISTS idx_matches_founder_id ON matches(founder_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- Prevent duplicate active matches
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_match 
  ON matches(participant_id, founder_id) 
  WHERE status = 'active';
