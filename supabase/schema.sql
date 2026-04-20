-- =====================================================
-- CareerUp Africa Database Schema
-- =====================================================
-- 
-- ⚠️ IMPORTANT: This file has been split into feature-based SQL files
-- for better organization and maintainability.
--
-- Please navigate to the /sql folder and run the files in order:
-- 
-- 1. sql/00_init.sql - Extensions and functions
-- 2. sql/01_auth_profiles.sql - User profiles
-- 3. sql/02_talent_applications.sql - Talent applications
-- 4. sql/03_cohorts.sql - Cohort system
-- 5. sql/04_participants.sql - Participants
-- 6. sql/05_founders.sql - Founders
-- 7. sql/06_projects.sql - Projects
-- 8. sql/07_deliverables.sql - Deliverables & submissions
-- 9. sql/08_feedback.sql - Feedback
-- 10. sql/09_badges.sql - Badges
--
-- See sql/README.md for detailed instructions.
--
-- If you want to run everything at once, you can concatenate all files
-- in the sql/ folder in the order listed above.
-- =====================================================

-- This legacy file is kept for backwards compatibility but is deprecated.
-- Please use the modular SQL files in the /sql folder instead.

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('participant', 'founder', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- TALENT APPLICATIONS TABLE
-- =====================================================
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

ALTER TABLE talent_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for talent_applications
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

-- =====================================================
-- COHORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cohorts
CREATE POLICY "Anyone can view cohorts"
  ON cohorts FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage cohorts"
  ON cohorts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- =====================================================
-- PARTICIPANTS TABLE
-- =====================================================
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

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for participants
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

-- =====================================================
-- FOUNDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS founders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  industry TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE founders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for founders
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

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  founder_id UUID REFERENCES founders(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
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

-- =====================================================
-- DELIVERABLES TABLE
-- =====================================================
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

ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deliverables
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

-- =====================================================
-- SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FEEDBACK TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  founder_id UUID REFERENCES founders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  criteria TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (true);

-- =====================================================
-- PARTICIPANT_BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS participant_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deliverable_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, badge_id)
);

ALTER TABLE participant_badges ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_founders_updated_at BEFORE UPDATE ON founders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'user_type'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_talent_applications_status ON talent_applications(status);
CREATE INDEX IF NOT EXISTS idx_talent_applications_role ON talent_applications(role);
CREATE INDEX IF NOT EXISTS idx_talent_applications_created_at ON talent_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_cohort_id ON participants(cohort_id);
CREATE INDEX IF NOT EXISTS idx_projects_founder_id ON projects(founder_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_participant_id ON deliverables(participant_id);
CREATE INDEX IF NOT EXISTS idx_submissions_deliverable_id ON submissions(deliverable_id);
CREATE INDEX IF NOT EXISTS idx_feedback_submission_id ON feedback(submission_id);
CREATE INDEX IF NOT EXISTS idx_participant_badges_participant_id ON participant_badges(participant_id);
CREATE INDEX IF NOT EXISTS idx_participant_badges_badge_id ON participant_badges(badge_id);

-- =====================================================
-- DONE!
-- =====================================================
-- Your database schema is now ready!
-- Next steps:
-- 1. Go to Authentication > Settings and enable email confirmation if desired
-- 2. Configure email templates in Authentication > Email Templates
-- 3. Test by signing up a new user
