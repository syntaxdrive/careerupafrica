# CareerUp - Demo to Production Migration

This document outlines the specific code changes needed to migrate from demo mode (localStorage) to production mode (Supabase only).

## 📋 **Files to Modify**

### 1. `src/lib/supabase.ts` - Force Supabase Mode

**Current (dual mode):**
```typescript
export const isSupabaseReady = () => {
  return supabase !== null;
};
```

**Production (Supabase only):**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Always use Supabase in production
export const isSupabaseReady = () => true
```

### 2. `src/stores/authStore.ts` - Remove Demo Users

**Remove these sections:**
- All demo user localStorage logic
- `initializeDemoUsers()` calls
- Demo user constants
- localStorage session management

**Keep only:**
- Supabase authentication
- Profile management
- Session handling

### 3. `src/components/DemoBanner.tsx` - Hide or Delete

**Option A: Hide the banner**
```typescript
export default function DemoBanner() {
  return null; // Always hidden in production
}
```

**Option B: Delete the file entirely**

### 4. `src/lib/emailService.ts` - Remove Notification Store

**Current (dual mode):**
```typescript
if (!this.isSupabaseAvailable) {
  // Demo mode: Store as in-app notification
  notificationStore.addNotification({...});
  return { success: true };
}
```

**Production (emails only):**
```typescript
// Always send actual emails via Supabase Edge Function
const { data, error } = await supabase.functions.invoke('send-email', {
  body: emailData
});

if (error) {
  console.error('Failed to send email:', error);
  return { success: false, error: error.message };
}

return { success: true };
```

### 5. All Service Files - Remove localStorage Fallbacks

**Files to update:**
- `src/lib/applicationService.ts`
- `src/lib/founderApplicationService.ts`
- `src/lib/adminService.ts`
- `src/lib/badgeService.ts`
- `src/lib/feedbackService.ts`

**Remove these patterns:**
```typescript
if (isSupabaseReady()) {
  // Supabase logic
} else {
  // localStorage logic - REMOVE THIS
}
```

**Keep only:**
```typescript
// Direct Supabase calls only
const { data, error } = await supabase.from('table_name')...
```

### 6. `src/components/Header.tsx` - Remove Notification Center (Optional)

If you only want email notifications (no in-app notifications):
```typescript
// Remove this line
import NotificationCenter from './NotificationCenter';

// Remove this component
<NotificationCenter />
```

### 7. `src/App.tsx` - Remove Demo Banner

```typescript
// Remove this import
import DemoBanner from './components/DemoBanner'

// Remove this component from render
<DemoBanner />
```

## 🗑️ **Files to Delete (Optional)**

These files are only needed for demo mode:
- `src/lib/demoData.ts`
- `src/components/DemoBanner.tsx`
- `src/components/NotificationCenter.tsx` (if no in-app notifications)
- `src/components/NotificationCenter.css`
- `DEMO_CREDENTIALS.md`

## ⚙️ **Environment Variables Required**

**`.env.local`:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 **Testing After Migration**

### Test These Workflows:
1. **Authentication**
   - Sign up → Should create Supabase user
   - Sign in → Should authenticate via Supabase
   - Profile creation → Should save to `profiles` table

2. **Applications**
   - Talent application → Should save to `talent_applications`
   - Founder application → Should save to `founder_applications`
   - Email confirmations → Should send actual emails

3. **Admin Functions**
   - Application approval → Should update database + send email
   - Cohort creation → Should save to `cohorts` table
   - Badge awards → Should save to `participant_badges` + send email

4. **Badge System**
   - Badge creation → Should save to `badges` table
   - Public verification → Should query `participant_badges`

## 🚨 **Critical Checks**

Before deploying:
- [ ] All localStorage code removed
- [ ] Environment variables set
- [ ] Supabase schema deployed
- [ ] RLS policies enabled
- [ ] Email function deployed
- [ ] Demo components hidden/removed
- [ ] Error handling for missing data

## 📦 **Deployment Commands**

```bash
# Remove demo dependencies (if any)
npm uninstall any-demo-packages

# Build for production
npm run build

# Deploy to your platform
vercel --prod
# OR
netlify deploy --prod
```

## 🔄 **Rollback Plan**

If issues arise, you can quickly revert:
1. Re-enable demo mode in `supabase.ts`
2. Add back localStorage fallbacks
3. Show demo banner again
4. Test locally before redeploying

---

**🎯 Result:** Production-ready CareerUp platform with Supabase-only mode, no localStorage fallbacks, actual email delivery, and full enterprise functionality.