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
