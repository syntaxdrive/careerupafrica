# CareerUp Africa - Development Roadmap
**Stack:** React + TypeScript + Supabase  
**Last Updated:** February 13, 2026

---

## Platform Overview
CareerUp Africa is a structured talent proving ground that bridges learning and employability by connecting early professionals with founders. Participants shadow, execute micro-deliverables, get feedback, and earn validated badges. **Proof over potential.**

---

## Core User Types
1. **Participants** - Early professionals building competence
2. **Founders** - Provide real-world projects and feedback
3. **Admin/Team** - Manage cohorts, validate badges, oversee quality
4. **Partners** (Future) - Organizations that recognize badges

---

## PHASE 1: FOUNDATION & AUTHENTICATION

### 1.1 Supabase Setup
- [ ] Install Supabase client library
- [ ] Configure environment variables
- [ ] Set up Supabase project and get API keys
- [ ] Initialize Supabase client in React app

### 1.2 Database Schema Design
**Tables needed:**
- [ ] `profiles` - User profiles (extends auth.users)
  - id, email, full_name, user_type (participant/founder/admin), created_at, updated_at
- [ ] `cohorts` - Cohort information
  - id, name, start_date, end_date, status, created_at
- [ ] `participants` - Extended participant data
  - id, profile_id, cohort_id, bio, skills, status
- [ ] `founders` - Extended founder data
  - id, profile_id, company_name, industry, bio
- [ ] `projects` - Real-world projects from founders
  - id, founder_id, title, description, status, created_at
- [ ] `deliverables` - Micro-tasks within projects
  - id, project_id, participant_id, title, description, requirements, due_date, status, submitted_at
- [ ] `submissions` - Deliverable submissions
  - id, deliverable_id, content, files, submitted_at
- [ ] `feedback` - Founder feedback on submissions
  - id, submission_id, founder_id, rating, comments, created_at
- [ ] `badges` - Competence badges
  - id, name, description, criteria, icon
- [ ] `participant_badges` - Earned badges
  - id, participant_id, badge_id, validated_by, validated_at, deliverable_ids

### 1.3 Authentication System
- [ ] Sign up flow (Email + Password)
- [ ] Login flow
- [ ] Logout functionality
- [ ] Password reset
- [ ] Email verification
- [ ] Protected routes (auth guard)
- [ ] User type selection (participant vs founder during signup)
- [ ] Supabase RLS (Row Level Security) policies

### 1.4 User Profiles
- [ ] View profile page
- [ ] Edit profile page
- [ ] Profile completion percentage
- [ ] Avatar upload (Supabase Storage)

---

## PHASE 2: CORE PLATFORM FEATURES

### 2.1 Participant Dashboard
- [ ] Current cohort overview
- [ ] Active deliverables list
- [ ] Upcoming deadlines
- [ ] Progress tracker
- [ ] Earned badges display
- [ ] Recent feedback
- [ ] Competence score/metrics

### 2.2 Founder Dashboard
- [ ] Active projects overview
- [ ] Participants assigned to you
- [ ] Pending feedback requests
- [ ] Create new project
- [ ] View project submissions
- [ ] Activity feed

### 2.3 Admin Dashboard
- [ ] Cohort management
- [ ] User management
- [ ] Badge validation queue
- [ ] Quality control metrics
- [ ] System analytics
- [ ] Platform announcements

---

## PHASE 3: COHORT MANAGEMENT

### 3.1 Cohort System
- [ ] Create cohort (Admin)
- [ ] View all cohorts (Admin)
- [ ] Cohort detail page
- [ ] Enroll participants in cohort
- [ ] Set cohort timeline
- [ ] Cohort status (upcoming, active, completed)
- [ ] Cohort participant list

### 3.2 Participant Onboarding
- [ ] Welcome flow for new participants
- [ ] Cohort orientation content
- [ ] Profile completion checklist
- [ ] Platform tour/walkthrough
- [ ] Accept cohort terms

---

## PHASE 4: PROJECT & DELIVERABLE SYSTEM

### 4.1 Project Management (Founder View)
- [ ] Create project form
- [ ] Edit project details
- [ ] Define project deliverables
- [ ] Assign participants to project
- [ ] Set deliverable requirements
- [ ] Set due dates
- [ ] Archive/complete projects

