'use client'

import { useState, useEffect } from 'react'
import { completeWaveAction, passWaveForwardAction } from '@/app/actions'
import { supabase } from '@/lib/supabase'
import ShareView from '@/components/ShareView'
import { logEvent } from '@/lib/wave-service'

interface Props {
  recipient: any
}

export default function WaveInteraction({ recipient }: Props) {
  const [step, setStep] = useState(recipient.status === 'completed' ? 2 : 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isForwarding, setIsForwarding] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [newRecipientId, setNewRecipientId] = useState<string | null>(null)
  const [newWaveId, setNewWaveId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const template = recipient.waves?.wave_templates
  const wave = recipient.waves

  useEffect(() => {
    // Mark as opened on mount if pending
    const markOpened = async () => {
      if (recipient.status === 'pending') {
        const { error } = await (supabase as any)
          .from('wave_recipients')
          .update({ 
            status: 'opened',
            opened_at: new Date().toISOString()
          })
          .eq('id', recipient.id)
        
        if (!error) {
          await logEvent(null, recipient.wave_id, 'wave_opened')
        }
      }
    }
    markOpened()
  }, [recipient.id, recipient.status, recipient.wave_id])

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError(null)
    const res = await completeWaveAction(recipient.id)
    if (res.success) {
      setStep(2)
    } else {
      setError(res.error || 'Failed to complete wave.')
    }
    setIsSubmitting(false)
  }

  const handleForward = async () => {
    setIsForwarding(true)
    setError(null)
    
    const senderName = localStorage.getItem('ziv_tester_name') || undefined
    const res = await passWaveForwardAction(recipient.id, '', senderName)
    
    if (res.success) {
      setNewRecipientId(res.recipientId || null)
      setNewWaveId(res.waveId || null)
      setShowShare(true)
      await logEvent(null, res.waveId || null, 'wave_share_opened')
    } else {
      setError(res.error || 'Failed to generate link.')
    }
    setIsForwarding(false)
  }

  if (showShare && newRecipientId && newWaveId) {
    return (
      <div className="max-w-md w-full min-h-screen sm:min-h-0 bg-[#FFFDFB] sm:rounded-[2.5rem] shadow-none sm:shadow-2xl border-none sm:border border-gray-100 flex flex-col overflow-hidden animate-zoom-in">
        <div className="p-10 flex-1 flex flex-col">
          <ShareView recipientId={newRecipientId} waveId={newWaveId} />
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="max-w-md w-full min-h-screen sm:min-h-0 bg-[#FFFDFB] sm:rounded-[2.5rem] shadow-none sm:shadow-2xl border-none sm:border border-gray-100 flex flex-col overflow-hidden animate-zoom-in">
        <div className="p-10 flex-1 flex flex-col items-center justify-center text-center space-y-12">
          <div className="space-y-4">
            <span className="text-sm font-bold uppercase tracking-widest text-[#004D40] opacity-40">
              {wave?.sender_name ? `${wave.sender_name} sent you this.` : 'Someone thought of you.'}
            </span>
            <h1 className="text-4xl font-black text-[#1A1A1A] leading-tight">
              {template?.title}
            </h1>
          </div>

          {wave?.personal_message && (
            <div className="bg-gray-50 p-8 rounded-3xl italic text-gray-600 font-serif leading-relaxed text-lg border border-gray-100">
              "{wave.personal_message}"
            </div>
          )}

          <div className="w-full space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}
            <button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="w-full bg-[#004D40] text-white py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 shadow-xl shadow-[#004D40]/20 disabled:opacity-50"
            >
              {isSubmitting ? '...' : 'I did it'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="max-w-md w-full min-h-screen sm:min-h-0 bg-[#FFFDFB] sm:rounded-[2.5rem] shadow-none sm:shadow-2xl border-none sm:border border-gray-100 flex flex-col overflow-hidden animate-slide-up">
        <div className={`p-10 flex-1 flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="text-6xl animate-bounce">✨</div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-[#1A1A1A]">That mattered.</h2>
              <p className="text-xl text-gray-500 font-light">
                You made the day a little softer.
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}
            <button
              onClick={handleForward}
              disabled={isForwarding}
              className="w-full bg-[#1A1A1A] text-white py-6 rounded-[2rem] font-bold text-lg transition-all active:scale-95 shadow-xl shadow-black/10"
            >
              {isForwarding ? 'Preparing...' : 'Pass it forward'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-2 text-gray-400 font-bold hover:text-[#1A1A1A] transition-colors text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
