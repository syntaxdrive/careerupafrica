# CareerUp Africa - Supabase Production Setup Guide

## Overview

This guide walks you through connecting your CareerUp platform to Supabase for full production deployment. The platform currently runs in **dual mode** (localStorage demo + Supabase production) and this will configure it for **production-only** mode.

---

## 📋 **Pre-Requirements**

- [ ] Supabase account created
- [ ] New Supabase project created
- [ ] Project URL and API keys available
- [ ] Domain/hosting platform chosen (Vercel, Netlify, etc.)

---

## 🏗️ **Step 1: Supabase Project Setup**

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project: **"careerup-africa"**
3. Choose region closest to your users
4. Set strong database password

### 1.2 Get Project Credentials
Copy these from your Supabase dashboard:
```bash
Project URL: https://your-project-id.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚙️ **Step 2: Environment Configuration**

### 2.1 Create Environment Files

**`.env.local` (for development):**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Email Configuration
VITE_EMAIL_FROM=notifications@careerupafrica.com
VITE_COMPANY_NAME="CareerUp Africa"
```

**`.env.production` (for deployment):**
```bash
# Same as above but with production domain
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
```

### 2.2 Update Hosting Platform
**Vercel:** Add environment variables in project settings
**Netlify:** Add environment variables in site settings
**Other platforms:** Configure according to their documentation

---

## 🗄️ **Step 3: Database Schema Deployment**

### 3.1 Run SQL Scripts in Order
In your Supabase SQL editor, execute these files **in order**:

1. **Enable Extensions:**
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
```

2. **Core Schema:**
```bash
# Run these SQL files in your Supabase SQL editor IN ORDER:
supabase/sql/00_init.sql                     # Initialize extensions
supabase/sql/01_auth_profiles.sql            # User profiles
supabase/sql/02_talent_applications.sql      # Talent applications
supabase/sql/10_founder_applications.sql     # Founder applications
supabase/sql/03_cohorts.sql                  # Cohort management
supabase/sql/04_participants.sql             # Cohort participants
supabase/sql/05_founders.sql                 # Founders table
supabase/sql/06_projects.sql                 # Projects table
supabase/sql/06_drop_old_deliverables.sql    # ⚠️ Migration: Drop old schema
supabase/sql/13_tasks.sql                    # Task management (NEW)
supabase/sql/08_feedback.sql                 # Feedback system
supabase/sql/09_badges.sql                   # Badge system
supabase/sql/10_grant_admin.sql              # Grant admin privileges
supabase/sql/11_profile_extensions.sql       # Profile extensions
supabase/sql/12_matches.sql                  # Matching system

# Note: Skip 07_deliverables.sql (replaced by 13_tasks.sql)
```

### 3.2 Verify Schema
Check that all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `profiles`
- `talent_applications`
- `founder_applications`
- `cohorts`
- `cohort_participants`
- `tasks`
- `task_submissions`
- `feedback`
- `badges`
- `participant_badges`

---

## 🔐 **Step 4: Authentication & RLS Setup**

### 4.1 Enable Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_badges ENABLE ROW LEVEL SECURITY;
```

### 4.2 Configure Authentication
In Supabase Dashboard → Authentication:
- **Enable email confirmations** (recommended)
- **Set site URL**: `https://your-domain.com`
- **Add redirect URLs**: `https://your-domain.com/**`
- **Configure email templates** (optional)

---

## 📧 **Step 5: Email Notifications Setup**

### 5.1 Create Edge Function
```bash
# In your terminal
supabase functions new send-email
```

### 5.2 Deploy Email Function
Copy the email function code from `EMAIL_SETUP.md` and deploy:
```bash
supabase functions deploy send-email
```

### 5.3 Configure Email Provider
Choose and set up one:

**Option A: SendGrid**
```bash
# Add to Supabase Environment Variables
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=notifications@careerupafrica.com
```

**Option B: AWS SES**
```bash
AWS_SES_ACCESS_KEY=your_access_key
AWS_SES_SECRET_KEY=your_secret_key
AWS_SES_REGION=us-east-1
FROM_EMAIL=notifications@careerupafrica.com
```

---

## 🔧 **Step 6: Update Application Code**

### 6.1 Remove Demo Mode
Update `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Remove this function - always use Supabase in production
export const isSupabaseReady = () => true
```

### 6.2 Update Auth Store
Remove demo mode from `src/stores/authStore.ts`:
```typescript
// Remove all localStorage demo logic
// Remove initializeDemoUsers()
// Keep only Supabase authentication
```

