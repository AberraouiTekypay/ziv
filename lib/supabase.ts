import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// In development/build, we allow placeholders.
// We only throw if we are CERTAIN we are in a live production runtime (optional).
// For now, let's just log a warning to allow build to pass.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('WARNING: Missing Supabase environment variables. Using placeholders.')
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
)
