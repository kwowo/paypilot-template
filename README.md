# TeeShop - T-Shirt E-commerce Store

A modern, full-stack t-shirt e-commerce website built with the T3 stack (Next.js, TypeScript, tRPC, Prisma, Tailwind CSS).

## 🚀 Features

### ✅ Completed Features
- **Homepage** with hero section, featured products, and category navigation
- **Product Catalog** with category filtering (Men, Women, Kids)
- **Product Detail Pages** with size/color selection and add to cart functionality
- **Shopping Cart** with quantity management
- **User Authentication** (Sign in/Sign up) with Better Auth
- **Order History** for authenticated users
- **Responsive Design** that works on all devices
- **About Page** with store information

### 🔧 Technical Features
- **T3 Stack Architecture** with modern best practices
- **Type-safe APIs** with tRPC
- **Database Schema** designed for e-commerce
- **Authentication System** with Better Auth
- **Responsive UI** with Tailwind CSS
- **Mock Data** for development (ready for database integration)

## 🛣️ Route Structure

### Static Routes
- `/` - Homepage with featured products
- `/shop` - All products catalog
- `/cart` - Shopping cart (auth required)
- `/orders` - Order history (auth required)
- `/about` - Store information
- `/sign-in` - User login
- `/sign-up` - User registration

### Dynamic Routes
- `/shop/[category]` - Category pages (men, women, kids)
- `/product/[slug]` - Individual product pages

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order history
│   ├── product/[slug]/    # Product detail pages
│   ├── shop/              # Product catalog
│   │   └── [category]/    # Category pages
│   ├── about/             # About page
│   └── layout.tsx         # Root layout with navigation
├── components/
│   └── layout/
│       └── Navbar.tsx     # Main navigation component
├── server/api/            # tRPC API routes
│   └── routers/
│       ├── product.ts     # Product operations
│       ├── category.ts    # Category operations
│       └── cart.ts        # Cart operations
└── lib/                   # Utilities and configurations
```

## Tech Stack

This project uses the following technologies:

- **[Next.js](https://nextjs.org)** - React framework with App Router
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication library
- **[Prisma](https://prisma.io)** - Type-safe database ORM
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[PostgreSQL](https://postgresql.org)** - Database via Docker

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose (for database)

### Development Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo>
   cd starter-template
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Better Auth
   BETTER_AUTH_SECRET="your-secret-here"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/starter-template"
   ```

3. **Start the database and run migrations:**

   **Option A: Complete Setup (Recommended)**

   For **Windows**:

   ```bash
   pnpm db:setup:win
   # OR directly:
   setup-database.bat
   ```

   For **Unix/Linux/MacOS**:

   ```bash
   pnpm db:setup
   # OR directly:
   chmod +x start-database.sh
   ./start-database.sh
   ```

   This will:
   - Start PostgreSQL using Docker Compose
   - Wait for database to be ready
   - Run Prisma migrations
   - Seed the database (if seed file exists)

   **Option B: Manual Setup**

   Start database:

   ```bash
   docker-compose up -d postgres
   ```

   Run migrations:

   ```bash
   pnpm db:migrate
   ```

   **Option C: Using Docker directly**

   ```bash
   docker run -d \
     --name starter-template-postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=starter-template \
     -p 5432:5432 \
     postgres

   # Then run migrations
   pnpm db:migrate
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

This project uses [Better Auth](https://www.better-auth.com/) for authentication with the following features:

### Available Auth Methods

- **Email/Password** - Traditional email and password authentication
- **Email Verification** - Optional (currently disabled for development)

### Auth Pages

- `/sign-in` - Sign in with existing account
- `/sign-up` - Create a new account

### Usage

**Client-side authentication:**

```typescript
import { signIn, signUp, signOut, useSession } from "@/lib/auth-client";

// Sign in
const result = await signIn.email({
  email: "user@example.com",
  password: "password",
});

// Sign up
const result = await signUp.email({
  name: "John Doe",
  email: "user@example.com",
  password: "password",
});

// Sign out
await signOut();

