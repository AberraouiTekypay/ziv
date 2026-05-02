import { getWaveRecipientWithWave, markWaveOpened, logEvent } from '@/lib/wave-service'
import WaveInteraction from './WaveInteraction'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function WaveViewPage({ params }: Props) {
  const { id } = await params

  let recipient
  try {
    recipient = await getWaveRecipientWithWave(id)
  } catch (e) {
    console.error('Error fetching wave:', e)
    return notFound()
  }

  if (!recipient) return notFound()

  // On page load (Server Side) - Mark as opened and log event
  // Note: In a real app, you might want to do this in a client-side useEffect 
  // to avoid marking as opened on every server refresh or crawler hit.
  // But for this sprint, we'll do it here for simplicity or via a client component.
  // Actually, let's do it in the client component to be more precise about "viewed".

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-0 sm:p-6">
      <WaveInteraction recipient={recipient} />
    </div>
  )
}
