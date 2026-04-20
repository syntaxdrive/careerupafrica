import { createClient } from '@supabase/supabase-js'

// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================
// To enable Supabase:
// 1. Add your credentials to .env.local file
// 2. Restart the dev server
// ============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')

// Create Supabase client (will be null if not configured)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to check if Supabase is ready
export const isSupabaseReady = () => supabase !== null

// Show warning in console if Supabase is not configured
if (!isSupabaseReady()) {
  console.warn(
    '⚠️ Supabase is not configured. The app will run in demo mode.\n' +
    'To connect Supabase:\n' +
    '1. Create a project at https://app.supabase.com\n' +
    '2. Add credentials to .env.local file\n' +
    '3. Restart the dev server'
  )
}

// Database types will be generated here later
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          user_type: 'participant' | 'founder' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          user_type: 'participant' | 'founder' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          user_type?: 'participant' | 'founder' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      // More tables will be added as we build
    }
  }
}
