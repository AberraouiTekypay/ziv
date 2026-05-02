'use client'

import { useState } from 'react'
import { logEvent } from '@/lib/wave-service'

interface Props {
  recipientId: string
  waveId: string
}

export default function ShareView({ recipientId, waveId }: Props) {
  const [copied, setCopied] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const link = `${baseUrl}/wave/${recipientId}`

  const handleWhatsApp = async () => {
    const message = encodeURIComponent(
      `I just did something small that actually felt good. Passing it to you:\n\n${link}`
    )
    const url = `https://wa.me/?text=${message}`
    window.open(url, '_blank')
    await logEvent(null, waveId, 'wave_shared_whatsapp', { recipient_id: recipientId })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      await logEvent(null, waveId, 'wave_shared_copy', { recipient_id: recipientId })
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 animate-fade-in py-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-[#1A1A1A]">Send this to someone who matters.</h2>
        <p className="text-gray-400 font-light italic">Keep it simple.</p>
      </div>

      <div className="w-full space-y-4 max-w-sm">
        <button
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 shadow-xl shadow-[#25D366]/20 flex items-center justify-center gap-3"
        >
          <span>Share on WhatsApp</span>
        </button>

        <button
          onClick={handleCopy}
          className="w-full bg-white text-[#1A1A1A] py-6 rounded-[2rem] font-bold text-lg transition-all active:scale-95 border-2 border-gray-100 shadow-lg shadow-black/5"
        >
          {copied ? 'Link copied.' : 'Copy link'}
        </button>
      </div>

      <button
        onClick={() => window.location.href = '/'}
        className="text-gray-300 font-bold hover:text-[#1A1A1A] transition-colors text-sm"
      >
        Back home
      </button>
    </div>
  )
}