### 4.2 Deliverables (Participant View)
- [ ] View assigned deliverables
- [ ] Deliverable detail page (requirements, due date)
- [ ] Submit deliverable
- [ ] File upload for submissions (Supabase Storage)
- [ ] Re-submit after feedback
- [ ] Track submission status
- [ ] View feedback received

### 4.3 Deliverable States
- [ ] Not started
- [ ] In progress
- [ ] Submitted (pending review)
- [ ] Under review
- [ ] Needs revision
- [ ] Approved
- [ ] Badge-eligible

---

## PHASE 5: FEEDBACK & VALIDATION SYSTEM

### 5.1 Founder Feedback
- [ ] View pending submissions
- [ ] Review submission interface
- [ ] Provide feedback form (direct, specific, actionable)
- [ ] Rating system (quality metrics)
- [ ] Request revisions
- [ ] Approve submissions
- [ ] Flag for badge validation

### 5.2 Feedback Guidelines
- [ ] Feedback templates based on brand guide
- [ ] Character count for specificity
- [ ] Actionable next steps required
- [ ] Rating criteria display
- [ ] Examples of good feedback

### 5.3 Badge Validation (Admin)
- [ ] Review badge-eligible submissions
- [ ] Validate competence demonstrated
- [ ] Award badge to participant
- [ ] Badge verification record
- [ ] Badge rejection with reasons

---

## PHASE 6: BADGE SYSTEM

### 6.1 Badge Management
- [ ] Create badge types (Admin)
- [ ] Define badge criteria
- [ ] Badge icon upload
- [ ] Badge categories (skills/competencies)

### 6.2 Badge Display
- [ ] Participant badge showcase
- [ ] Badge detail page (what it proves)
- [ ] Deliverables that earned badge
- [ ] Validation information
- [ ] Share badge (social media)
- [ ] Download badge certificate

### 6.3 Badge Verification
- [ ] Public badge verification page
- [ ] Unique verification URL per badge
- [ ] QR code generation
- [ ] Validation details (who, when, what)

---

## PHASE 7: COMMUNICATION SYSTEM

### 7.1 In-App Notifications
- [ ] Notification system setup
- [ ] New deliverable assigned
- [ ] Deadline reminders (3 days, 1 day, today)
- [ ] Feedback received
- [ ] Badge awarded
- [ ] System announcements

### 7.2 Email System (Supabase Edge Functions)
- [ ] Welcome email template
- [ ] Deliverable assigned email
- [ ] Deadline reminder emails
- [ ] Feedback received email
- [ ] Badge awarded email
- [ ] Weekly progress summary
- [ ] Critical feedback email

### 7.3 Email Templates (Based on Brand Guide)
- [ ] Use direct, clear language
- [ ] Accountable tone
- [ ] Specific timelines
- [ ] Action-oriented
- [ ] No jargon

---

## PHASE 8: QUALITY & TRACKING

### 8.1 Quality Standards
- [ ] Deliverable quality rubric
- [ ] Minimum quality threshold
- [ ] Quality score calculation
- [ ] Quality trends over time

### 8.2 Progress Tracking
- [ ] Participant progress metrics
- [ ] Completion rates
- [ ] On-time submission rate
- [ ] Feedback implementation rate
- [ ] Competence growth chart

### 8.3 Admin Analytics
- [ ] Cohort performance metrics
- [ ] Founder engagement metrics
- [ ] Badge distribution
- [ ] Platform usage stats
- [ ] Quality control dashboard

---

## PHASE 9: MATCHING & ASSIGNMENT

### 9.1 Participant-Founder Matching
- [ ] Matching algorithm (skills, interests, availability)
- [ ] Manual assignment (Admin)
- [ ] Participant preferences
- [ ] Founder capacity management
- [ ] Review matching effectiveness

### 9.2 Project Assignment
- [ ] Auto-assign based on cohort
- [ ] Manual project assignment
- [ ] Participant workload management
- [ ] Project difficulty levels

---

## PHASE 10: SOCIAL & PUBLIC FEATURES

