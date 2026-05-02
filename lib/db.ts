import { supabase } from './supabase'
import { Database } from './database.types'

type Template = Database['public']['Tables']['templates']['Row']
type WaveInsert = Database['public']['Tables']['waves']['Insert']
type RecipientInsert = Database['public']['Tables']['wave_recipients']['Insert']

/**
 * Fetch all available templates.
 */
export async function getTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Create a new wave.
 */
export async function createWave(wave: WaveInsert) {
  const { data, error } = await supabase
    .from('waves')
    .insert(wave)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Add recipients to a specific wave.
 */
export async function addWaveRecipients(recipients: RecipientInsert[]) {
  const { data, error } = await supabase
    .from('wave_recipients')
    .insert(recipients)
    .select()

  if (error) throw error
  return data
}

/**
 * Fetch a wave with its recipients.
 */
export async function getWaveWithRecipients(waveId: string) {
  const { data, error } = await supabase
    .from('waves')
    .select(`
      *,
      wave_recipients (*)
    `)
    .eq('id', waveId)
    .single()

  if (error) throw error
  return data
}

/**
 * Update user profile.
 */
export async function updateUserProfile(userId: string, updates: Database['public']['Tables']['users']['Update']) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
