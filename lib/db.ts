import { supabase } from './supabase'
import { Database } from './database.types'

type Template = Database['public']['Tables']['templates']['Row']
type WaveInsert = Database['public']['Tables']['waves']['Insert']
type RecipientInsert = Database['public']['Tables']['wave_recipients']['Insert']

/**
 * Fetch all available templates.
 */
export async function getTemplates(): Promise<Template[]> {
  const { data, error } = await (supabase as any)
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Template[]
}

/**
 * Create a new wave.
 */
export async function createWave(wave: WaveInsert): Promise<Database['public']['Tables']['waves']['Row']> {
  const { data, error } = await (supabase as any)
    .from('waves')
    .insert(wave)
    .select()
    .single()

  if (error) throw error
  return data as Database['public']['Tables']['waves']['Row']
}

/**
 * Add recipients to a specific wave.
 */
export async function addWaveRecipients(recipients: RecipientInsert[]): Promise<RecipientInsert[]> {
  const { data, error } = await (supabase as any)
    .from('wave_recipients')
    .insert(recipients)
    .select()

  if (error) throw error
  return data as any[]
}

/**
 * Fetch a wave with its recipients.
 */
export async function getWaveWithRecipients(waveId: string) {
  const { data, error } = await (supabase as any)
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
  const { data, error } = await (supabase as any)
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch a specific wave recipient with its associated wave and template.
 */
export async function getWaveRecipientDetails(recipientId: string): Promise<any> {
  const { data, error } = await (supabase as any)
    .from('wave_recipients')
    .select(`
      *,
      waves (
        *,
        templates (*)
      )
    `)
    .eq('id', recipientId)
    .single()

  if (error) throw error
  return data
}

/**
 * Update the status of a specific wave recipient.
 */
export async function updateRecipientStatus(recipientId: string, status: 'pending' | 'sent' | 'failed'): Promise<any> {
  const { data, error } = await (supabase as any)
    .from('wave_recipients')
    .update({ status })
    .eq('id', recipientId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get a user by email or create a new one if it doesn't exist.
 */
export async function getOrCreateUser(email: string, fullName?: string): Promise<Database['public']['Tables']['users']['Row']> {
  const { data: existingUser } = await (supabase as any)
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (existingUser) return existingUser as Database['public']['Tables']['users']['Row']

  const { data: newUser, error } = await (supabase as any)
    .from('users')
    .insert({ email, full_name: fullName })
    .select()
    .single()

  if (error) throw error
  return newUser as Database['public']['Tables']['users']['Row']
}

/**
 * Get count of waves sent by a user in the last 24 hours.
 */
export async function getDailySentCount(userId: string): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { count, error } = await (supabase as any)
    .from('waves')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', userId)
    .gte('created_at', twentyFourHoursAgo)

  if (error) throw error
  return count || 0
}

/**
 * Get count of waves received by an email in the last 24 hours.
 */
export async function getDailyReceivedCount(email: string): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { count, error } = await (supabase as any)
    .from('wave_recipients')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_email', email)
    .gte('created_at', twentyFourHoursAgo)

  if (error) throw error
  return count || 0
}

/**
 * Check if a sender has already sent the same template to a recipient in the last 24 hours.
 */
export async function checkDuplicateWave(senderId: string, recipientEmail: string, templateId: string): Promise<boolean> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { data, error } = await (supabase as any)
    .from('wave_recipients')
    .select('*, waves!inner(*)')
    .eq('recipient_email', recipientEmail)
    .eq('waves.sender_id', senderId)
    .eq('waves.template_id', templateId)
    .gte('created_at', twentyFourHoursAgo)
    .limit(1)

  if (error) throw error
  return data && data.length > 0
}
