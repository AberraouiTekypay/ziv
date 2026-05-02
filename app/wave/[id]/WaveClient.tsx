'use client'

import { useState } from 'react'
import { completeWaveAction, passWaveAction } from '@/app/actions'

interface WaveClientProps {
  recipient: any // Using any for brevity in MVP, should use proper types
}

export default function WaveClient({ recipient }: WaveClientProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isPassing, setIsPassing] = useState(false)
  const [emails, setEmails] = useState(['', '', ''])
  const [showPassForm, setShowPassForm] = useState(false)
  const [status, setStatus] = useState(recipient.status)
  const [error, setError] = useState<string | null>(null)

  const template = recipient.waves?.templates

  const handleComplete = async () => {
    setIsCompleting(true)
    setError(null)
    const result = await completeWaveAction(recipient.id)
    if (result.success) {
      setStatus('sent')
    } else {
      setError(result.error || 'Failed to complete wave')
    }
    setIsCompleting(false)
  }

  const handlePass = async () => {
    const validEmails = emails.filter(e => e.trim() !== '')
    if (validEmails.length === 0) return

    setIsPassing(true)
    setError(null)
    const result = await passWaveAction(recipient.id, validEmails)
    if (result.success) {
      setStatus('sent')
      setShowPassForm(false)
    } else {
      setError(result.error || 'Failed to pass wave')
    }
    setIsPassing(false)
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <div className="text-6xl mb-6">🌊</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Wave Flowing!</h1>
          <p className="text-gray-600 mb-8">You've successfully completed your part in this wave.</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 font-medium hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white md:bg-gray-50 p-0 md:p-6">
      <div className="max-w-2xl w-full min-h-screen md:min-h-[auto] bg-white md:rounded-3xl shadow-none md:shadow-2xl overflow-hidden flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wider uppercase">
              {template?.category || 'Wave'}
            </span>
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
            {template?.name}
          </h1>
          
          <div 
            className="text-lg text-gray-700 leading-relaxed mb-12 space-y-4"
            dangerouslySetInnerHTML={{ __html: template?.content || '' }}
          />
        </div>

        {/* Actions Area */}
        <div className="p-8 md:p-12 bg-gray-50 border-t border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          {!showPassForm ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex-1 bg-black text-white font-bold py-5 rounded-2xl transition-transform active:scale-95 disabled:opacity-50"
              >
                {isCompleting ? 'Completing...' : 'Complete Wave'}
              </button>
              <button
                onClick={() => setShowPassForm(true)}
                className="flex-1 bg-white text-black border-2 border-black font-bold py-5 rounded-2xl transition-transform active:scale-95"
              >
                Pass Wave
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Pass to 1–3 friends</h2>
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <input
                    key={index}
                    type="email"
                    placeholder={`Friend's email ${index + 1}`}
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...emails]
                      newEmails[index] = e.target.value
                      setEmails(newEmails)
                    }}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={handlePass}
                  disabled={isPassing || emails.every(e => e.trim() === '')}
                  className="flex-1 bg-black text-white font-bold py-5 rounded-2xl transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isPassing ? 'Passing...' : 'Send Wave'}
                </button>
                <button
                  onClick={() => setShowPassForm(false)}
                  className="flex-1 bg-white text-gray-500 font-bold py-5 rounded-2xl hover:text-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
