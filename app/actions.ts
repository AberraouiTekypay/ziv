'use server'

import { revalidatePath } from 'next/cache'
import { 
  getOrCreateDemoProfile, 
  createWave, 
  assignWaveRecipient, 
  logEvent,
  markWaveCompleted,
  getWaveRecipientWithWave,
  getDailySenderRecipientCount
} from '@/lib/wave-service'

const SENDER_DAILY_LIMIT = 3

/**
 * Initiates a new wave from a template and returns a shareable recipient link ID.
 */
export async function startWaveAction(
  templateId: string, 
  personalMessage: string,
  senderName?: string
) {
  try {
    const profile = await getOrCreateDemoProfile()
    
    // 1. Check sender's daily cap (max 3 recipients per sender per 24h)
    const sentCount = await getDailySenderRecipientCount(profile.id)
    if (sentCount >= SENDER_DAILY_LIMIT) {
      return { success: false, error: 'Let it breathe.' }
    }

    // 2. Create the wave
    const wave = await createWave(templateId, profile.id, personalMessage, senderName)
    
    // 3. Create ONE recipient with null contact (for link-based sharing)
    const recipient = await assignWaveRecipient(wave.id, profile.id, null)

    await logEvent(profile.id, wave.id, 'wave_started')
    
    return { success: true, waveId: wave.id, recipientId: recipient.id }
  } catch (error) {
    console.error('Error starting wave:', error)
    return { success: false, error: 'The connection flickered. Try again.' }
  }
}

/**
 * Marks a wave as completed by the recipient.
 */
export async function completeWaveAction(recipientId: string) {
  try {
    const profile = await getOrCreateDemoProfile()
    const recipient = await getWaveRecipientWithWave(recipientId)
    
    if (recipient.status === 'completed') {
      return { success: false, error: 'This wave is already calm.' }
    }

    await markWaveCompleted(recipientId)
    await logEvent(profile.id, recipient.wave_id, 'wave_completed')
    
    revalidatePath(`/wave/${recipientId}`)
    return { success: true }
  } catch (error) {
    console.error('Error completing wave:', error)
    return { success: false, error: 'Failed to complete wave' }
  }
}

/**
 * Forwards an existing wave template to a new shareable link.
 */
export async function passWaveForwardAction(
  originalRecipientId: string, 
  personalMessage: string,
  senderName?: string
) {
  try {
    const profile = await getOrCreateDemoProfile()
    const originalRecipient = await getWaveRecipientWithWave(originalRecipientId)
    const templateId = originalRecipient.waves.template_id

    // 1. Check sender's daily cap
    const sentCount = await getDailySenderRecipientCount(profile.id)
    if (sentCount >= SENDER_DAILY_LIMIT) {
      return { success: false, error: 'Let it breathe.' }
    }

    // 2. Create new wave (reusing template)
    const newWave = await createWave(templateId, profile.id, personalMessage, senderName)
    
    // 3. Create ONE new recipient for the shared link
    const newRecipient = await assignWaveRecipient(newWave.id, profile.id, null)

    await logEvent(profile.id, newWave.id, 'wave_forwarded', { 
      original_recipient_id: originalRecipientId 
    })
    
    revalidatePath(`/wave/${originalRecipientId}`)
    return { success: true, waveId: newWave.id, recipientId: newRecipient.id }
  } catch (error) {
    console.error('Error forwarding wave:', error)
    return { success: false, error: 'Failed to forward wave' }
  }
}
