# Lentera — Lending & Tracking Application

Laboratory asset lending and tracking system with kiosk-based self-service borrowing and return.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **API Layer** | Next.js Route Handlers (Vercel Serverless Functions) — inside `lentera-frontend/app/api/` |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel |

**Note:** The `lentera-backend/` directory contains an abandoned Laravel prototype used only as a reference during initial development. It is NOT used in production. All API logic lives in the Next.js route handlers (`lentera-frontend/app/api/`).

## Project Structure

```
lentera/
├── lentera-frontend/          # Next.js web app (the actual application)
│   ├── app/
│   │   ├── api/               # Serverless API route handlers
│   │   │   ├── assets/        # Asset CRUD + scan
│   │   │   ├── borrow/        # Borrow workflow
│   │   │   ├── return/        # Return workflow
│   │   │   ├── gateway/       # Kiosk QR token generate & validate
│   │   │   ├── categories/    # Category CRUD
│   │   │   ├── admin/         # Admin settings & sudo
│   │   │   ├── login/         # Authentication
│   │   │   └── logout/        # Session end
│   │   ├── (admin/)           # Admin dashboard, print labels
│   │   ├── (cek-alat/)        # Public asset check page
│   │   ├── (display/)         # Kiosk QR display monitor
│   │   ├── (form/borrow/)     # Borrow form (kiosk)
│   │   ├── (form/return/)     # Return form (kiosk)
│   │   └── (scan/)            # QR scan landing page
│   ├── components/            # Reusable React components (UI kit)
│   ├── lib/                   # API client, types, utilities
│   └── supabase/              # DB migrations & CLI config
│       └── migrations/        # SQL migration files
├── lentera-backend/            # Laravel prototype (unused / reference only)
└── README.md
```

## Flow

1. **Admin** manages assets, categories, and settings via the dashboard (`/admin/dashboard`).
2. **Kiosk monitor** (`/display`) shows a rotating QR code with a gateway token.
3. **Student** scans the QR → `/scan` validates the token → picks **Pinjam** or **Kembalikan**.
4. **Borrow** (`/form/borrow`): Student fills form (name, NPM, subject, lecturer, return date) → submits → asset status set to `borrowed`.
5. **Return** (`/form/return`): Student selects borrowed asset + enters NPM → submits → asset status back to `available`.

## Database

Hosted on **Supabase** (PostgreSQL). Schema migrations in `lentera-frontend/supabase/migrations/`:

- `20260729000001_init.sql` — Tables: `admins`, `categories`, `assets`, `transactions`, `settings`
- `20260729000002_add_transaction_fields.sql` — Adds `student_npm`, `student_prodi`, `lecturer`, `expected_return_at`

## Development

```bash
cd lentera-frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (API routes) |

## Developed By

- **Backend (original Laravel prototype):** [@rannd1nt](https://github.com/rannd1nt) (Zahraan Dzakii Ts.)
- **Frontend & Current Backend (Next.js + Supabase):** [@MuadzHdz](https://github.com/MuadzHdz) (Mu'adz Hudzaifah)
