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

### Applying Migrations

To set up the database schema and seed templates, follow these steps:

1.  Open your [Supabase Project Dashboard](https://app.supabase.com/).
2.  Navigate to the **SQL Editor**.
3.  Click **New query**.
4.  Copy the contents of `supabase/migrations/001_core_schema.sql` and paste them into the editor.
5.  Click **Run**.

### Table Overview

- `profiles`: User profiles and contact information.
- `wave_templates`: Pre-defined templates for creating waves.
- `waves`: Individual "wave" instances created from a template.
- `wave_recipients`: Tracking for who receives a wave and their progress (pending, opened, completed, muted).
- `events`: System-wide event logging for analytics and tracking.

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

## Testing Manually

1.  **Start a wave**: Go to `/start`, pick a template, enter a test contact, and submit.
2.  **Inspect Database**: In Supabase, look at the `wave_recipients` table to find the unique `id` for your test recipient.
3.  **Receive wave**: Navigate to `/wave/[your-recipient-id]` to see the wave card.
4.  **Complete & Forward**: Click "I did it", then use the "Pass it forward" form to extend the chain.

---
An EM300.co Company
