import { supabase } from './supabase'
import { 
  Profile, 
  WaveTemplate, 
  Wave, 
  WaveRecipient, 
  ZivEvent 
} from './ziv-types'

/**
 * Get or create a demo profile for the current user.
 * In a real app, this would be handled by Supabase Auth.
 */
export async function getOrCreateDemoProfile(): Promise<Profile> {
  const demoEmail = 'demo@em300.co'
  const demoId = '00000000-0000-0000-0000-000000000000'

  const { data: existing } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', demoId)
    .maybeSingle()

  if (existing) return existing as Profile

  const { data: created, error } = await (supabase as any)
    .from('profiles')
    .insert({
      id: demoId,
      email: demoEmail,
      display_name: 'Ziv Demo User'
    })
    .select()
    .single()

  if (error) throw error
  return created as Profile
}

/**
 * Fetch all active wave templates.
 */
export async function getActiveTemplates(): Promise<WaveTemplate[]> {
  const { data, error } = await (supabase as any)
    .from('wave_templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as WaveTemplate[]
}

/**
 * Fetch a specific wave template by ID.
 */
export async function getTemplateById(id: string): Promise<WaveTemplate> {
  const { data, error } = await (supabase as any)
    .from('wave_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as WaveTemplate
}

/**
 * Fetch a wave recipient with its related wave and template.
 */
export async function getWaveRecipientWithWave(id: string): Promise<any> {
  const { data, error } = await (supabase as any)
    .from('wave_recipients')
    .select(`
      *,
      waves (
        *,
        wave_templates (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new wave entry.
 */
export async function createWave(
  templateId: string, 
  creatorId: string, 
  personalMessage?: string
): Promise<Wave> {
  const { data, error } = await (supabase as any)
    .from('waves')
    .insert({
      template_id: templateId,
      creator_id: creatorId,
      personal_message: personalMessage
    })
    .select()
    .single()

  if (error) throw error
  return data as Wave
}

/**
 * Assign a wave to a recipient.
 */
export async function assignWaveRecipient(
  waveId: string, 
  senderId: string, 
  receiverContact: string
): Promise<WaveRecipient> {
  const { data, error } = await (supabase as any)
    .from('wave_recipients')
    .insert({
      wave_id: waveId,
      sender_id: senderId,
      receiver_contact: receiverContact,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data as WaveRecipient
}

/**
 * Mark a wave as opened by the recipient.
 */
export async function markWaveOpened(recipientId: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('wave_recipients')
    .update({ 
      status: 'opened',
      opened_at: new Date().toISOString()
    })
    .eq('id', recipientId)
    .eq('status', 'pending') // Only mark as opened if it was pending

  if (error) throw error
}

/**
 * Mark a wave as completed by the recipient.
 */
export async function markWaveCompleted(recipientId: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('wave_recipients')
    .update({ 
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', recipientId)

  if (error) throw error
}

/**
 * Log a system or user event.
 */
export async function logEvent(
  userId: string | null, 
  waveId: string | null, 
  eventName: string, 
  metadata: Record<string, any> = {}
): Promise<void> {
  const { error } = await (supabase as any)
    .from('events')
    .insert({
      user_id: userId,
      wave_id: waveId,
      event_name: eventName,
      metadata: metadata
    })

  if (error) throw error
}

/**
 * Get the number of wave recipients created by a sender in the last 24 hours.
 */
export async function getDailySenderRecipientCount(senderId: string): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { count, error } = await (supabase as any)
    .from('wave_recipients')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', senderId)
    .gte('created_at', twentyFourHoursAgo)

  if (error) throw error
  return count || 0
}

/**
 * Get the number of pending or opened waves for a receiver contact in the last 24 hours.
 */
export async function getDailyReceiverActiveCount(receiverContact: string): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { count, error } = await (supabase as any)
    .from('wave_recipients')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_contact', receiverContact.trim().toLowerCase())
    .in('status', ['pending', 'opened'])
    .gte('created_at', twentyFourHoursAgo)

  if (error) throw error
  return count || 0
}

/**
 * Check if a sender has already sent a wave to the same contact in the last 24 hours.
 */
export async function hasDuplicateRecentWave(senderId: string, receiverContact: string): Promise<boolean> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { data, error } = await (supabase as any)
    .from('wave_recipients')
    .select('id')
    .eq('sender_id', senderId)
    .eq('receiver_contact', receiverContact.trim().toLowerCase())
    .gte('created_at', twentyFourHoursAgo)
    .limit(1)

  if (error) throw error
  return data && data.length > 0
}
