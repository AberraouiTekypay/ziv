# Changelog

## [0.1.0] - 2026-05-02

### Added
- Initial Next.js 16 (App Router) project setup.
- TailwindCSS configuration with Ziv visual identity (warm off-white background).
- Base directory structure: `/app`, `/components`, `/lib`.
- Supabase client initialization in `/lib/supabase.ts`.
- Database helper functions for templates and waves in `/lib/db.ts`.
- Clean minimalist landing page at `/`.
- Documentation: `README.md`, `CHANGELOG.md`, and `.env.example`.
- Global styles and theme colors.

## [0.1.1] - 2026-05-02

### Added
- Core Supabase schema migration (`001_core_schema.sql`) with tables: `profiles`, `wave_templates`, `waves`, `wave_recipients`, `events`.
- Seeded 10 core wave templates.
- TypeScript types for the core data model in `lib/ziv-types.ts`.
- Core Wave Service with interaction placeholders in `lib/wave-service.ts`.

## [0.1.2] - 2026-05-02

### Added
- Core user flow: Receive a wave (`/wave/[id]`), complete it, and pass it forward.
- Start wave flow (`/start`) to choose a template and initiate a new wave.
- Full-screen minimalist UI with ivory cards, deep teal buttons, and soft gold completion glow.
- Server Actions for starting, completing, and forwarding waves.
- Automated "opened" status tracking and system event logging.
- Demo profile helper to handle the absence of full authentication.
- CSS animations for transitions between flow states.

## [0.1.3] - 2026-05-02

### Added
- Anti-spam rules: Daily send cap (3), Daily receive cap (3), and 24h deduplication.
- Internal testing tool at `/test` for manual loop verification.
- Metrics service (`lib/metrics-service.ts`) for tracking completion and forward rates.
- Graceful error handling and validation for all wave-related forms.
- Visual polish: Refined card spacing, button states, and completion animations.
- Empty states for missing templates and invalid wave links.

## [0.1.4] - 2026-05-02

### Added
- Hardened Supabase integration with production runtime error checking.
- Idempotent SQL migration (`001_core_schema.sql`) with pgcrypto and conflict protection.
- Row Level Security (RLS) enabled on all tables with permissive development policies.
- Full deployment readiness for Vercel, including environment variable mapping.
- Comprehensive deployment documentation in `README.md`.
