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
