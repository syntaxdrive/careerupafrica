-- =====================================================
-- BADGES TABLE
-- =====================================================
-- Achievement badges proving specific competencies

CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  criteria TEXT,
  icon TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (true);

-- =====================================================
-- PARTICIPANT_BADGES TABLE
-- =====================================================
-- Junction table linking participants to earned badges

CREATE TABLE IF NOT EXISTS participant_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  task_ids UUID[] DEFAULT ARRAY[]::UUID[],
  validation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE participant_badges ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_participant_badges_participant_id ON participant_badges(participant_id);
CREATE INDEX IF NOT EXISTS idx_participant_badges_badge_id ON participant_badges(badge_id);