### 10.1 Public Landing Page
- [ ] Hero section (Proof over Potential)
- [ ] How it works section
- [ ] Success stories
- [ ] Brand colors (#1E3A8A, #14B8A6, #F97316)
- [ ] CTA for participants and founders
- [ ] Badge showcase

### 10.2 Success Stories
- [ ] Participant testimonials
- [ ] Project case studies
- [ ] Badge achievements
- [ ] Founder testimonials

### 10.3 Social Proof
- [ ] Stats (participants, badges, projects)
- [ ] Partner logos (future)
- [ ] Media mentions

---

## PHASE 11: SETTINGS & PREFERENCES

### 11.1 User Settings
- [ ] Email notification preferences
- [ ] Timezone settings
- [ ] Privacy settings
- [ ] Change password
- [ ] Delete account

### 11.2 Admin Settings
- [ ] Platform configuration
- [ ] Feature flags
- [ ] System maintenance mode
- [ ] Announcement banner

---

## PHASE 12: MOBILE RESPONSIVENESS

### 12.1 Responsive Design
- [ ] Mobile-first layout
- [ ] Tablet optimization
- [ ] Desktop optimization
- [ ] Touch-friendly interactions
- [ ] Mobile navigation

---

## PHASE 13: ADVANCED FEATURES (FUTURE)

### 13.1 Real-Time Features
- [ ] Real-time notifications (Supabase Realtime)
- [ ] Live activity feed
- [ ] Online status indicators

### 13.2 Advanced Analytics
- [ ] Data export
- [ ] Custom reports
- [ ] Predictive analytics
- [ ] Competence heatmaps

### 13.3 Integration Features
- [ ] Calendar integration (Google Calendar)
- [ ] LinkedIn badge sharing
- [ ] Slack notifications
- [ ] API for partners

### 13.4 Community Features
- [ ] Participant directory
- [ ] Peer feedback (optional)
- [ ] Discussion forums
- [ ] Resource library

---

## TECHNICAL REQUIREMENTS

### Frontend (React + TypeScript)
- [ ] React Router for routing
- [ ] State management (React Context or Zustand)
- [ ] Form library (React Hook Form)
- [ ] UI component library (or custom components with brand colors)
- [ ] Date handling (date-fns)
- [ ] File upload handling
- [ ] Error boundaries
- [ ] Loading states
- [ ] Toast notifications

### Backend (Supabase)
- [ ] Database (PostgreSQL)
- [ ] Authentication
- [ ] Storage (file uploads)
- [ ] Edge Functions (email, complex logic)
- [ ] Real-time subscriptions
- [ ] Row Level Security policies

### Design System
- [ ] Brand colors implementation
  - Navy Blue: #1E3A8A
  - Teal: #14B8A6
  - Orange: #F97316
  - White: #FFFFFF
  - Charcoal: #0F172A
  - Light Blue: #E0F2FE
- [ ] Typography system
- [ ] Button styles
- [ ] Form components
- [ ] Card components
- [ ] Modal system
- [ ] Layout components

### DevOps
- [ ] Environment setup (dev, staging, prod)
- [ ] CI/CD pipeline
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Backup strategy

---

## DEVELOPMENT PRIORITIES

### Must-Have (MVP)
1. Authentication & user profiles
2. Cohort management
3. Project & deliverable system
4. Feedback system
5. Basic badge awarding
6. Participant & founder dashboards

### Should-Have (V1)
1. Email notifications
2. Badge verification
3. Quality metrics
4. Admin analytics
5. Landing page

### Nice-to-Have (V2+)
1. Real-time features
2. Advanced matching
3. Social features
4. Partner integrations
5. Mobile apps

---

## BRAND COMPLIANCE CHECKLIST

Every feature must align with:
- ✓ **Accountability** - Clear deadlines, follow-through
- ✓ **Transparency** - No hidden processes
- ✓ **Goal-Oriented** - Every action has purpose
- ✓ **Results-Focused** - Quality over quantity
- ✓ **Supportive Feedback** - Direct but constructive
- ✓ **Direct Communication** - No jargon, clear language
- ✓ **Purpose-Driven** - Does it build competence?

### Language Rules
- Use: prove, demonstrate, validate, execute, structured, competence, deliverable, real-world
- Avoid: exposure, opportunity, potential, try, maybe, hopefully, journey, leverage, synergy

---

## NEXT STEPS

1. Review and approve this roadmap
2. Set up Supabase project
3. Design database schema in detail
4. Create design system with brand colors
5. Start with Phase 1: Foundation & Authentication

---

*This roadmap is a living document. Update as priorities shift.*
