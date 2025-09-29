@echo off
rem Start PostgreSQL using docker compose, wait for it to be ready, then run migrations and seed

echo Starting PostgreSQL with docker compose...
docker compose up -d postgres

if %errorlevel% neq 0 (
    echo Failed to start PostgreSQL container
    exit /b 1
)

echo Waiting for PostgreSQL to be ready...
:wait_loop
docker compose exec postgres pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL is starting up, waiting...
    timeout /t 2 /nobreak >nul
    goto wait_loop
)

echo PostgreSQL is ready! Running Prisma migrations...
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