### 6.3 Remove Demo Components
Delete or hide demo-specific components:
- Remove `<DemoBanner />` from App.tsx
- Remove demo credentials display
- Remove localStorage fallbacks in services

---

## 🌍 **Step 7: Deploy to Production**

### 7.1 Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

### 7.2 Netlify Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify (drag and drop dist folder)
# OR use Netlify CLI
```

### 7.3 Update Supabase URLs
In Supabase dashboard:
- **Authentication → URL Configuration**
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: `https://your-domain.com/**`

---

## ✅ **Step 8: Production Testing**

### 8.1 Test Authentication
- [ ] Sign up new account
- [ ] Email verification (if enabled)
- [ ] Sign in/out
- [ ] Password reset

### 8.2 Test Core Workflows
- [ ] **Talent Application**: Submit with scenario answers
- [ ] **Admin Review**: Approve/reject applications
- [ ] **Cohort Creation**: Create cohorts and assign participants
- [ ] **Task Management**: Create tasks and submit deliverables
- [ ] **Feedback System**: Provide ratings and feedback
- [ ] **Badge Awards**: Award badges to participants
- [ ] **Email Notifications**: Check all email types are sent

### 8.3 Test Admin Functions
- [ ] Admin dashboard statistics
- [ ] Application review interface
- [ ] Cohort management
- [ ] Badge validation
- [ ] Public badge verification

---

## 📊 **Step 9: Monitoring & Analytics**

### 9.1 Supabase Monitoring
- **Database → Performance**: Monitor query performance
- **Authentication → Users**: Track user registrations
- **Edge Functions → Logs**: Monitor email delivery
- **API → Logs**: Check for errors

### 9.2 Application Analytics
Add analytics to track:
- User registrations
- Application submissions
- Task completions
- Badge awards
- Email delivery rates

---

## 🚨 **Step 10: Security Checklist**

### 10.1 Environment Security
- [ ] All sensitive keys in environment variables
- [ ] No hardcoded credentials in code
- [ ] Production keys different from development
- [ ] Service role key secured (server-side only)

### 10.2 Database Security
- [ ] Row Level Security enabled on all tables
- [ ] Admin-only operations properly protected
- [ ] User data access restricted to authorized users
- [ ] Public endpoints (badge verification) properly secured

### 10.3 Application Security
- [ ] HTTPS enforced on production domain
- [ ] CORS properly configured
- [ ] Input validation on all forms
- [ ] File upload restrictions (if applicable)

---

## 🔄 **Step 11: Backup & Maintenance**

### 11.1 Database Backups
- **Automatic backups**: Enabled in Supabase (Pro plan)
- **Manual backups**: Export data regularly
- **Recovery testing**: Test backup restoration

### 11.2 Regular Maintenance
- **Monitor error logs** daily
- **Update dependencies** monthly
- **Review security policies** quarterly
- **Performance optimization** as needed

---

## 🆘 **Common Issues & Solutions**

### Issue: "Missing environment variables"
**Solution:** Check `.env` files are properly configured and deployed

### Issue: "Database connection failed"
**Solution:** Verify Supabase URL and API keys are correct

### Issue: "RLS policy blocks request"
**Solution:** Check Row Level Security policies allow the operation

### Issue: "Email not sending"
**Solution:** Verify Edge Function is deployed and email provider configured

### Issue: "Authentication redirect error"
**Solution:** Check Site URL and Redirect URLs in Supabase settings

---

## 📚 **Reference Links**

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Vercel Deployment](https://vercel.com/docs/deployments)
- [Netlify Deployment](https://docs.netlify.com/site-deploys/)

---

## ✅ **Production Checklist**

**Before Launch:**
- [ ] Supabase project created and configured
- [ ] All SQL schemas deployed
- [ ] Environment variables set
- [ ] RLS policies enabled
- [ ] Email function deployed
- [ ] Demo mode removed
- [ ] Production domain configured
- [ ] SSL certificate active
- [ ] All workflows tested
- [ ] Admin accounts created
- [ ] Backups enabled
- [ ] Monitoring configured

**After Launch:**
- [ ] Monitor error logs
- [ ] Check email delivery
- [ ] Verify user registrations
- [ ] Test admin functions
- [ ] Monitor performance
- [ ] Plan regular maintenance
- [ ] Set up user support

---

**🎉 Your CareerUp Africa platform is now ready for production with full Supabase integration!** 🚀