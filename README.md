# CareerUp Africa

**Proof Over Potential**

A structured talent proving ground that bridges learning and employability by connecting early professionals with founders. Participants execute real-world projects, receive feedback, and earn validated badges.

## 📊 Current Status

**Development:** ✅ 100% Complete (All 12 MVP features built and tested)  
**Backend:** ⏳ Setup Required (Supabase infrastructure needed)  
**Deployment:** ⏳ Not Started (4-5 hours estimated)

**Next Step:** Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to set up Supabase backend

## Quick Start

```bash
# Install dependencies
npm install

# Start in demo mode (no database needed)
npm run dev
```

Visit `http://localhost:5173` and create an account to explore.

## Features

- 🎯 **Real-world Projects** - Execute deliverables for actual companies
- 🏆 **Validated Badges** - Earn competence badges with public verification
- 📊 **6-Criteria Feedback** - Structured performance assessment system
- 👥 **Role-based Dashboards** - Participant, Founder, and Admin views
- 🎓 **Cohort Management** - Manual matching and cohort-based learning
- 📋 **Application Vetting** - Scenario-based talent screening
- ✨ **Demo Mode** - Try without database setup (pre-seeded accounts)
- 🎨 **Brand-compliant Design** - Navy (#1E3A8A) and Orange (#F97316) only
- 📄 **Legal Pages** - About, Contact, Privacy Policy, Terms of Service
- 🔐 **Public Badge Verification** - Independently verify earned badges

## Demo Accounts

When running in demo mode, use these pre-seeded accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `admin123` |
| Participant | `participant@demo.com` | `demo123` |
| Founder | `founder@demo.com` | `demo123` |

See [DEMO_CREDENTIALS.md](DEMO_CREDENTIALS.md) for more details.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Custom CSS with brand colors
- **State**: Zustand
- **Forms**: React Hook Form
- **Routing**: React Router v7

## Setup

### ⚡ Quick Demo Mode (No Database Required)

Start immediately with demo accounts:
```bash
npm install
npm run dev
```

Data is stored in your browser. Perfect for testing the UI. Use demo accounts above to explore.

### 🚀 Production Mode (With Supabase Backend)

**Status:** ⏳ Backend setup required (code 100% complete)

**Follow these guides in order:**

1. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** ← Start here! 
   - Complete step-by-step checklist
   - 4-5 hours total setup time
   - All tasks clearly defined

2. **[SUPABASE_PRODUCTION_SETUP.md](SUPABASE_PRODUCTION_SETUP.md)**
   - Detailed Supabase configuration
   - Database schema deployment
   - Authentication & RLS setup

3. **[EMAIL_SETUP.md](EMAIL_SETUP.md)**
   - Email notification configuration
   - Edge Function deployment
   - Provider integration (SendGrid/AWS SES)

4. **[DEMO_TO_PRODUCTION.md](DEMO_TO_PRODUCTION.md)** (Optional)
   - Remove demo mode code
   - Production-only configuration
   - Code cleanup guide

**Quick Setup:**
```bash
# 1. Create Supabase project
# 2. Run SQL scripts from supabase/sql/ folder
# 3. Add to .env.local:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# 4. Deploy email Edge Function
# 5. Deploy to Vercel/Netlify
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── auth/        # Login, SignUp, AuthPage
│   ├── DemoBanner   # Demo mode indicator
│   └── ProtectedRoute
├── pages/           # Page components
│   └── dashboard/   # Role-based dashboards
├── stores/          # Zustand state management
├── lib/             # Supabase client
└── styles/          # Design system & theme
```

## Brand Guidelines

This project follows the CareerUp Africa brand guide:

- **Colors**: Navy (#1E3A8A), Teal (#14B8A6), Orange (#F97316)
- **Typography**: Clear, direct, no jargon
- **Voice**: Accountable, transparent, results-focused
- **Message**: Proof over potential

See [brandguide.md](brandguide.md) for complete guidelines.

## Development Status

**MVP Implementation:** See [MVP_IMPLEMENTATION.md](MVP_IMPLEMENTATION.md)

**Completed (100%):**
- ✅ All 12 core features built and tested
- ✅ Authentication & user management
- ✅ Application system (talent + founder)
- ✅ Admin review & cohort management
- ✅ Task & feedback system
- ✅ Badge system with public verification
- ✅ Email notification system (7 types)
- ✅ Legal pages (About, Contact, Privacy, Terms)
- ✅ Professional design & UX
- ✅ Demo mode with pre-seeded accounts

**Deployment Phase (In Progress):**
- ⏳ Supabase project setup
- ⏳ Database schema deployment
- ⏳ Email Edge Function deployment
- ⏳ Production hosting configuration

**See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete deployment guide.**

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## License

Private project for CareerUp Africa.

---

**Built with direct communication, structured execution, and demonstrable results.**
