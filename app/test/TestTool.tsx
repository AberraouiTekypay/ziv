'use client'

import { useState } from 'react'
import { startWaveAction } from '@/app/actions'
import { WaveTemplate } from '@/lib/ziv-types'

interface Props {
  templates: WaveTemplate[]
}

export default function TestTool({ templates }: Props) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [contact, setContact] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; waveId?: string; recipientIds?: string[]; error?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplateId || !contact.trim()) return

    setIsSubmitting(true)
    setResult(null)
    const res = await startWaveAction(selectedTemplateId, [contact.trim()], 'Demo wave message')
    setResult(res as any)
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">1. Select Template</label>
          <select 
            value={selectedTemplateId} 
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#004D40]"
          >
            <option value="">Choose a template...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">2. Receiver Contact</label>
          <input 
            type="text" 
            placeholder="e.g. test@example.com" 
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#004D40]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !selectedTemplateId || !contact.trim()}
          className="w-full bg-[#004D40] text-white py-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Generate Test Wave'}
        </button>
      </form>

      {result && (
        <div className={`p-8 rounded-3xl border-2 ${result.success ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
          {result.success ? (
            <div className="space-y-4">
              <h3 className="font-bold text-green-800">Success! Wave Created.</h3>
              <div className="space-y-2">
                <p className="text-sm text-green-700">Generated Link:</p>
                {result.recipientIds?.map(id => (
                  <div key={id} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-green-200">
                    <code className="text-xs flex-1 truncate">{window.location.origin}/wave/{id}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/wave/${id}`)}
                      className="text-xs font-bold text-[#004D40] hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-600">
                You can now open this link in an Incognito window to simulate the receiver flow.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-bold text-red-800">Failed to create wave</h3>
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
