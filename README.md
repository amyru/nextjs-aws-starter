# Next.js + Prisma + Auth.js + Playwright (AWS-ready)

A minimal, production-shaped starter:
- **Next.js (App Router)** + Tailwind
- **Prisma + Postgres**
- **NextAuth (GitHub + Credentials)**
- **Vitest + Playwright**
- **GitHub Actions** (lint, typecheck, unit, e2e ready)
- **AWS path**: Amplify Hosting (web) + RDS (Postgres) + S3 (uploads)

## 1) Local setup

```bash
cp .env.example .env        # fill in values
npm ci
npx prisma migrate dev
npm run dev
```

Visit http://localhost:3000

> Use GitHub OAuth or add a credentials user by inserting a row in `User` with a hashed password (bcrypt).

## 2) Scripts
- `dev` — run the app locally
- `build` — prisma generate + next build
- `test` / `test:ui` — vitest
- `e2e` — Playwright tests
- `lint`, `typecheck`

## 3) Deploy to AWS (simple path)
1. **Create RDS Postgres** (db.t4g.micro, 20GB). Store the connection string.
2. **Amplify Hosting** → Connect this GitHub repo → set env vars:
   - `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
   - `GITHUB_ID`, `GITHUB_SECRET` (optional)
   - (later) `AWS_REGION`, `S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
3. Update Amplify build settings if needed (Next auto-detected).

### Migrations in CI (recommended)
Create a GitHub secret `DATABASE_URL` (RDS) and add a job to run:
```yaml
- name: Prisma migrate deploy
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```
Then let Amplify build & deploy the app.

## 4) S3 uploads (later)
Implement a route that returns a **pre-signed URL**; upload directly from the browser.
Keep the bucket private (block public access).

## 5) Notes
- Local DB: use Docker `postgres` or any managed Postgres.
- Credentials auth is for simple demos. For production, prefer OAuth or email magic links.
- Tighten `middleware.ts` to enforce auth on protected routes.
