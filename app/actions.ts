'use server'

import { revalidatePath } from 'next/cache'
import { 
  getOrCreateDemoProfile, 
  createWave, 
  assignWaveRecipient, 
  logEvent,
  markWaveCompleted,
  getWaveRecipientWithWave
} from '@/lib/wave-service'

export async function startWaveAction(
  templateId: string, 
  contacts: string[], 
  personalMessage: string
) {
  try {
    const profile = await getOrCreateDemoProfile()
    const wave = await createWave(templateId, profile.id, personalMessage)
    
    for (const contact of contacts) {
      if (contact.trim()) {
        await assignWaveRecipient(wave.id, profile.id, contact.trim())
      }
    }

    await logEvent(profile.id, wave.id, 'wave_started')
    
    return { success: true, waveId: wave.id }
  } catch (error) {
    console.error('Error starting wave:', error)
    return { success: false, error: 'Failed to start wave' }
  }
}

export async function completeWaveAction(recipientId: string) {
  try {
    const profile = await getOrCreateDemoProfile()
    const recipient = await getWaveRecipientWithWave(recipientId)
    
    await markWaveCompleted(recipientId)
    await logEvent(profile.id, recipient.wave_id, 'wave_completed')
    
    revalidatePath(`/wave/${recipientId}`)
    return { success: true }
  } catch (error) {
    console.error('Error completing wave:', error)
    return { success: false, error: 'Failed to complete wave' }
  }
}

export async function passWaveForwardAction(
  originalRecipientId: string, 
  contacts: string[], 
  personalMessage: string
) {
  try {
    const profile = await getOrCreateDemoProfile()
    const originalRecipient = await getWaveRecipientWithWave(originalRecipientId)
    const templateId = originalRecipient.waves.template_id

    const newWave = await createWave(templateId, profile.id, personalMessage)
    
    for (const contact of contacts) {
      if (contact.trim()) {
        await assignWaveRecipient(newWave.id, profile.id, contact.trim())
      }
    }

    await logEvent(profile.id, newWave.id, 'wave_forwarded', { 
      original_recipient_id: originalRecipientId 
    })
    
    revalidatePath(`/wave/${originalRecipientId}`)
    return { success: true, waveId: newWave.id }
  } catch (error) {
    console.error('Error forwarding wave:', error)
    return { success: false, error: 'Failed to forward wave' }
  }
}
