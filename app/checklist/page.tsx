import Link from 'next/link'

export default function ChecklistPage() {
  const steps = [
    {
      title: 'Initiate',
      description: 'Create your first wave via /start or /test.',
      items: ['Choose a template', 'Enter 1-3 recipient names or emails', 'Add a personal message']
    },
    {
      title: 'Receive',
      description: 'Experience the wave as a recipient.',
      items: ['Open the unique generated link', 'Confirm the sender name is displayed', 'Verify the action text is correct']
    },
    {
      title: 'Engage',
      description: 'Complete the loop.',
      items: ['Click "I did it"', 'Verify completion state and soft gold glow', 'Verify system event (wave_completed) logged']
    },
    {
      title: 'Forward',
      description: 'Keep the flow moving.',
      items: ['Use "Pass it forward" form', 'Create 1-3 new recipients', 'Verify new unique links are generated']
    },
    {
      title: 'Boundaries',
      description: 'Test the anti-spam and limit logic.',
      items: [
        'Attempt to send >3 recipients in 24h (Sender Cap)',
        'Attempt to send same template to same person in 24h (Deduplication)',
        'Confirm error messages are human and calm ("Let it breathe.")'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 sm:p-12 text-[#1A1A1A]">
      <div className="max-w-2xl mx-auto space-y-12 animate-fade-in">
        <header className="space-y-4">
          <div className="inline-block px-3 py-1 bg-[#004D40]/5 text-[#004D40] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#004D40]/10">
            Beta Protocol
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Testing Checklist</h1>
          <p className="text-gray-500 font-light">
            Follow these steps to ensure the Ziv core loop is stable and meaningful.
          </p>
        </header>

        <div className="space-y-10">
          {steps.map((s, i) => (
            <section key={i} className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-serif italic text-gray-200">0{i + 1}</span>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold uppercase tracking-tight">{s.title}</h2>
                  <p className="text-sm text-gray-400 font-light">{s.description}</p>
                </div>
              </div>
              <ul className="grid grid-cols-1 gap-3 ml-12">
                {s.items.map((item, ii) => (
                  <li key={ii} className="flex items-center gap-3 text-[#1A1A1A]">
                    <div className="w-5 h-5 rounded-md border-2 border-gray-100 flex-shrink-0" />
                    <span className="text-lg font-light leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
          <Link 
            href="/test"
            className="flex-1 bg-[#1A1A1A] text-white py-4 rounded-2xl font-bold text-center transition-all active:scale-95"
          >
            Go to Test Tool
          </Link>
          <Link 
            href="/"
            className="flex-1 bg-white text-gray-500 py-4 rounded-2xl font-bold text-center border border-gray-100 hover:text-[#1A1A1A] transition-all"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}
