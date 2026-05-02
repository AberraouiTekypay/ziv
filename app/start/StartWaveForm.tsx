'use client'

import { useState } from 'react'
import { startWaveAction } from '@/app/actions'
import { WaveTemplate } from '@/lib/ziv-types'

interface Props {
  templates: WaveTemplate[]
}

export default function StartWaveForm({ templates }: Props) {
  const [step, setStep] = useState(1)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [contacts, setContacts] = useState(['', '', ''])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = () => {
    if (selectedTemplateId) {
      setError(null)
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validContacts = contacts.map(c => c.trim()).filter(c => c !== '')
    
    if (validContacts.length === 0) {
      setError('Choose someone to reach.')
      return
    }

    if (validContacts.length > 3) {
      setError('One small ripple at a time (max 3).')
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    const senderName = localStorage.getItem('ziv_tester_name') || undefined
    const res = await startWaveAction(selectedTemplateId, validContacts, message, senderName)
    
    if (res.success) {
      setStep(3)
    } else {
      setError(res.error || 'The connection flickered. Try again.')
    }
    setIsSubmitting(false)
  }

  if (templates.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-4">
        <p className="text-gray-400">The ocean is still today. No templates found.</p>
        <button onClick={() => window.location.reload()} className="text-[#004D40] font-bold hover:underline">Refresh</button>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[60vh] pr-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplateId(t.id)}
              className={`w-full p-6 text-left rounded-2xl border-2 transition-all ${
                selectedTemplateId === t.id 
                  ? 'border-[#004D40] bg-[#F0F7F6]' 
                  : 'border-gray-50 bg-white hover:border-gray-200'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#004D40] opacity-50 mb-1 block">
                {t.category}
              </span>
              <h3 className="text-lg font-bold text-[#1A1A1A]">{t.title}</h3>
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={!selectedTemplateId}
          className="mt-8 w-full bg-[#004D40] text-white py-5 rounded-2xl font-bold transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-[#004D40]/20"
        >
          Next
        </button>
      </div>
    )
  }

  if (step === 2) {
    return (
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 animate-fade-in">
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-gray-400 block">
            Who should feel this? (1-3)
          </label>
          {contacts.map((contact, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Contact ${i + 1} (email or name)`}
              value={contact}
              onChange={(e) => {
                const newC = [...contacts]
                newC[i] = e.target.value
                setContacts(newC)
              }}
              className="w-full p-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#004D40] outline-none transition-all"
            />
          ))}
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-gray-400 block">
            Personal Message (Optional)
          </label>
          <textarea
            placeholder="Add a soft touch..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#004D40] outline-none transition-all h-32 resize-none"
          />
        </div>

        <div className="mt-auto pt-8 flex flex-col gap-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm text-center font-medium animate-fade-in">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || contacts.every(c => !c.trim())}
            className="w-full bg-[#004D40] text-white py-5 rounded-2xl font-bold transition-transform active:scale-95 disabled:opacity-50 shadow-xl shadow-[#004D40]/20"
          >
            {isSubmitting ? 'Starting...' : 'Start the Wave'}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full py-4 text-gray-400 font-bold hover:text-[#1A1A1A] transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    )
  }

  if (step === 3) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 animate-zoom-in">
        <div className="text-6xl mb-6">🌊</div>
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-4">Your wave has started.</h2>
        <p className="text-gray-500 font-light mb-10 max-w-xs">
          It's moving out into the world now.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-bold transition-transform active:scale-95 shadow-lg shadow-black/10"
        >
          Back home
        </button>
      </div>
    )
  }

  return null
}
