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

## Core Flows

### 1. Start a Wave (`/start`)
- Select a pre-defined template from the ivory card list.
- Enter 1-3 contacts (names or emails) to send the wave to.
- Add an optional personal message.
- A new wave is created, and unique links are generated for each recipient.

### 2. Receive & Complete a Wave (`/wave/[id]`)
- View the wave card sent by "Someone who thought of you."
- Perform the requested action in the real world.
- Click "I did it" to mark the wave as completed.
- Experience a soft gold glow and a moment of appreciation.

### 3. Pass it Forward
- After completion, you can pass the same template forward to 1-3 new people.
- This creates a ripple effect, keeping the positive action moving.

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

---
An EM300.co Company
