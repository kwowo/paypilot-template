@echo off
rem Run migrations and seed

echo Running Prisma migrations...
pnpm prisma migrate dev --name init && pnpm prisma db seed

if %errorlevel% neq 0 (
    echo Failed to run Prisma migrations
    exit /b 1
)

echo Running database seed (if available)...
if exist "prisma\seed.ts" (
    pnpm prisma db seed
) else if exist "prisma\seed.js" (
    pnpm prisma db seed
) else (
    echo No seed file found, skipping seeding
)

echo Database setup complete!