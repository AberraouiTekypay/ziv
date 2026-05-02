export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      templates: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          content: string
          category: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          content: string
          category?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          content?: string
          category?: string | null
        }
      }
      waves: {
        Row: {
          id: string
          created_at: string
          sender_id: string
          template_id: string | null
          status: 'pending' | 'sent' | 'failed'
          scheduled_for: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          sender_id: string
          template_id?: string | null
          status?: 'pending' | 'sent' | 'failed'
          scheduled_for?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          sender_id?: string
          template_id?: string | null
          status?: 'pending' | 'sent' | 'failed'
          scheduled_for?: string | null
        }
      }
      wave_recipients: {
        Row: {
          id: string
          created_at: string
          wave_id: string
          recipient_email: string
          status: 'pending' | 'sent' | 'failed'
        }
        Insert: {
          id?: string
          created_at?: string
          wave_id: string
          recipient_email: string
          status?: 'pending' | 'sent' | 'failed'
        }
        Update: {
          id?: string
          created_at?: string
          wave_id?: string
          recipient_email?: string
          status?: 'pending' | 'sent' | 'failed'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type User = Tables<'users'>
export type Template = Tables<'templates'>
export type Wave = Tables<'waves'>
export type WaveRecipient = Tables<'wave_recipients'>
