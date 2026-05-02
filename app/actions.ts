'use server'

import { revalidatePath } from 'next/cache'
import { 
  updateRecipientStatus, 
  getWaveRecipientDetails, 
  createWave, 
  addWaveRecipients,
  getOrCreateUser
} from '@/lib/db'

export async function completeWaveAction(recipientId: string) {
  try {
    await updateRecipientStatus(recipientId, 'sent')
    revalidatePath(`/wave/${recipientId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to complete wave:', error)
    return { success: false, error: 'Failed to complete wave' }
  }
}

export async function passWaveAction(recipientId: string, recipientEmails: string[]) {
  try {
    // 1. Get original wave details
    const recipient = await getWaveRecipientDetails(recipientId) as any
    if (!recipient || !recipient.waves) throw new Error('Wave not found')

    const templateId = recipient.waves.template_id
    if (!templateId) throw new Error('Template not found')

    // 2. Identify the sender (using the recipient's email as the new sender)
    // In a real app, this would be the authenticated user.
    const sender = await getOrCreateUser(recipient.recipient_email) as any

    // 3. Create a new wave from this sender
    const newWave = await createWave({
      sender_id: sender.id,
      template_id: templateId,
      status: 'sent'
    }) as any

    // 4. Add new recipients to the new wave
    const recipientsToInsert = recipientEmails
      .filter(email => email.trim() !== '')
      .map(email => ({
        wave_id: newWave.id,
        recipient_email: email.trim(),
        status: 'pending' as const
      }))

    if (recipientsToInsert.length > 0) {
      await addWaveRecipients(recipientsToInsert)
    }

    // 5. Mark the original recipient as 'passed' (we'll use 'sent' status)
    await updateRecipientStatus(recipientId, 'sent')

    revalidatePath(`/wave/${recipientId}`)
    return { success: true, newWaveId: newWave.id }
  } catch (error) {
    console.error('Failed to pass wave:', error)
    return { success: false, error: 'Failed to pass wave' }
  }
}
