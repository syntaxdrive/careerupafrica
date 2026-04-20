# CareerUp Africa Database Schema

This folder contains the database schema split into logical feature-based SQL files.

## Setup Order

Run these files **in order** in your Supabase SQL Editor:

1. **00_init.sql** - Extensions, functions, and triggers
2. **01_auth_profiles.sql** - User profiles and authentication
3. **02_talent_applications.sql** - Talent application system
4. **03_cohorts.sql** - Cohort management
5. **04_participants.sql** - Approved participants
6. **05_founders.sql** - Company founders
7. **06_projects.sql** - Founder projects
8. **07_deliverables.sql** - Tasks and submissions
9. **08_feedback.sql** - Founder feedback
10. **09_badges.sql** - Achievement badges

## File Organization

Each file contains:
- Table creation
- Row Level Security (RLS) policies
- Triggers (where applicable)
- Indexes (where applicable)
- Comments explaining purpose

## Quick Setup

If you want to run everything at once, you can concatenate all files in order:

```bash
# In PowerShell
Get-Content 00_init.sql, 01_auth_profiles.sql, 02_talent_applications.sql, 03_cohorts.sql, 04_participants.sql, 05_founders.sql, 06_projects.sql, 07_deliverables.sql, 08_feedback.sql, 09_badges.sql | Out-File -FilePath ../full_schema.sql
```

Then run `full_schema.sql` in Supabase SQL Editor.

## Feature Map

- **Authentication**: 01_auth_profiles.sql
- **Talent Intake**: 02_talent_applications.sql
- **Cohort System**: 03_cohorts.sql, 04_participants.sql
- **Founder System**: 05_founders.sql, 06_projects.sql
- **Work System**: 07_deliverables.sql, 08_feedback.sql
- **Validation System**: 09_badges.sql

## Notes

- All tables have Row Level Security (RLS) enabled
- Updated timestamps are automatically managed via triggers
- Profile creation is automatic on user signup via `handle_new_user()` function
