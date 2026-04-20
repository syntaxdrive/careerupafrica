# Quick Reference: Adding Supabase

## When You're Ready to Connect Supabase

Follow these 3 simple steps:

### Step 1: Create Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Wait for it to finish setting up (2-3 minutes)

### Step 2: Run the Database Schema
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. For each SQL file in `supabase/sql/` folder, run them **in order**:
   - Open `supabase/sql/00_init.sql` → Copy → Paste in SQL Editor → Click "Run"
   - Open `supabase/sql/01_auth_profiles.sql` → Copy → Paste → Run
   - Open `supabase/sql/02_talent_applications.sql` → Copy → Paste → Run
   - Open `supabase/sql/03_cohorts.sql` → Copy → Paste → Run
   - Open `supabase/sql/04_participants.sql` → Copy → Paste → Run
   - Open `supabase/sql/05_founders.sql` → Copy → Paste → Run
   - Open `supabase/sql/06_projects.sql` → Copy → Paste → Run
   - Open `supabase/sql/07_deliverables.sql` → Copy → Paste → Run
   - Open `supabase/sql/08_feedback.sql` → Copy → Paste → Run
   - Open `supabase/sql/09_badges.sql` → Copy → Paste → Run

**TIP:** See `supabase/sql/README.md` for more details on each file.

### Step 3: Add Your Credentials

1. In Supabase, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL**
   - **anon/public key**
3. Open this file: `.env.local`
4. Replace the placeholder values with your real ones:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjg5MzI3NCwiZXhwIjoxOTMyNDY5Mjc0fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

5. Save the file
6. Restart your dev server:
   - Press `Ctrl+C` to stop
   - Run `npm run dev` to start again

### That's It!

The orange "DEMO MODE" banner will disappear, and you're now connected to Supabase.

---

## Files That Were Modified for Easy Setup

These files now work with OR without Supabase:

### 1. `src/lib/supabase.ts`
- Checks if credentials are configured
- Shows helpful warning if not
- Creates client only when ready

### 2. `src/stores/authStore.ts`
- Works in "demo mode" (localStorage) without Supabase
- Automatically switches to real auth when Supabase is connected
- All the same functions work in both modes

### 3. `src/components/DemoBanner.tsx`
- Shows orange banner when in demo mode
- Automatically hides when Supabase is connected

### 4. `.env.local`
- Contains placeholder values
- Clear comments showing where to paste your credentials

---

## What Changes When You Connect?

**Demo Mode (Current):**
- ✅ Full UI works
- ✅ Create accounts
- ✅ Sign in/out
- ✅ Role-based dashboards
- ⚠️ Data only in YOUR browser
- ⚠️ No email verification
- ⚠️ Data lost if you clear browser

**With Supabase:**
- ✅ Everything from demo mode
- ✅ Real database (persistent)
- ✅ Multi-device access
- ✅ Email verification (optional)
- ✅ Team collaboration
- ✅ Production-ready

---

## Troubleshooting

**"Demo mode banner won't go away"**
- Make sure you added REAL credentials (not the placeholder text)
- Make sure the URL starts with `https://`
- Restart the dev server (`Ctrl+C` then `npm run dev`)

**"Error connecting to Supabase"**
- Double-check you copied the full anon key (it's very long)
- Make sure you ran the SQL schema in Step 2
- Check for typos in `.env.local`

**"I want to go back to demo mode"**
- Put back the placeholder text in `.env.local`
- Restart the dev server

---

Need help? Check [SETUP.md](SETUP.md) for more details.
