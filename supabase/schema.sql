-- Create Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT
);

-- Create Templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT
);

-- Create Waves table
CREATE TABLE IF NOT EXISTS public.waves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE
);

-- Create Wave Recipients table
CREATE TABLE IF NOT EXISTS public.wave_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  wave_id UUID REFERENCES public.waves(id) ON DELETE CASCADE NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Seed Templates
INSERT INTO public.templates (name, description, content, category) VALUES
('Welcome Wave', 'Initial greeting for new users.', '<h1>Welcome to Ziv!</h1><p>We are excited to have you on board.</p>', 'Onboarding'),
('Monthly Newsletter', 'Regular updates and highlights.', '<h2>Monthly Roundup</h2><p>Here is what happened this month...</p>', 'Newsletter'),
('Product Update', 'Notification about new features.', '<h3>New Features Alert!</h3><p>We just released some cool stuff.</p>', 'Product'),
('Security Alert', 'Important security notifications.', '<p>Important: We noticed a new login to your account.</p>', 'Security'),
('Event Invitation', 'Invite users to join an event.', '<h1>You are invited!</h1><p>Join our upcoming webinar.</p>', 'Events'),
('Feedback Request', 'Ask users for their feedback.', '<p>How are we doing? Let us know.</p>', 'Research'),
('Discount Offer', 'Promotional discounts for users.', '<h2>Special Offer!</h2><p>Get 20% off your next purchase.</p>', 'Marketing'),
('Subscription Renewal', 'Reminder for upcoming renewals.', '<p>Your subscription is about to renew.</p>', 'Billing'),
('Inactive User Recovery', 'Re-engage users who haven''t logged in lately.', '<h3>We miss you!</h3><p>Come back and see what''s new.</p>', 'Retention'),
('Support Follow-up', 'Follow-up on recent support tickets.', '<p>Was your issue resolved to your satisfaction?</p>', 'Support');
