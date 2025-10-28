# 🚀 Quick Deploy to Vercel

## TL;DR - Fastest Way to Deploy

### 1. Get a Free PostgreSQL Database (2 minutes)

**Option A: Supabase** (Recommended)
1. Go to https://supabase.com
2. Click "Start your project" → Create account
3. Create a new project
4. Copy the connection string from Settings → Database

**Option B: Neon** (Serverless)
1. Go to https://neon.tech
2. Sign up → Create a project
3. Copy the connection string

### 2. Switch to PostgreSQL (1 minute)

```bash
cd /Users/andreamagazzini/dev/nextjs-juice-shop

# Edit prisma/schema.prisma
# Change line 10 from: provider = "sqlite"
# To: provider = "postgresql"

# Update connection
npx prisma generate
npx prisma db push
```

### 3. Set Environment Variable

```bash
# Create .env.local
echo 'DATABASE_URL="your-supabase-connection-string"' > .env.local
```

### 4. Deploy to Vercel (1 minute)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel

# When asked, add the DATABASE_URL:
# Environment Variable: DATABASE_URL
# Value: (your connection string from Supabase)
```

### 5. Done! ✅

Your app is now live at: `https://your-app.vercel.app`

---

## Detailed Steps

### Step 1: Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // ← Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Push Schema to Database

```bash
# Replace with your Supabase connection string
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

npx prisma db push
```

### Step 4: Seed the Database

```bash
npm run db:seed
```

### Step 5: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts, make sure to add:
# DATABASE_URL environment variable with your Supabase URL
```

### Step 6: Add Environment Variables in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add `DATABASE_URL` with your connection string
5. Redeploy

---

## Connection String Examples

**Supabase:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

**Neon:**
```
postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

**Vercel Postgres:**
```
postgres://[USER]:[PASSWORD]@[HOST]/[DATABASE]
```

---

## What Works on Vercel

✅ PostgreSQL (Supabase, Neon, Vercel Postgres)  
✅ MySQL (PlanetScale)  
❌ SQLite (filesystem not persistent in serverless)

---

## Cost Breakdown

**Free Tier:**
- Vercel: Free (hobby plan)
- Supabase: 500MB database + 2GB bandwidth free
- **Total: $0/month**

Perfect for courses with 50-100 students!

---

## Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
