/**
 * Mock email notification system.
 * Logs the notification to the console.
 */
export async function sendWaveNotification(recipientEmail: string, senderEmail: string, waveUrl: string) {
  console.log(`
    --------------------------------------------------
    📧 MOCK EMAIL NOTIFICATION
    To: ${recipientEmail}
    From: Ziv <waves@ziv.app>
    Subject: 🌊 Someone sent you a Wave!

    Hello,
    
    ${senderEmail} has sent you a Wave.
    You can view it and keep the flow going here:
    ${waveUrl}

    Best,
    The Ziv Team
    --------------------------------------------------
  `)
  
  // In a real implementation, you would use a service like Resend, Postmark, or SendGrid.
  return { success: true }
}
