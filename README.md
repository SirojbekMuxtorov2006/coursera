# Coursa — Modern Programming Course Platform

A full-stack SaaS programming course platform built with Next.js, TypeScript, TailwindCSS, Prisma, and Stripe. Inspired by Udemy + Coursera, optimized for solo creators and small teams.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, TailwindCSS v4, Shadcn/UI, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** NextAuth.js (JWT + Google OAuth)
- **Payments:** Stripe (one-time + subscriptions)
- **Storage:** Cloudinary / AWS S3 (for videos & thumbnails)

## Features

- User registration/login (credentials + Google OAuth)
- Browse & search courses with filters
- Video player with lesson progress tracking
- Course sections with ordered lessons
- Rating & reviews system
- Threaded comments on lessons
- Stripe checkout (one-time purchase + monthly/yearly subscription)
- User dashboard with enrolled courses & progress
- Admin panel (overview, course CRUD, user management, revenue)
- Dark/Light mode with glassmorphism UI
- AI coding assistant chatbot
- In-browser JavaScript code playground
- Certificate generation on course completion
- Notification system
- Fully responsive & SEO optimized

## Project Structure

```
coursa/
├── prisma/
│   └── schema.prisma          # Database schema (15 models)
├── src/
│   ├── app/
│   │   ├── (main)/            # Public pages (landing, courses, dashboard)
│   │   ├── admin/             # Admin panel (overview, courses, users)
│   │   ├── auth/              # Login & register pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth + register
│   │   │   ├── courses/       # Course CRUD
│   │   │   ├── progress/      # Lesson progress tracking
│   │   │   ├── checkout/      # Stripe checkout
│   │   │   ├── certificates/  # Certificate generation
│   │   │   └── webhook/       # Stripe webhooks
│   │   ├── globals.css        # Theme variables (light/dark)
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/
│   │   ├── ui/                # Reusable UI (Button, Card, Badge, etc.)
│   │   ├── layout/            # Navbar, Footer
│   │   ├── providers/         # Theme & Session providers
│   │   └── course/            # Code playground, AI chatbot
│   └── lib/
│       ├── auth.ts            # NextAuth config
│       ├── db.ts              # Prisma client
│       ├── stripe.ts          # Stripe client
│       └── utils.ts           # Utility functions
├── .env.example               # Environment variables template
└── prisma.config.ts           # Prisma 7 config
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- Google Cloud project (for OAuth)
- Cloudinary account (for video + thumbnails uploads)

### 1. Clone & Install

```bash
git clone <your-repo>
cd coursa
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/coursa?schema=public"
NEXTAUTH_SECRET="generate-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_MONTHLY_PRICE_ID="price_..."
STRIPE_YEARLY_PRICE_ID="price_..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
CLOUDINARY_FOLDER="coursa"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="optional"
```

### 3. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Stripe Webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## Admin

- Visit `"/admin"` (requires an `ADMIN` user).
- Create a course at `"/admin/courses/new"`, then add sections/lessons at `"/admin/courses/:id/edit"`.

## Certificates

- Certificates are issued via `POST /api/certificates` when all lessons are completed.\n- PDF download: `GET /api/certificates/:certificateId/pdf`

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Set all environment variables in the Vercel dashboard.

## License

MIT
# coursera
