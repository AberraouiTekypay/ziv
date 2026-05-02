import { getWaveRecipientDetails } from '@/lib/db'
import WaveClient from './WaveClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WavePage({ params }: PageProps) {
  const { id } = await params

  let recipient
  try {
    recipient = await getWaveRecipientDetails(id)
  } catch (error) {
    console.error('Error fetching wave recipient:', error)
    return notFound()
  }

  if (!recipient) {
    return notFound()
  }

  return <WaveClient recipient={recipient} />
}
