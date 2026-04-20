# CareerUp Africa - Setup Guide

## Quick Start (Demo Mode)

**Want to try the app immediately?**

The app runs in **demo mode** without Supabase. Your data is stored in the browser only.

```bash
npm run dev
```

That's it! Create an account and explore. When you're ready to add a real database, follow the Supabase setup below.

---

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account ([sign up here](https://supabase.com))

## Step 1: Create a Supabase Project

**When to do this:**
- When you're ready to deploy to production
- When you want real authentication with email verification
- When you need multi-device access
- When you want team collaboration

**For now, skip this if you just want to explore the UI in demo mode.**

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project name**: careerup-africa
   - **Database password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

## Step 2: Set Up the Database

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Run the SQL files from `supabase/sql/` folder **in order** (00 through 09)
   - See `supabase/sql/README.md` for detailed instructions
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned" - this is correct!

## Step 3: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 4: Configure Environment Variables

1. Open the `.env.local` file in the root of this project
2. Replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Save the file

⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Step 5: Install Dependencies (Already Done)

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Step 6: Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Switching from Demo Mode to Supabase

If you started in demo mode and want to switch to Supabase:

1. Complete Steps 1-4 above (Create Supabase project, set up database, get credentials, update .env.local)
2. Restart the dev server (`Ctrl+C` then `npm run dev`)
3. The orange "DEMO MODE" banner will disappear
4. Create new accounts (demo data won't transfer)

**Note:** Demo mode data is stored in browser localStorage and won't transfer to Supabase. You'll need to create fresh accounts after connecting.

## Step 7: Test the Application

### Create Your First Account

1. Click "Create Account"
2. Choose "Participant" or "Founder"
3. Fill in your details
4. Click "Create Account"
5. Check your email for verification (if enabled)
6. Sign in with your credentials

### Create an Admin Account (Optional)

To create an admin account, you need to manually update the database:

1. Create a regular account first (as participant or founder)
2. Go to Supabase dashboard → **Table Editor** → **profiles**
3. Find your user record
4. Change `user_type` from `participant` to `admin`
5. Click "Save"
6. Sign out and sign in again

## Project Structure

```
careerup/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   │   ├── Login.tsx
│   │   │   ├── SignUp.tsx
│   │   │   └── AuthPage.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   └── dashboard/      # Dashboard pages
│   │       ├── ParticipantDashboard.tsx
│   │       ├── FounderDashboard.tsx
│   │       ├── AdminDashboard.tsx
│   │       └── Dashboard.tsx
│   ├── stores/
│   │   └── authStore.ts    # Zustand auth state
│   ├── lib/
│   │   └── supabase.ts     # Supabase client
│   ├── styles/
│   │   └── theme.ts        # Design system (brand colors)
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx
│   └── index.css           # Global styles
├── supabase/
│   └── schema.sql          # Database schema
├── .env.local              # Environment variables (not in git)
├── .env.example            # Template for environment variables
└── DEVELOPMENT_ROADMAP.md  # Full development plan
```

## What's Built So Far

✅ **Phase 1: Foundation & Authentication**
- Supabase configuration
- Database schema (10 tables)
- Authentication system (signup, login, logout)
- User type selection (participant, founder, admin)
- Protected routes
- Role-based dashboards

✅ **Design System**
- Brand colors implemented
- Global styles
- Reusable components
- Form styles
- Button variants

## Next Steps

See `DEVELOPMENT_ROADMAP.md` for the complete development plan.

**Immediate priorities:**
1. Test authentication flow
2. Build cohort management (Phase 3)
3. Create project & deliverable system (Phase 4)
4. Implement feedback system (Phase 5)

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env.local` exists in the root directory
- Verify variable names start with `VITE_`
- Restart the dev server after changing `.env.local`

### Authentication not working
- Verify database schema was created successfully
- Check Supabase logs in dashboard
- Ensure email confirmation is configured if enabled

### Styling not applying
- Clear browser cache
- Check browser console for errors
- Verify CSS imports in components

## Brand Compliance

All features follow the CareerUp Africa brand guide:
- **Colors**: Navy (#1E3A8A), Teal (#14B8A6), Orange (#F97316)
- **Language**: Direct, clear, no jargon
- **Values**: Accountability, Transparency, Results-Focused
- **Message**: Proof over Potential

## Support

For issues or questions:
1. Check the DEVELOPMENT_ROADMAP.md
2. Review brand guide (brandguide.md)
3. Check Supabase documentation: https://supabase.com/docs

---

**Ready to build competence validation!** 🚀
