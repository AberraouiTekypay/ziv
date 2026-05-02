import { supabase } from './supabase'

/**
 * Count total waves created.
 */
export async function getTotalWavesCount(): Promise<number> {
  const { count, error } = await (supabase as any)
    .from('waves')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count || 0
}

/**
 * Count total completed wave recipients.
 */
export async function getCompletedRecipientsCount(): Promise<number> {
  const { count, error } = await (supabase as any)
    .from('wave_recipients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')

  if (error) throw error
  return count || 0
}

/**
 * Calculate completion rate (completed / total assigned).
 */
export async function getCompletionRate(): Promise<number> {
  const { count: total, error: err1 } = await (supabase as any)
    .from('wave_recipients')
    .select('*', { count: 'exact', head: true })

  if (err1) throw err1
  if (!total) return 0

  const { count: completed, error: err2 } = await (supabase as any)
    .from('wave_recipients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')

  if (err2) throw err2
  
  return (completed || 0) / total
}

/**
 * Calculate forward rate (number of waves created from pass-forward / total waves).
 * This is a simplified metric for Sprint 1.
 */
export async function getForwardRate(): Promise<number> {
  const { count: total, error: err1 } = await (supabase as any)
    .from('waves')
    .select('*', { count: 'exact', head: true })

  if (err1) throw err1
  if (!total) return 0

  const { count: forwarded, error: err2 } = await (supabase as any)
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_name', 'wave_forwarded')

  if (err2) throw err2
  
  return (forwarded || 0) / total
}
