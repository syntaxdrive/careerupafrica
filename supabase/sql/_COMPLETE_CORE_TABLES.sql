-- =====================================================
-- COMPLETE SETUP - All Essential Tables
-- =====================================================
-- Run this to get all core functionality working
-- This is faster than running individual files
-- =====================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('participant', 'founder', 'admin')),
  bio TEXT,
  linkedin_url TEXT,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. PARTICIPANTS TABLE (Required for participant features)
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  skills TEXT[],
  availability_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view own" ON participants FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Participants update own" ON participants FOR UPDATE USING (profile_id = auth.uid());

-- 5. FOUNDERS TABLE (Required for founder features)
CREATE TABLE IF NOT EXISTS founders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT,
  company_stage TEXT,
  industry TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE founders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders view own" ON founders FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Founders update own" ON founders FOR UPDATE USING (profile_id = auth.uid());

-- 6. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'participant')
  );

  -- Create participant/founder record based on user type
  IF (NEW.raw_user_meta_data->>'user_type' = 'participant') THEN
    INSERT INTO public.participants (profile_id)
    VALUES (NEW.id);
  ELSIF (NEW.raw_user_meta_data->>'user_type' = 'founder') THEN
    INSERT INTO public.founders (profile_id)
    VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FIX EXISTING USERS (Run this if you have users without profiles)
-- =====================================================

-- Manually create profiles for existing auth users
INSERT INTO profiles (id, email, full_name, user_type)
SELECT 
  id, 
  email,
  raw_user_meta_data->>'full_name',
  COALESCE(raw_user_meta_data->>'user_type', 'participant')
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.users.id
);

-- Create participant records for users with participant type
INSERT INTO participants (profile_id)
SELECT id FROM profiles 
WHERE user_type = 'participant' 
  AND NOT EXISTS (
    SELECT 1 FROM participants WHERE participants.profile_id = profiles.id
  );

-- Create founder records for users with founder type
INSERT INTO founders (profile_id)
SELECT id FROM profiles 
WHERE user_type = 'founder' 
  AND NOT EXISTS (
    SELECT 1 FROM founders WHERE founders.profile_id = profiles.id
  );

-- =====================================================
-- ✅ SETUP COMPLETE!
-- =====================================================
-- You can now:
-- 1. Sign in with existing accounts (profiles auto-created)
-- 2. Sign up new accounts (auto-created)
-- 3. Use participant and founder features
-- 
-- Next: Run additional SQL files for applications, tasks, badges, etc.
-- =====================================================
