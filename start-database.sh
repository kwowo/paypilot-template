#!/usr/bin/env bash
# Reset database and sync schema

set -e

echo "Syncing database schema..."
pnpm prisma db push --force-reset && pnpm prisma db seed

echo "Database setup complete!"