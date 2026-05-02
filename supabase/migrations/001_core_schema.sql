-- Core Schema Migration for Ziv
-- Sprint 1E: Idempotent and RLS-ready

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- 7. Seed Templates (with conflict protection)
INSERT INTO public.wave_templates (id, category, title, action_text) VALUES
('11111111-1111-1111-1111-111111111111', 'Family', 'Call your parents', 'I just called my parents'),
('22222222-2222-2222-2222-222222222222', 'Friendship', 'Message someone you miss', 'I sent a message to someone I miss'),
('33333333-3333-3333-3333-333333333333', 'Gratitude', 'Thank someone who helped you', 'I thanked someone who helped me'),
('44444444-4444-4444-4444-444444444444', 'Connection', 'Check on an old friend', 'I checked on an old friend'),
('55555555-5555-5555-5555-555555555555', 'Family', 'Compliment your mother', 'I complimented my mother'),
('66666666-6666-6666-6666-666666666666', 'Kindness', 'Smile and greet someone warmly today', 'I smiled and greeted someone warmly'),
('77777777-7777-7777-7777-777777777777', 'Environment', 'Pick up three pieces of trash', 'I picked up three pieces of trash'),
('88888888-8888-8888-8888-888888888888', 'Gratitude', 'Send one honest thank-you message', 'I sent a thank-you message'),
('99999999-9999-9999-9999-999999999999', 'Mindfulness', 'Share a meal without your phone', 'I shared a meal without my phone'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Appreciation', 'Tell someone you appreciate them', 'I told someone I appreciate them')
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  action_text = EXCLUDED.action_text;

-- 8. Row Level Security (RLS)
-- WARNING: These policies are permissive for MVP development and MUST be tightened before public launch.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wave_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wave_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 8.1. Templates Policy (Public Read)
CREATE POLICY "Allow public read on active templates" ON public.wave_templates
  FOR SELECT USING (is_active = TRUE);

-- 8.2. Profiles Policy (Permissive for MVP)
CREATE POLICY "Allow anon select/insert on profiles" ON public.profiles
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- 8.3. Waves Policy (Permissive for MVP)
CREATE POLICY "Allow anon select/insert on waves" ON public.waves
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- 8.4. Recipients Policy (Permissive for MVP)
CREATE POLICY "Allow anon select/insert/update on recipients" ON public.wave_recipients
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- 8.5. Events Policy (Permissive for MVP)
CREATE POLICY "Allow anon insert on events" ON public.events
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow anon select on events" ON public.events
  FOR SELECT USING (TRUE);
