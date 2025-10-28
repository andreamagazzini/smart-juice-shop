#!/bin/bash

# Script to migrate from SQLite to PostgreSQL for Vercel deployment

echo "🚀 Switching Next.js Juice Shop to PostgreSQL for Vercel deployment"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set!"
    echo ""
    echo "Get your PostgreSQL connection string from:"
    echo "  - Supabase: https://supabase.com"
    echo "  - Neon: https://neon.tech"
    echo "  - Vercel Postgres: Available in Vercel dashboard"
    echo ""
    echo "Then run:"
    echo "  export DATABASE_URL='postgresql://user:password@host:5432/database'"
    echo "  ./switch-to-postgresql.sh"
    exit 1
fi

echo "📝 Updating Prisma schema..."
# Update schema.prisma to use PostgreSQL
sed -i.bak 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

echo "🔄 Generating Prisma client for PostgreSQL..."
npx prisma generate

echo "📤 Pushing schema to PostgreSQL database..."
npx prisma db push

echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your DATABASE_URL"
echo "2. Add DATABASE_URL to Vercel environment variables"
echo "3. Deploy to Vercel: npx vercel"
echo ""
echo "Your database is now: PostgreSQL"
echo "Ready for Vercel deployment! 🚀"
