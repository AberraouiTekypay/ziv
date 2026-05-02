import { getTemplates } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const templates = await getTemplates()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Ziv 🌊</h1>
        <p className="text-xl text-gray-600 mb-12">Select a template to start a new wave.</p>
        
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="p-6 border border-gray-100 rounded-2xl hover:border-black transition-colors group"
            >
              <h3 className="font-bold text-lg mb-1">{template.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded">
                  {template.category}
                </span>
                <span className="text-gray-400 group-hover:text-black transition-colors font-bold">Start →</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          Ziv MVP &copy; 2026
        </div>
      </div>
    </div>
  )
}
