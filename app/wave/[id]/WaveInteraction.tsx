'use client'

import { useState, useEffect } from 'react'
import { completeWaveAction, passWaveForwardAction } from '@/app/actions'
import { supabase } from '@/lib/supabase'

interface Props {
  recipient: any
}

export default function WaveInteraction({ recipient }: Props) {
  const [step, setStep] = useState(recipient.status === 'completed' ? 2 : 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contacts, setContacts] = useState(['', '', ''])
  const [message, setMessage] = useState('')
  const [isForwarding, setIsForwarding] = useState(false)
  const [showForm, setShowForm] = useState(false)
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
          await (supabase as any).from('events').insert({
            wave_id: recipient.wave_id,
            event_name: 'wave_opened'
          })
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

  const handleForward = async (e: React.FormEvent) => {
    e.preventDefault()
    const validContacts = contacts.map(c => c.trim()).filter(c => c !== '')
    if (validContacts.length === 0) {
      setError('Choose someone to reach.')
      return
    }

    setIsForwarding(true)
    setError(null)
    const res = await passWaveForwardAction(recipient.id, validContacts, message)
    if (res.success) {
      setStep(3)
    } else {
      setError(res.error || 'Failed to forward wave.')
    }
    setIsForwarding(false)
  }

  if (step === 1) {
    return (
      <div className="max-w-md w-full min-h-screen sm:min-h-0 bg-[#FFFDFB] sm:rounded-[2.5rem] shadow-none sm:shadow-2xl border-none sm:border border-gray-100 flex flex-col overflow-hidden animate-zoom-in">
        <div className="p-10 flex-1 flex flex-col items-center justify-center text-center space-y-12">
          <div className="space-y-4">
            <span className="text-sm font-bold uppercase tracking-widest text-[#004D40] opacity-40">
              Someone thought of you.
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
        <div className={`p-10 flex-1 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden transition-all duration-1000`}>
          {/* Soft Gold Glow */}
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

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="relative z-10 w-full bg-[#1A1A1A] text-white py-6 rounded-[2rem] font-bold text-lg transition-all active:scale-95 shadow-xl shadow-black/10"
            >
              Pass it forward
            </button>
          ) : (
            <form onSubmit={handleForward} className="relative z-10 w-full space-y-6 text-left animate-fade-in">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Pass the wave to (1-3)
                </label>
                {contacts.map((contact, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Friend ${i + 1}`}
                    value={contact}
                    onChange={(e) => {
                      const newC = [...contacts]
                      newC[i] = e.target.value
                      setContacts(newC)
                    }}
                    className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#004D40] transition-all"
                  />
                ))}
              </div>
              <textarea
                placeholder="Add your own touch..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#004D40] transition-all h-24 resize-none"
              />
              <div className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-fade-in text-center">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isForwarding || contacts.every(c => !c.trim())}
                  className="w-full bg-[#004D40] text-white py-5 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-[#004D40]/20"
                >
                  {isForwarding ? 'Sending...' : 'Send Wave'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full py-2 text-gray-400 font-bold hover:text-[#1A1A1A] transition-colors text-center text-sm"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="max-w-md w-full min-h-screen sm:min-h-0 bg-[#FFFDFB] sm:rounded-[2.5rem] shadow-none sm:shadow-2xl border-none sm:border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
        <div className="p-10 flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <div className="text-6xl animate-pulse">🕊️</div>
          <h2 className="text-3xl font-black text-[#1A1A1A]">The wave is moving.</h2>
          <p className="text-gray-500 font-light max-w-[200px]">
            Thank you for being part of the flow.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-bold transition-transform active:scale-95 shadow-lg shadow-black/10"
          >
            Back home
          </button>
        </div>
      </div>
    )
  }

  return null
}
