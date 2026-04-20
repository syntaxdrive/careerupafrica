# Demo Credentials & Admin Access

## Demo Mode (No Supabase)

When running without Supabase, the app automatically seeds demo accounts:

### Pre-seeded Demo Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `admin@demo.com` | `admin123` | Full platform access - manage cohorts, applications, badges |
| **Participant** | `participant@demo.com` | `demo123` | Talent building competence |
| **Founder** | `founder@demo.com` | `demo123` | Startup providing projects |

### Using Demo Accounts

1. Navigate to `/auth` (login page)
2. Use any of the credentials above
3. The demo banner shows these credentials for easy reference
4. Data is stored in browser localStorage only

### Creating Additional Accounts

- You can sign up for new accounts (including admin in demo mode)
- Admin option is only visible in signup when running without Supabase
- All demo data persists until you clear browser storage

### Resetting Demo Data

Open browser console and run:
```javascript
localStorage.clear();
location.reload();
```

---

## Production Mode (With Supabase)

### Making a User Admin

In production, users sign up normally as "participant" or "founder". To grant admin privileges:

1. **User registers** via the signup form (as participant or founder)
2. **Admin grants role** by running SQL in Supabase SQL Editor:

```sql
-- Replace with actual user email
UPDATE profiles 
SET 
  user_type = 'admin',
  updated_at = now()
WHERE email = 'newadmin@example.com';
```

3. **User must log out and back in** for the role change to take effect

### First Admin Setup

When you first deploy to production:

1. Have your first admin user sign up through the normal flow
2. Go to Supabase Dashboard → SQL Editor
3. Run the SQL script in `supabase/sql/10_grant_admin.sql`
4. Update the email to match your admin user
5. They can now access admin features after logging back in

### Security Notes

- Admin option is **not available** in production signup (only demo mode)
- Admins must be manually promoted via SQL by database owner
- This prevents unauthorized admin account creation
- All admin actions are logged with the validated_by field

### Permissions in Production

| User Type | Can Access |
|-----------|------------|
| **Admin** | All features: applications, cohorts, matching, badge management, awarding badges |
| **Founder** | My Talent, task management, feedback review, project creation |
| **Participant** | Tasks, submissions, feedback history, badge showcase, profile |

---

## Testing Badge System

### As Admin (admin@demo.com):

1. Go to `/admin/badges` - Create badge types
2. Go to `/admin/badges/award` - Award badges to participants
3. Review badge-eligible tasks from feedback system

### As Participant (participant@demo.com):

1. Go to `/badges` - View earned badges
2. Click badge details to see validation info
3. Share verification URLs with "employers"

### As Public (no login):

1. Get verification URL from participant's badge detail page
2. Visit `/badges/verify/{badgeId}` 
3. See full badge validation without logging in

---

## Development Workflow

### Local Development (Demo Mode)

```bash
npm run dev
# Use pre-seeded demo accounts
# All features work with localStorage
```

### Production Deployment (Supabase)

```bash
# 1. Configure Supabase in .env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# 2. Run database migrations
# Execute all SQL files in supabase/sql/ folder in order

# 3. Create first admin
# Sign up → Run 10_grant_admin.sql with your email

# 4. Deploy
npm run build
```

---

## Troubleshooting

### "I can't access admin features"

- **Demo Mode**: Use `admin@demo.com` / `admin123`
- **Production**: Verify your user_type in profiles table
- **After role change**: Log out and back in

### "Demo accounts not appearing"

- Check browser console for initialization logs
- Clear localStorage and reload page
- Verify `careerup_demo_users` exists in localStorage

### "Badge system not working"

1. Ensure you're logged in as admin to create badges
2. Tasks must have feedback with `badge_eligible = true`
3. Check `/admin/badges/award` for eligible tasks list

---

## Next Steps

1. **Test Badge Workflow**: Login as admin → create badges → award → view as participant
2. **Configure Supabase**: Follow setup guide for production database
3. **Create Real Data**: Applications, cohorts, tasks, feedback, badges
4. **Deploy**: Build and deploy to your hosting platform
