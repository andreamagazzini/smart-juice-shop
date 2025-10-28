# Deploying Next.js Juice Shop to Vercel

## Why SQLite Won't Work on Vercel

Vercel uses **serverless functions** that are stateless. SQLite needs a persistent file system, which serverless functions don't have. Each function invocation is isolated.

## Recommended Database Hosting Options

### 1. **Supabase** (Best for Free Tier) ⭐ RECOMMENDED
- **Free tier**: 500MB database, 2GB bandwidth
- **PostgreSQL** database
- Easy to set up
- Great for courses with multiple students

**Setup:**
```bash
1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Get your connection string from Settings > Database
5. Update your .env file
```

**Connection String Format:**
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres"
```

### 2. **Neon** (Serverless PostgreSQL)
- **Free tier**: Autoscaling to zero
- Fully serverless
- Great for intermittent usage

**Setup:** https://neon.tech

### 3. **Vercel Postgres**
- Integrated with Vercel
- $20/month (or free with some limits)
- Zero-configuration

**Setup:** 
1. In Vercel dashboard, go to Storage tab
2. Create a Postgres database
3. Automatic connection string

### 4. **Railway** (Easiest for Development)
- **Free tier**: $5 credit/month
- Simple setup
- Good for testing

### 5. **PlanetScale** (MySQL Alternative)
- Free tier available
- Branchable databases
- Good for collaboration

## How to Switch from SQLite to PostgreSQL

### Step 1: Update Prisma Schema

Change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 2: Get Database Connection String

For **Supabase**:
1. Create project at https://supabase.com
2. Go to Settings > Database
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with actual password

### Step 3: Update Environment Variables

Create `.env.local`:
```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

### Step 4: Update Vercel Environment Variables

1. Go to your Vercel project settings
2. Add the `DATABASE_URL` environment variable
3. Deploy

### Step 5: Run Migrations

```bash
# Generate Prisma client with PostgreSQL
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database (optional)
npm run db:seed
```

## Quick Deployment Guide

### For Your Course Setup

1. **Option A: One Database Per Student** (Best for privacy)
   - Each student deploys their own Vercel + Supabase instance
   - Complete isolation
   - Student keeps their data

2. **Option B: Shared Database** (Simpler)
   - One shared Supabase database
   - All students use same URL
   - Leaderboard shared across all students

## Recommended Setup for Your Course

### I recommend: **Supabase** + **Vercel**

**Why:**
- ✅ Free tier is generous
- ✅ PostgreSQL (production-grade)
- ✅ Easy to manage
- ✅ Can see database in Supabase dashboard
- ✅ Students can inspect data easily

**Cost:** $0 for typical course usage

### Step-by-Step Deployment

```bash
# 1. Install dependencies (if not already)
npm install

# 2. Update schema to use PostgreSQL
# Edit prisma/schema.prisma and change "sqlite" to "postgresql"

# 3. Get your Supabase connection string
# Visit https://supabase.com and create a project

# 4. Update environment variables
DATABASE_URL="your-supabase-connection-string"

# 5. Push schema to Supabase
npx prisma db push

# 6. Seed data
npm run db:seed

# 7. Deploy to Vercel
npx vercel

# 8. Add DATABASE_URL to Vercel environment variables
```

## Verifying Deployment

After deployment, check:
- ✅ App loads at `https://your-app.vercel.app`
- ✅ Login works
- ✅ Database persists data
- ✅ Scoreboard updates

## Production Considerations

For actual student use:

1. **Database isolation**: Separate databases per student
2. **Rate limiting**: Add API rate limiting
3. **Monitoring**: Set up error tracking (Sentry)
4. **Backups**: Supabase auto-backups (free tier)
5. **SSL**: All connections encrypted by default

## Environment Variables for Vercel

Add these in Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
NODE_ENV=production
```

## Troubleshooting

### Issue: "Can't connect to database"
- Check DATABASE_URL is correct
- Verify Supabase project is running
- Check network permissions in Supabase

### Issue: "Schema out of sync"
```bash
npx prisma db push --force-reset
npm run db:seed
```

### Issue: "Vercel deployment fails"
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `prisma generate` runs in build

## Cost Estimate

**Free Tier (Perfect for Course):**
- Vercel: Free for hobby projects
- Supabase: Free tier (500MB + 2GB bandwidth)
- **Total: $0/month**

**If you exceed free tier:**
- Supabase Pro: $25/month (unlimited students)
- Vercel Pro: $20/month (better limits)

## Additional Resources

- Vercel Documentation: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Prisma Deploy Guide: https://www.prisma.io/docs/guides/deployment
