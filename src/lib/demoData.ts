/**
 * Demo Data Seeding
 * This file initializes demo users for testing when running without Supabase
 */

import type { Profile } from '../stores/authStore'

const DEMO_USERS_KEY = 'careerup_demo_users'
const DEMO_INITIALIZED_KEY = 'careerup_demo_initialized'

export interface DemoUser {
  email: string
  password: string
  profile: Profile
}

/**
 * Default demo users for testing
 */
export const DEFAULT_DEMO_USERS: DemoUser[] = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    profile: {
      id: 'demo-admin-1',
      email: 'admin@demo.com',
      full_name: 'Admin User',
      user_type: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    email: 'participant@demo.com',
    password: 'demo123',
    profile: {
      id: 'demo-participant-1',
      email: 'participant@demo.com',
      full_name: 'Jane Participant',
      user_type: 'participant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    email: 'founder@demo.com',
    password: 'demo123',
    profile: {
      id: 'demo-founder-1',
      email: 'founder@demo.com',
      full_name: 'John Founder',
      user_type: 'founder',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
]

/**
 * Initialize demo users if not already done
 */
export function initializeDemoUsers(): void {
  const initialized = localStorage.getItem(DEMO_INITIALIZED_KEY)
  
  if (!initialized) {
    // First time initialization - seed default users
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(DEFAULT_DEMO_USERS))
    localStorage.setItem(DEMO_INITIALIZED_KEY, 'true')
    console.log('Demo users initialized:', DEFAULT_DEMO_USERS.map(u => u.email))
  }
}

/**
 * Reset demo data (useful for testing)
 */
export function resetDemoData(): void {
  localStorage.removeItem(DEMO_USERS_KEY)
  localStorage.removeItem(DEMO_INITIALIZED_KEY)
  localStorage.removeItem('careerup_demo_session')
  
  // Re-initialize with defaults
  initializeDemoUsers()
  
  console.log('Demo data reset complete')
}
