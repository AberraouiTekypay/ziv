import { getActiveTemplates } from '@/lib/wave-service'
import TestTool from './TestTool'

export const dynamic = 'force-dynamic'

export default async function TestPage() {
  const templates = await getActiveTemplates()

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 sm:p-12 text-[#1A1A1A]">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Internal Testing</h1>
          <p className="text-gray-500 font-light">
            This tool is for manual verification of the core wave loop. 
            It bypasses client-side validation but still respects server-side anti-spam rules.
          </p>
        </header>

        <TestTool templates={templates} />
        
        <footer className="pt-12 text-sm text-gray-400">
          Ziv Hardening Tools &copy; 2026
        </footer>
      </div>
    </div>
  )
}
