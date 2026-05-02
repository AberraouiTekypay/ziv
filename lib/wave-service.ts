import { supabase, isSupabaseConfigured } from './supabase'
import { 
  Profile, 
  WaveTemplate, 
  Wave, 
  WaveRecipient, 
  ZivEvent 
} from './ziv-types'

const FALLBACK_TEMPLATES: WaveTemplate[] = [
  { id: '11111111-1111-1111-1111-111111111111', category: 'Family', title: 'Call your parents', action_text: 'I just called my parents', is_active: true, created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-222222222222', category: 'Friendship', title: 'Message someone you miss', action_text: 'I sent a message to someone I miss', is_active: true, created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333333', category: 'Gratitude', title: 'Thank someone who helped you', action_text: 'I thanked someone who helped me', is_active: true, created_at: new Date().toISOString() },
  { id: '44444444-4444-4444-4444-444444444444', category: 'Connection', title: 'Check on an old friend', action_text: 'I checked on an old friend', is_active: true, created_at: new Date().toISOString() },
  { id: '55555555-5555-5555-5555-555555555555', category: 'Family', title: 'Compliment your mother', action_text: 'I complimented my mother', is_active: true, created_at: new Date().toISOString() },
  { id: '66666666-6666-6666-6666-666666666666', category: 'Kindness', title: 'Smile and greet someone warmly today', action_text: 'I smiled and greeted someone warmly', is_active: true, created_at: new Date().toISOString() },
  { id: '77777777-7777-7777-7777-777777777777', category: 'Environment', title: 'Pick up three pieces of trash', action_text: 'I picked up three pieces of trash', is_active: true, created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888888', category: 'Gratitude', title: 'Send one honest thank-you message', action_text: 'I sent a thank-you message', is_active: true, created_at: new Date().toISOString() },
  { id: '99999999-9999-9999-9999-999999999999', category: 'Mindfulness', title: 'Share a meal without your phone', action_text: 'I shared a meal without my phone', is_active: true, created_at: new Date().toISOString() },
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', category: 'Appreciation', title: 'Tell someone you appreciate them', action_text: 'I told someone I appreciate them', is_active: true, created_at: new Date().toISOString() }
]

/**
 * Get or create a demo profile for the current user.
 */
export async function getOrCreateDemoProfile(): Promise<Profile> {
  const demoEmail = 'demo@em300.co'
  const demoId = '00000000-0000-0000-0000-000000000000'

  if (!isSupabaseConfigured) {
    return { id: demoId, email: demoEmail, display_name: 'Offline Tester', created_at: new Date().toISOString() }
  }

  try {
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
  } catch (e) {
    console.error('getOrCreateDemoProfile error:', e)
    return { id: demoId, email: demoEmail, display_name: 'Offline Tester', created_at: new Date().toISOString() }
  }
}

/**
 * Fetch all active wave templates.
 * Returns local fallback if Supabase is disconnected or empty.
 */
export async function getActiveTemplates(): Promise<WaveTemplate[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_TEMPLATES
  }

  try {
    const { data, error } = await (supabase as any)
      .from('wave_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      console.warn('getActiveTemplates: Falling back to local templates.', error)
      return FALLBACK_TEMPLATES
    }
    return data as WaveTemplate[]
  } catch (e) {
    console.error('getActiveTemplates error:', e)
    return FALLBACK_TEMPLATES
  }
}

/**
 * Fetch a specific wave template by ID.
 */
export async function getTemplateById(id: string): Promise<WaveTemplate> {
  if (!isSupabaseConfigured) {
    return FALLBACK_TEMPLATES.find(t => t.id === id) || FALLBACK_TEMPLATES[0]
  }

  try {
    const { data, error } = await (supabase as any)
      .from('wave_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as WaveTemplate
  } catch (e) {
    console.error('getTemplateById error:', e)
    return FALLBACK_TEMPLATES.find(t => t.id === id) || FALLBACK_TEMPLATES[0]
  }
}

/**
 * Fetch a wave recipient with its related wave and template.
 */
export async function getWaveRecipientWithWave(id: string): Promise<any> {
  if (!isSupabaseConfigured) throw new Error('Supabase not connected.')

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
  personalMessage?: string,
  senderName?: string
): Promise<Wave> {
  if (!isSupabaseConfigured) throw new Error('Supabase not connected. Action blocked.')

  const { data, error } = await (supabase as any)
    .from('waves')
    .insert({
      template_id: templateId,
      creator_id: creatorId,
      personal_message: personalMessage,
      sender_name: senderName
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
  if (!isSupabaseConfigured) throw new Error('Supabase not connected. Action blocked.')

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
  if (!isSupabaseConfigured) return

  const { error } = await (supabase as any)
    .from('wave_recipients')
    .update({ 
      status: 'opened',
      opened_at: new Date().toISOString()
    })
    .eq('id', recipientId)
    .eq('status', 'pending') 

  if (error) throw error
}

/**
 * Mark a wave as completed by the recipient.
 */
export async function markWaveCompleted(recipientId: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase not connected.')

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
  if (!isSupabaseConfigured) return

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
  if (!isSupabaseConfigured) return 0
  
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
  if (!isSupabaseConfigured) return 0
  
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
  if (!isSupabaseConfigured) return false
  
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
