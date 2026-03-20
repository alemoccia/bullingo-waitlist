# Waitlist Creator Pro

A production-ready waitlist landing page with referral tracking, built with React, Supabase, and Tailwind CSS.

## Features

- **Email Waitlist Signup** — Collects emails with platform preference (iOS/Android)
- **Referral System** — Unique referral codes & automatic referral count tracking
- **IP-based Duplicate Prevention** — One signup per device via edge function
- **Real-time Leaderboard** — Live referral leaderboard powered by Supabase Realtime
- **Admin Dashboard** — Password-protected admin panel with signup stats and analytics
- **MailerLite Integration** — Optional email marketing integration
- **Confirmation Page** — Post-signup page with shareable referral link

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Edge Functions, Row Level Security, Realtime)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the root with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### 3. Set up the database

Run the SQL migrations in your Supabase SQL Editor (in order):

1. `supabase/migrations/20260317155554_*.sql` — Creates the `waitlist_signups` table, RLS policies, referral trigger, and indexes
2. `supabase/migrations/20260317164239_*.sql` — Enables Realtime
3. `supabase/migrations/20260318201256_*.sql` — Adds IP address column and unique index

### 4. Deploy Edge Functions

```bash
npx supabase login
npx supabase link --project-ref your-project-id
npx supabase functions deploy waitlist-signup
npx supabase functions deploy admin-data
```

### 5. Set Edge Function Secrets

Add these secrets via the Supabase Dashboard (Project Settings → Edge Functions → Secrets):

| Secret | Required | Description |
|--------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Password for the `/admin` dashboard |
| `MAILERLITE_API_KEY` | No | MailerLite API key for email marketing |

### 6. Run locally

```bash
npm run dev
```

## Project Structure

```
src/
├── components/       # UI components (WaitlistForm, Leaderboard, PhoneMockup)
├── pages/            # Route pages (Index, Confirmed, Admin, NotFound)
├── integrations/     # Supabase client & types
├── hooks/            # Custom React hooks
└── lib/              # Utility functions

supabase/
├── functions/        # Edge Functions (waitlist-signup, admin-data)
└── migrations/       # SQL migrations
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |
