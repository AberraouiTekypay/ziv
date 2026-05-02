export type Profile = {
  id: string
  display_name: string | null
  email: string | null
  created_at: string
}

export type WaveTemplate = {
  id: string
  category: string
  title: string
  action_text: string
  is_active: boolean
  created_at: string
}

export type Wave = {
  id: string
  template_id: string | null
  creator_id: string | null
  personal_message: string | null
  created_at: string
}

export type WaveStatus = 'pending' | 'opened' | 'completed' | 'muted'

export type WaveRecipient = {
  id: string
  wave_id: string | null
  sender_id: string | null
  receiver_contact: string
  receiver_id: string | null
  status: WaveStatus
  opened_at: string | null
  completed_at: string | null
  created_at: string
}

export type ZivEvent = {
  id: string
  user_id: string | null
  wave_id: string | null
  event_name: string
  metadata: Record<string, any>
  created_at: string
}
