'use server'

import { revalidatePath } from 'next/cache'
import { 
  updateRecipientStatus, 
  getWaveRecipientDetails, 
  createWave, 
  addWaveRecipients,
  getOrCreateUser,
  getDailySentCount,
  getDailyReceivedCount,
  checkDuplicateWave
} from '@/lib/db'
import { sendWaveNotification } from '@/lib/notifications'

const DAILY_SEND_LIMIT = 5
const DAILY_RECEIVE_LIMIT = 10

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

    // 2. Identify the sender
    const sender = await getOrCreateUser(recipient.recipient_email) as any

    // 3. CHECK DAILY SEND LIMIT
    const sentToday = await getDailySentCount(sender.id)
    if (sentToday >= DAILY_SEND_LIMIT) {
      return { success: false, error: `Daily send limit reached (${DAILY_SEND_LIMIT}).` }
    }

    // 4. Filter recipients by anti-spam and daily receive limit
    const validRecipients: string[] = []
    const errors: string[] = []

    for (const email of recipientEmails) {
      const trimmedEmail = email.trim()
      if (!trimmedEmail) continue

      // Anti-spam: No duplicates to same person
      const isDuplicate = await checkDuplicateWave(sender.id, trimmedEmail, templateId)
      if (isDuplicate) {
        errors.push(`${trimmedEmail} already received this template from you today.`)
        continue
      }

      // Daily receive limit
      const receivedToday = await getDailyReceivedCount(trimmedEmail)
      if (receivedToday >= DAILY_RECEIVE_LIMIT) {
        errors.push(`${trimmedEmail} has reached their daily limit.`)
        continue
      }

      validRecipients.push(trimmedEmail)
    }

    if (validRecipients.length === 0) {
      return { 
        success: false, 
        error: errors.length > 0 ? errors[0] : 'Please provide valid recipient emails.' 
      }
    }

    // 5. Create a new wave from this sender
    const newWave = await createWave({
      sender_id: sender.id,
      template_id: templateId,
      status: 'sent'
    }) as any

    // 6. Add new recipients to the new wave
    const recipientsToInsert = validRecipients.map(email => ({
      wave_id: newWave.id,
      recipient_email: email,
      status: 'pending' as const
    }))

    const insertedRecipients = await addWaveRecipients(recipientsToInsert) as any[]

    // 7. Send Notifications (Mock)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    for (const rec of insertedRecipients) {
      await sendWaveNotification(rec.recipient_email, sender.email, `${baseUrl}/wave/${rec.id}`)
    }

    // 8. Mark the original recipient as 'passed'
    await updateRecipientStatus(recipientId, 'sent')

    revalidatePath(`/wave/${recipientId}`)
    return { success: true, newWaveId: newWave.id }
  } catch (error) {
    console.error('Failed to pass wave:', error)
    return { success: false, error: 'Failed to pass wave' }
  }
}
