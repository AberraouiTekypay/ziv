import { supabase } from './supabase'
import { 
  Profile, 
  WaveTemplate, 
  Wave, 
  WaveRecipient, 
  ZivEvent 
} from './ziv-types'

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
 * Create a new wave entry.
 */
export async function createWave(wave: Partial<Wave>): Promise<Wave> {
  const { data, error } = await (supabase as any)
    .from('waves')
    .insert(wave)
    .select()
    .single()

  if (error) throw error
  return data as Wave
}

/**
 * Assign a wave to a recipient.
 */
export async function assignWaveRecipient(recipient: Partial<WaveRecipient>): Promise<WaveRecipient> {
  const { data, error } = await (supabase as any)
    .from('wave_recipients')
    .insert(recipient)
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
export async function logEvent(event: Partial<ZivEvent>): Promise<void> {
  const { error } = await (supabase as any)
    .from('events')
    .insert(event)

  if (error) throw error
}
