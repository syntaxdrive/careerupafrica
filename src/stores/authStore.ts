import { create } from 'zustand'
import { supabase, isSupabaseReady } from '../lib/supabase'
import { initializeDemoUsers } from '../lib/demoData'
import type { User, Session } from '@supabase/supabase-js'

export type UserType = 'participant' | 'founder' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  user_type: UserType
  created_at: string
  updated_at: string
}

// ============================================
// DEMO MODE (when Supabase is not configured)
// ============================================
// This allows the app to run without Supabase
// Remove this section when Supabase is connected
// ============================================

const DEMO_USERS_KEY = 'careerup_demo_users'
const DEMO_SESSION_KEY = 'careerup_demo_session'

// Demo mode helpers
const getDemoUsers = (): Array<{ email: string; password: string; profile: Profile }> => {
  const stored = localStorage.getItem(DEMO_USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveDemoUsers = (users: Array<{ email: string; password: string; profile: Profile }>) => {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

const getDemoSession = (): { user: User; profile: Profile } | null => {
  const stored = localStorage.getItem(DEMO_SESSION_KEY)
  return stored ? JSON.parse(stored) : null
}

const saveDemoSession = (user: User, profile: Profile) => {
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ user, profile }))
}

const clearDemoSession = () => {
  localStorage.removeItem(DEMO_SESSION_KEY)
}

// ============================================
// AUTH STORE
// ============================================

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  initialized: boolean
  
  // Actions
  initialize: () => Promise<void>
  signUp: (email: string, password: string, fullName: string, userType: UserType) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    try {
      // ============================================
      // DEMO MODE: Load from localStorage
      // ============================================
      if (!isSupabaseReady()) {
        // Initialize demo users if first time
        initializeDemoUsers()
        
        const demoSession = getDemoSession()
        if (demoSession) {
          set({ 
            user: demoSession.user, 
            profile: demoSession.profile,
            session: null,
            loading: false,
            initialized: true
          })
        } else {
          set({ loading: false, initialized: true })
        }
        return
      }

      // ============================================
      // SUPABASE MODE: Real authentication
      // ============================================
      // Get initial session
      const { data: { session }, error } = await supabase!.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        set({ loading: false, initialized: true })
        return
      }

      if (session?.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
        }

        set({ 
          user: session.user, 
          session, 
          profile: profile || null,
          loading: false,
          initialized: true
        })
      } else {
        set({ loading: false, initialized: true })
      }

      // Listen for auth changes
      supabase!.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          set({ 
            user: session.user, 
            session, 
            profile: profile || null,
            loading: false
          })
        } else {
          set({ 
            user: null, 
            session: null, 
            profile: null,
            loading: false
          })
        }
      })
    } catch (error) {
      console.error('Initialization error:', error)
      set({ loading: false, initialized: true })
    }
  },

  signUp: async (email: string, password: string, fullName: string, userType: UserType) => {
    try {
      set({ loading: true })

      // ============================================
      // DEMO MODE: Save to localStorage
      // ============================================
      if (!isSupabaseReady()) {
        const demoUsers = getDemoUsers()
        
        // Check if user already exists
        if (demoUsers.some(u => u.email === email)) {
          set({ loading: false })
          return { error: new Error('User already exists') }
        }

        // Create demo user
        const userId = `demo-${Date.now()}`
        const mockUser = {
          id: userId,
          email,
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: { full_name: fullName, user_type: userType },
          aud: 'authenticated',
          role: 'authenticated'
        } as User

        const profile: Profile = {
          id: userId,
          email,
          full_name: fullName,
          user_type: userType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        demoUsers.push({ email, password, profile })
        saveDemoUsers(demoUsers)
        saveDemoSession(mockUser, profile)

        set({ 
          user: mockUser,
          profile,
          loading: false
        })

        return { error: null }
      }

      // ============================================
      // SUPABASE MODE: Real authentication
      // ============================================
      const { data, error: signUpError } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      })

      if (signUpError) {
        set({ loading: false })
        return { error: signUpError }
      }

      if (data.user) {
        // Create profile (this might be handled by a database trigger)
        const { error: profileError } = await supabase!
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            user_type: userType,
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }

      set({ loading: false })
      return { error: null }
    } catch (error) {
      set({ loading: false })
      return { error: error as Error }
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true })

      // ============================================
      // DEMO MODE: Check localStorage
      // ============================================
      if (!isSupabaseReady()) {
        const demoUsers = getDemoUsers()
        const user = demoUsers.find(u => u.email === email && u.password === password)

        if (!user) {
          set({ loading: false })
          return { error: new Error('Invalid email or password') }
        }

        const mockUser = {
          id: user.profile.id,
          email: user.email,
          created_at: user.profile.created_at,
          app_metadata: {},
          user_metadata: { 
            full_name: user.profile.full_name, 
            user_type: user.profile.user_type 
          },
          aud: 'authenticated',
          role: 'authenticated'
        } as User

        saveDemoSession(mockUser, user.profile)

        set({ 
          user: mockUser,
          profile: user.profile,
          loading: false
        })

        return { error: null }
      }

      // ============================================
      // SUPABASE MODE: Real authentication
      // ============================================
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({ loading: false })
        return { error }
      }

      if (data.user) {
        // Fetch profile
        const { data: profile } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        set({ 
          user: data.user,
          session: data.session,
          profile: profile || null,
          loading: false
        })
      }

      return { error: null }
    } catch (error) {
      set({ loading: false })
      return { error: error as Error }
    }
  },

  signOut: async () => {
    try {
      set({ loading: true })

      // ============================================
      // DEMO MODE: Clear localStorage
      // ============================================
      if (!isSupabaseReady()) {
        clearDemoSession()
        set({ 
          user: null, 
          profile: null, 
          session: null,
          loading: false
        })
        return
      }

      // ============================================
      // SUPABASE MODE: Real sign out
      // ============================================
      await supabase!.auth.signOut()
      set({ 
        user: null, 
        profile: null, 
        session: null,
        loading: false
      })
    } catch (error) {
      console.error('Sign out error:', error)
      set({ loading: false })
    }
  },

  resetPassword: async (email: string) => {
    try {
      // ============================================
      // DEMO MODE: Not implemented
      // ============================================
      if (!isSupabaseReady()) {
        return { error: new Error('Password reset not available in demo mode') }
      }

      // ============================================
      // SUPABASE MODE: Real password reset
      // ============================================
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      return { error: error || null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      const { user, profile } = get()
      if (!user || !profile) {
        return { error: new Error('No user logged in') }
      }

      // ============================================
      // DEMO MODE: Update localStorage
      // ============================================
      if (!isSupabaseReady()) {
        const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() }
        const demoUsers = getDemoUsers()
        const userIndex = demoUsers.findIndex(u => u.profile.id === profile.id)
        
        if (userIndex >= 0) {
          demoUsers[userIndex].profile = updatedProfile
          saveDemoUsers(demoUsers)
          saveDemoSession(user, updatedProfile)
          set({ profile: updatedProfile })
        }

        return { error: null }
      }

      // ============================================
      // SUPABASE MODE: Real update
      // ============================================
      const { error } = await supabase!
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        return { error }
      }

      // Refetch profile
      const { data: newProfile } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      set({ profile: newProfile })
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },
}))
