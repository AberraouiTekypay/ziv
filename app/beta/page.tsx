'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BetaPage() {
  const [name, setName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const savedName = localStorage.getItem('ziv_tester_name')
    if (savedName) setName(savedName)
  }, [])

  const handleStart = () => {
    if (name.trim()) {
      localStorage.setItem('ziv_tester_name', name.trim())
    }
    router.push('/start')
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 text-[#1A1A1A]">
      <main className="max-w-md w-full space-y-12 animate-fade-in">
        <header className="space-y-6 text-center">
          <div className="text-5xl mb-8">🌊</div>
          <div className="space-y-4">
            <p className="text-xl font-serif italic text-gray-500">Ziv helps you interrupt the noise.</p>
            <p className="text-xl font-serif italic text-gray-500">Complete one small positive action.</p>
            <p className="text-xl font-serif italic text-gray-500">Pass it forward.</p>
          </div>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block text-center">
              What should we call you?
            </label>
            <input
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#004D40] outline-none transition-all text-center text-lg"
            />
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-[#004D40] text-white py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 shadow-xl shadow-[#004D40]/20"
          >
            Start my first wave
          </button>
        </div>

        <footer className="text-center text-sm text-gray-300 font-light">
          Internal Beta &bull; Sprint 1F
        </footer>
      </main>
    </div>
  )
}
