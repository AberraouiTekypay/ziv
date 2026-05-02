# Ziv 🌊

Stop scrolling. Feel something real.

## Setup

1.  **Clone the repo**
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Set up environment variables**
    Copy `.env.example` to `.env.local` and add your Supabase credentials.
4.  **Run the development server**
    ```bash
    npm run dev
    ```
5.  **Build for production**
    ```bash
    npm run build
    ```

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Deployment**: Vercel

## Database Setup

### Supabase Project Setup

1.  **Create a Project**: Start a new project on [Supabase](https://supabase.com/).
2.  **Apply Migrations**:
    - Navigate to the **SQL Editor**.
    - Click **New query**.
    - Copy the contents of `supabase/migrations/001_core_schema.sql` and paste them into the editor.
    - Click **Run**.
3.  **Get Credentials**:
    - Go to **Project Settings** > **API**.
    - Copy the **Project URL** and **anon public** key.

### Table Overview

- `profiles`: User profiles and contact information. (RLS Enabled)
- `wave_templates`: Pre-defined templates for creating waves. (RLS Enabled)
- `waves`: Individual "wave" instances created from a template. (RLS Enabled)
- `wave_recipients`: Tracking for who receives a wave and their progress. (RLS Enabled)
- `events`: System-wide event logging for analytics. (RLS Enabled)

---

## Deployment

### Vercel Deployment

1.  **Environment Variables**: In your Vercel project settings, add the following:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key.
    - `NEXT_PUBLIC_APP_URL`: Your deployed site URL (e.g., `https://ziv-zeta.vercel.app`).
2.  **Deploy**: Push your code to GitHub (connected to Vercel) or run `vercel --prod`.

### Deployment Debug Checklist

If the site loads but shows "Supabase not connected" or server errors:
- [ ] **Check Vercel Environment Variables**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are defined in the **Production** environment.
- [ ] **Redeploy**: Vercel requires a redeploy (or a new build) to pick up new environment variables.
- [ ] **SQL Migration**: Confirm you have run `supabase/migrations/001_core_schema.sql` in your Supabase SQL Editor.
- [ ] **Verify Tables**: Ensure the `wave_templates` table exists and contains at least 10 rows (use `SELECT count(*) FROM wave_templates;`).

### Testing After Deployment

1.  **Internal Verification**: Navigate to `/test` on your live site.
2.  **Generate a Wave**: Select a template and enter a test name.
3.  **Live Flow**: Copy the generated link (which uses your `NEXT_PUBLIC_APP_URL`) and open it in a mobile browser or private window to verify the receiver -> complete -> forward loop.

### Seed Templates

The initial migration seeds the following templates:
1.  Call your parents
2.  Message someone you miss
3.  Thank someone who helped you
4.  Check on an old friend
5.  Compliment your mother
6.  Smile and greet someone warmly today
7.  Pick up three pieces of trash
8.  Send one honest thank-you message
9.  Share a meal without your phone
10. Tell someone you appreciate them

## Share Flow

In this version of Ziv, we focus on link-based distribution to keep the experience calm and frictionless:
- **No Contact Collection**: We do not ask for recipient names or emails upfront.
- **Unique Links**: When you start or pass a wave, a unique shareable link is generated immediately.
- **WhatsApp Integration**: You can share your wave directly via a WhatsApp deep link with a pre-filled message.
- **Simple Copy**: Use the "Copy Link" button to send the wave via any other platform.

## Core Flows

### 1. Start a Wave (`/start`)
- Select a pre-defined template from the ivory card list.
- Add an optional personal message.
- A new wave is created, and a shareable link is generated.
- Use the **Share Screen** to send it via WhatsApp or Copy.

### 2. Receive & Complete a Wave (`/wave/[id]`)
- View the wave card. If the sender provided their name at `/beta`, you'll see "[Name] sent you this."
- Perform the requested action in the real world.
- Click "I did it" to mark the wave as completed.
- Experience a soft gold glow and a moment of appreciation.

### 3. Pass it Forward
- After completion, you can pass the same template forward by generating a **new** unique link.
- No new contact information is required; just click "Pass it forward" and share the new link.

## Anti-Spam Rules

To maintain the calm nature of Ziv, the following rules are enforced:
- **Daily Send Cap**: Max 3 recipients per sender per rolling 24 hours.
- **Daily Receive Cap**: Max 3 pending/opened waves per recipient per rolling 24 hours.
- **Deduplication**: Prevent sending to the same person twice within 24 hours.

## Internal Testing Tool

Use `/test` to manually verify the core loop:
- Choose any active template.
- Enter a test contact name or email.
- Copy the generated `/wave/[id]` link.
- Open the link (ideally in Incognito) to test the receiver flow.

## Core Metrics

Ziv tracks basic anonymous metrics to monitor the health of the ripple:
- **Total Waves**: Total number of waves initiated.
- **Completed Waves**: Total number of recipients who clicked "I did it".
- **Completion Rate**: % of recipients who complete their wave.
- **Forward Rate**: % of waves that lead to at least one "pass-forward" action.

## Internal Testing Protocol (Sprint 1F)

Before moving to Sprint 2, the following protocol must be completed and documented:

### 1. Manual Loop Verification
- Use the `/test` tool to generate a unique wave link.
- Open the link in a mobile browser (simulating a real user).
- Complete the action and pass it forward.
- Verify that the `status` in the `wave_recipients` table transitions correctly: `pending` -> `opened` -> `completed`.

### 2. Boundary Condition Tests
- **Sender Cap**: Verify that creating a 4th recipient within 24h triggers the "Let it breathe." error.
- **Deduplication**: Verify that sending the same template to the same contact twice within 24h is blocked.
- **Data Integrity**: Ensure `events` are logged for `wave_started`, `wave_opened`, `wave_completed`, and `wave_forwarded`.

### 3. Success Metrics
A stable Sprint 1 is defined by:
- **First-wave Completion Rate**: > 40% (Target)
- **Forward Rate**: > 20% (Target)
- **Time to Completion**: Median < 4 hours.
- **Qualitative Response**: Users report the UI feels "calm" and "soft".

---
An EM300.co Company
