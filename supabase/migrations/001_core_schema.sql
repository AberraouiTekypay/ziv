-- Core Schema Migration for Ziv

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Wave Templates Table
CREATE TABLE IF NOT EXISTS public.wave_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  action_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Waves Table
CREATE TABLE IF NOT EXISTS public.waves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.wave_templates(id),
  creator_id UUID REFERENCES public.profiles(id),
  personal_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Wave Recipients Table
CREATE TABLE IF NOT EXISTS public.wave_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wave_id UUID REFERENCES public.waves(id),
  sender_id UUID REFERENCES public.profiles(id),
  receiver_contact TEXT NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'opened', 'completed', 'muted')),
  opened_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  wave_id UUID REFERENCES public.waves(id),
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_wave_recipients_receiver_contact ON public.wave_recipients(receiver_contact);
CREATE INDEX IF NOT EXISTS idx_wave_recipients_receiver_id ON public.wave_recipients(receiver_id);
CREATE INDEX IF NOT EXISTS idx_wave_recipients_status ON public.wave_recipients(status);
CREATE INDEX IF NOT EXISTS idx_waves_creator_id ON public.waves(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON public.events(event_name);

-- 7. Seed Templates
INSERT INTO public.wave_templates (category, title, action_text) VALUES
('Family', 'Call your parents', 'I just called my parents'),
('Friendship', 'Message someone you miss', 'I sent a message to someone I miss'),
('Gratitude', 'Thank someone who helped you', 'I thanked someone who helped me'),
('Connection', 'Check on an old friend', 'I checked on an old friend'),
('Family', 'Compliment your mother', 'I complimented my mother'),
('Kindness', 'Smile and greet someone warmly today', 'I smiled and greeted someone warmly'),
('Environment', 'Pick up three pieces of trash', 'I picked up three pieces of trash'),
('Gratitude', 'Send one honest thank-you message', 'I sent a thank-you message'),
('Mindfulness', 'Share a meal without your phone', 'I shared a meal without my phone'),
('Appreciation', 'Tell someone you appreciate them', 'I told someone I appreciate them');
