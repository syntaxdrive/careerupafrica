-- =====================================================
-- PROFILE EXTENSIONS
-- =====================================================
-- Additional fields for profile completion (Task 5)

-- =====================================================
-- PARTICIPANTS PROFILE EXTENSIONS
-- =====================================================

-- Add avatar and portfolio fields
ALTER TABLE participants 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_links JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS availability_hours_per_week INTEGER,
  ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;

-- Create index for profile completion status
CREATE INDEX IF NOT EXISTS idx_participants_profile_completed 
  ON participants(profile_completed);

-- =====================================================
-- FOUNDERS PROFILE EXTENSIONS
-- =====================================================

-- Add company profile fields
ALTER TABLE founders 
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS team_size INTEGER,
  ADD COLUMN IF NOT EXISTS task_preferences JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;

-- Note: company_description uses existing 'bio' field
-- Note: company_name and industry already exist

-- Create index for profile completion status
CREATE INDEX IF NOT EXISTS idx_founders_profile_completed 
  ON founders(profile_completed);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON COLUMN participants.avatar_url IS 'URL to user avatar/profile picture';
COMMENT ON COLUMN participants.portfolio_links IS 'Array of portfolio/work sample URLs with titles';
COMMENT ON COLUMN participants.availability_hours_per_week IS 'Available hours per week for tasks';
COMMENT ON COLUMN participants.profile_completed IS 'Whether user has completed profile setup';

COMMENT ON COLUMN founders.company_logo_url IS 'URL to company logo';
COMMENT ON COLUMN founders.team_size IS 'Current team size';
COMMENT ON COLUMN founders.task_preferences IS 'JSON object for task type preferences and requirements';
COMMENT ON COLUMN founders.profile_completed IS 'Whether founder has completed company profile';
