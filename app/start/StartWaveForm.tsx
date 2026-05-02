'use client'

import { useState } from 'react'
import { startWaveAction } from '@/app/actions'
import { WaveTemplate } from '@/lib/ziv-types'
import ShareView from '@/components/ShareView'
import { logEvent } from '@/lib/wave-service'

interface Props {
  templates: WaveTemplate[]
}

const RECOMMENDED_TITLES = [
  'Call your parents',
  'Message someone you miss',
  'Thank someone who helped you'
]

export default function StartWaveForm({ templates }: Props) {
  const [step, setStep] = useState(1)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRecipientId, setNewRecipientId] = useState<string | null>(null)
  const [newWaveId, setNewWaveId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleNext = () => {
    if (selectedTemplateId) {
      setError(null)
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const senderName = localStorage.getItem('ziv_tester_name') || undefined
    const res = await startWaveAction(selectedTemplateId, message, senderName)
    
    if (res.success) {
      setNewRecipientId(res.recipientId || null)
      setNewWaveId(res.waveId || null)
      setStep(3)
      await logEvent(null, res.waveId || null, 'wave_share_opened')
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
    const recommended = templates.filter(t => RECOMMENDED_TITLES.includes(t.title))
    const others = templates.filter(t => !RECOMMENDED_TITLES.includes(t.title))

    const renderTemplateButton = (t: WaveTemplate) => (
      <button
        key={t.id}
        onClick={() => setSelectedTemplateId(t.id)}
        className={`w-full p-6 text-left rounded-3xl border-2 transition-all duration-300 ${
          selectedTemplateId === t.id 
            ? 'border-[#004D40] bg-[#F0F7F6] ring-4 ring-[#004D40]/5' 
            : 'border-gray-50 bg-white hover:border-gray-200'
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#004D40] opacity-40 mb-2 block">
          {t.category}
        </span>
        <h3 className="text-lg font-bold text-[#1A1A1A] leading-snug">{t.title}</h3>
      </button>
    )

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 space-y-10 overflow-y-auto pr-2 -mr-2">
          {recommended.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Recommended</h2>
              <div className="space-y-3">
                {recommended.map(renderTemplateButton)}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">All Templates</h2>
              <div className="space-y-3">
                {others.map(renderTemplateButton)}
              </div>
            </section>
          )}
        </div>
        
        <div className="pt-8 mt-auto">
          <button
            onClick={handleNext}
            disabled={!selectedTemplateId}
            className="w-full bg-[#004D40] text-white py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-[#004D40]/20"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-8 animate-fade-in">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block px-1">
            Personal Message (Optional)
          </label>
          <textarea
            placeholder="Add a soft touch..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#004D40] outline-none transition-all h-48 resize-none text-lg"
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
            disabled={isSubmitting}
            className="w-full bg-[#004D40] text-white py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-[#004D40]/20"
          >
            {isSubmitting ? 'Starting...' : 'Create the Wave'}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full py-4 text-gray-400 font-bold hover:text-[#1A1A1A] transition-colors text-sm"
          >
            Back to Templates
          </button>
        </div>
      </form>
    )
  }

  if (step === 3 && newRecipientId && newWaveId) {
    return <ShareView recipientId={newRecipientId} waveId={newWaveId} />
  }

  return null
}
