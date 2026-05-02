'use server'

import { revalidatePath } from 'next/cache'
import { 
  getOrCreateDemoProfile, 
  createWave, 
  assignWaveRecipient, 
  logEvent,
  markWaveCompleted,
  getWaveRecipientWithWave,
  getDailySenderRecipientCount,
  getDailyReceiverActiveCount,
  hasDuplicateRecentWave
} from '@/lib/wave-service'

const SENDER_DAILY_LIMIT = 3
const RECEIVER_DAILY_LIMIT = 3

export async function startWaveAction(
  templateId: string, 
  contacts: string[], 
  personalMessage: string
) {
  try {
    const profile = await getOrCreateDemoProfile()
    
    // 1. Check sender's daily cap
    const sentCount = await getDailySenderRecipientCount(profile.id)
    const newCount = contacts.filter(c => c.trim()).length
    if (sentCount + newCount > SENDER_DAILY_LIMIT) {
      return { success: false, error: 'Let it breathe.' }
    }

    // 2. Validate and filter contacts
    const validContacts = contacts.map(c => c.trim()).filter(c => c !== '')
    if (validContacts.length === 0) return { success: false, error: 'Choose someone to reach.' }
    if (validContacts.length > 3) return { success: false, error: 'One small ripple at a time (max 3).' }

    // 3. Check for duplicates and receiver caps
    for (const contact of validContacts) {
      const isDuplicate = await hasDuplicateRecentWave(profile.id, contact)
      if (isDuplicate) {
        return { success: false, error: `You already sent a wave to ${contact} today.` }
      }

      const receivedCount = await getDailyReceiverActiveCount(contact)
      if (receivedCount >= RECEIVER_DAILY_LIMIT) {
        return { success: false, error: `${contact} already has enough waves today.` }
      }
    }

    // 4. Create wave
    const wave = await createWave(templateId, profile.id, personalMessage)
    const recipientIds: string[] = []

    for (const contact of validContacts) {
      const recipient = await assignWaveRecipient(wave.id, profile.id, contact)
      recipientIds.push(recipient.id)
    }

    await logEvent(profile.id, wave.id, 'wave_started')

    return { success: true, waveId: wave.id, recipientIds }

  } catch (error) {
    console.error('Error starting wave:', error)
    return { success: false, error: 'The connection flickered. Try again.' }
  }
}

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

export async function passWaveForwardAction(
  originalRecipientId: string, 
  contacts: string[], 
  personalMessage: string
) {
  try {
    const profile = await getOrCreateDemoProfile()
    const originalRecipient = await getWaveRecipientWithWave(originalRecipientId)
    const templateId = originalRecipient.waves.template_id

    // 1. Check sender's daily cap
    const sentCount = await getDailySenderRecipientCount(profile.id)
    const newCount = contacts.filter(c => c.trim()).length
    if (sentCount + newCount > SENDER_DAILY_LIMIT) {
      return { success: false, error: 'Let it breathe.' }
    }

    // 2. Validate and filter contacts
    const validContacts = contacts.map(c => c.trim()).filter(c => c !== '')
    if (validContacts.length === 0) return { success: false, error: 'Choose someone to reach.' }
    if (validContacts.length > 3) return { success: false, error: 'One small ripple at a time (max 3).' }

    // 3. Check for duplicates and receiver caps
    for (const contact of validContacts) {
      const isDuplicate = await hasDuplicateRecentWave(profile.id, contact)
      if (isDuplicate) {
        return { success: false, error: `You already sent a wave to ${contact} today.` }
      }

      const receivedCount = await getDailyReceiverActiveCount(contact)
      if (receivedCount >= RECEIVER_DAILY_LIMIT) {
        return { success: false, error: `${contact} already has enough waves today.` }
      }
    }

    // 4. Create new wave
    const newWave = await createWave(templateId, profile.id, personalMessage)
    
    for (const contact of validContacts) {
      await assignWaveRecipient(newWave.id, profile.id, contact)
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
