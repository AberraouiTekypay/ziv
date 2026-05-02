import { getActiveTemplates } from '@/lib/wave-service'
import StartWaveForm from './StartWaveForm'

export const dynamic = 'force-dynamic'

export default async function StartPage() {
  const templates = await getActiveTemplates()

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-0 sm:p-6">
      <div className="max-w-md w-full min-h-screen sm:min-h-0 bg-[#FFFDFB] sm:rounded-[2.5rem] shadow-none sm:shadow-2xl border-none sm:border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-8 sm:p-10 flex-1 flex flex-col">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">
              Start a Wave
            </h1>
            <p className="text-gray-400 font-light mt-2">
              Choose an action to ripple out.
            </p>
          </header>

          <StartWaveForm templates={templates} />
        </div>
      </div>
    </div>
  )
}
