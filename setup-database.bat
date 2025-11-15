@echo off
rem Reset database and sync schema

echo Syncing database schema...
pnpm prisma db push --force-reset && pnpm prisma db seed

if %errorlevel% neq 0 (
    echo Database setup failed!
    exit /b 1
)

echo Database setup complete!