// Get session in components
const { data: session } = useSession();
```

**Server-side authentication:**

```typescript
import { auth } from "@/lib/auth";

// In API routes or server components
const session = await auth.api.getSession({
  headers: headers(),
});
```

### Protected Routes

Use tRPC's `protectedProcedure` for authenticated endpoints:

```typescript
export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // ctx.session.user is guaranteed to exist
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
});
```

## Database Management

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm preview          # Build and start production server

# Database Setup
pnpm db:setup         # Complete database setup (Unix/Linux/MacOS)
pnpm db:setup:win     # Complete database setup (Windows)
pnpm db:start         # Start PostgreSQL container only
pnpm db:stop          # Stop all containers

# Database Management
pnpm db:migrate       # Run database migrations
pnpm db:generate      # Generate Prisma client + run migrations
pnpm db:push          # Push schema changes without migrations
pnpm db:seed          # Seed the database
pnpm db:studio        # Open Prisma Studio (database GUI)

# Code Quality
pnpm typecheck        # Type checking
pnpm lint             # Linting
pnpm lint:fix         # Fix linting issues
pnpm format:check     # Check formatting
pnpm format:write     # Fix formatting
pnpm check            # Run lint + typecheck
```

### Docker Database Management

**Using Docker Compose (Recommended):**

```bash
# Start database only
docker-compose up -d postgres

# Start entire stack (app + database)
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs postgres
docker-compose logs app

# Remove volumes (deletes all data)
docker-compose down -v
```

**Using Docker directly:**

```bash
# Start database
docker run -d \
  --name starter-template-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=starter-template \
  -p 5432:5432 \
  postgres

# Stop database
docker stop starter-template-postgres

# Remove container
docker rm starter-template-postgres

# View logs
docker logs starter-template-postgres
```

**Using the provided scripts:**

For **Windows**:

```bash
setup-database.bat
# OR
pnpm db:setup:win
```

For **Unix/Linux/MacOS**:

```bash
chmod +x start-database.sh
./start-database.sh
# OR
pnpm db:setup
```

## Development

### Code Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format:check
pnpm format:write

# Run all checks
pnpm check
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── _components/        # Shared components
│   ├── api/               # API routes
│   │   ├── auth/          # Better Auth endpoints
│   │   └── trpc/          # tRPC endpoints
│   ├── sign-in/           # Authentication pages
│   ├── sign-up/
│   └── layout.tsx
├── lib/                   # Utility libraries
│   ├── auth.ts           # Better Auth server config
│   └── auth-client.ts    # Better Auth client config
├── server/               # Server-side code
│   ├── api/             # tRPC routers
│   └── db.ts           # Database connection
└── trpc/               # tRPC client setup
```

## Learn More

To learn more about the technologies used in this project:

- **[T3 Stack Documentation](https://create.t3.gg/)** - Full stack TypeScript framework
- **[Better Auth Documentation](https://www.better-auth.com/)** - Modern authentication
- **[Next.js Documentation](https://nextjs.org/docs)** - React framework
- **[tRPC Documentation](https://trpc.io/docs)** - Type-safe APIs
- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - CSS framework

## Deployment

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

```env
# Generate a secure secret for production
BETTER_AUTH_SECRET="your-production-secret-here"
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_BETTER_AUTH_URL="https://your-domain.com"

# Production database URL
DATABASE_URL="your-production-database-url"
```

### Deployment Platforms

Follow deployment guides for:

- **[Vercel](https://create.t3.gg/en/deployment/vercel)** - Recommended for Next.js
- **[Railway](https://railway.app/)** - Easy database + app hosting
- **[Docker](https://create.t3.gg/en/deployment/docker)** - Containerized deployment

### Production Checklist

- [ ] Set secure `BETTER_AUTH_SECRET` (use `openssl rand -base64 32`)
- [ ] Update `BETTER_AUTH_URL` to your domain
- [ ] Configure production database
- [ ] Enable email verification if needed
- [ ] Set up error monitoring
- [ ] Configure analytics (optional)
