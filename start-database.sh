#!/usr/bin/env bash
# Start PostgreSQL using docker compose, wait for it to be ready, then run migrations and seed

set -e

echo "Starting PostgreSQL with docker compose..."
docker compose up -d postgres

echo "Waiting for PostgreSQL to be ready..."
while ! docker compose exec postgres pg_isready -U postgres >/dev/null 2>&1; do
  echo "PostgreSQL is starting up, waiting..."
  sleep 2
done

echo "PostgreSQL is ready! Running Prisma migrations..."
pnpm prisma migrate dev --name init

echo "Running database seed (if available)..."
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
  pnpm prisma db seed
else
  echo "No seed file found, skipping seeding"
fi

echo "Database setup complete!"
