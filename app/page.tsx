import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 text-[#1A1A1A]">
      <main className="max-w-2xl w-full text-center space-y-8 py-20">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight leading-tight italic">
            Stop scrolling. <br />
            <span className="not-italic font-sans font-black uppercase tracking-tighter">Feel something real.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light max-w-md mx-auto">
            One small action can change your day.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/start"
            className="inline-block bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
          >
            Start a wave
          </Link>
        </div>
      </main>

      <footer className="mt-auto py-10 text-sm text-gray-400">
        <a 
          href="https://em300.co" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-[#1A1A1A] transition-colors"
        >
          An EM300.co Company
        </a>
      </footer>
    </div>
  )
}
