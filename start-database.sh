#!/usr/bin/env bash
# Start PostgreSQL using docker compose, wait for it to be ready, then run migrations and seed

set -e

pnpm prisma migrate dev --name init

echo "Running database seed (if available)..."
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
  pnpm prisma db seed
else
  echo "No seed file found, skipping seeding"
fi

echo "Database setup complete!"
