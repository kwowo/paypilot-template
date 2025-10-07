#!/bin/sh

echo "🚀 Starting application..."

# Check if migrations directory exists and has files
if [ -d "./prisma/migrations" ] && [ "$(ls -A ./prisma/migrations)" ]; then
    echo "📁 Migration files found, running prisma migrate deploy..."
    npx prisma migrate deploy --schema=./prisma/schema.prisma
else
    echo "📄 No migration files found, running prisma db push..."
    npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss
fi

# Check if schema deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Database schema deployed successfully"
    echo "🌱 Starting Next.js application..."
    node server.js
else
    echo "❌ Database schema deployment failed"
    exit 1
fi
