# TeeStore - Premium T-Shirt E-commerce Platform

A full-featured t-shirt e-commerce store built with the T3 stack (Next.js, TypeScript, tRPC, Prisma, PostgreSQL, and Better Auth).

## 🚀 Features

### Core E-commerce Functionality
- **Product Catalog**: Browse premium t-shirts with filtering by category
- **Product Details**: Detailed product pages with size/color variant selection
- **Shopping Cart**: Add items, update quantities, manage cart
- **Checkout Process**: Complete order placement with shipping information
- **Order Management**: View order history and detailed order tracking
- **User Authentication**: Secure sign-up/sign-in with Better Auth

### Product Features
- **Multiple Variants**: Size (XS-XXL) and color options for each product
- **Stock Management**: Real-time inventory tracking
- **Categories**: Organized by Graphic Tees, Plain Tees, Vintage, Sports
- **Featured Products**: Highlighted items on homepage
- **Search & Filter**: Browse by category with dynamic filtering

### Technical Features
- **Type-Safe API**: End-to-end type safety with tRPC
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth integration
- **Responsive Design**: Mobile-friendly Tailwind CSS
- **Server-Side Rendering**: Optimized performance with Next.js 15

## 📦 Database Schema

### Core Models
- **User**: Customer accounts with Better Auth integration
- **Product**: T-shirt products with descriptions and pricing
- **ProductVariant**: Size/color combinations with stock tracking
- **Category**: Product organization (Graphic Tees, Plain Tees, etc.)
- **CartItem**: Shopping cart functionality
- **Order & OrderItem**: Complete order management system

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Docker
- **ORM**: Prisma
- **API**: tRPC for type-safe APIs
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS
- **State Management**: React Query (via tRPC)

## 📱 Application Pages

### Public Pages
- **`/`** - Homepage with featured products and categories
- **`/products`** - Product listing with category filtering
- **`/products/[slug]`** - Individual product details with variant selection
- **`/sign-in`** - User authentication
- **`/sign-up`** - User registration

### Protected Pages (Require Authentication)
- **`/cart`** - Shopping cart management
- **`/checkout`** - Order placement with shipping info
- **`/orders`** - Order history listing
- **`/orders/[id]`** - Detailed order tracking

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

## 🛍️ User Workflows

### Shopping Flow
1. **Browse Products**: Homepage → Categories → Product Listing
2. **Product Selection**: Product Detail → Size/Color Selection
3. **Add to Cart**: Quantity Selection → Add to Cart
4. **Checkout**: Cart Review → Shipping Info → Place Order
5. **Order Tracking**: Order Confirmation → Order History

### Sample Data Included
- **4 Categories**: Graphic Tees, Plain Tees, Vintage, Sports
- **8 Products**: Variety of t-shirt designs with realistic descriptions
- **Product Variants**: Multiple size/color combinations for each product
- **Stock Levels**: Randomized inventory for realistic testing

## 🔧 Quick Start Commands

```bash
# Full setup (recommended)
cd starter-template
pnpm install
pnpm db:setup     # Unix/Linux/MacOS
# OR
pnpm db:setup:win # Windows
pnpm dev

# Visit http://localhost:4000
```

## 🐛 Troubleshooting

**Port Already in Use**:
```bash
PORT=3001 pnpm dev
```

**Database Issues**:
```bash
docker compose down
docker compose up -d postgres
```

---

**Happy Shopping! 👕🛒**

For more information about the T3 stack, visit [create.t3.gg](https://create.t3.gg).
