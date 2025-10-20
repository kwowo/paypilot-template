# TeeShop - T-Shirt E-Commerce Store

A fully functional t-shirt e-commerce website built with the T3 stack (Next.js, tRPC, Prisma, Better Auth, PostgreSQL).

## ✨ Features

### Customer Features
- 🏠 **Home Page** - Featured products and category browsing
- 👕 **Product Catalog** - Browse all t-shirts with filtering
- 📦 **Product Details** - Detailed product pages with size/color selection
- 🏷️ **Categories** - Shop by category (Basics, Graphic, Premium, Athletic, etc.)
- 🛒 **Shopping Cart** - Add/remove/update items
- 💳 **Checkout** - Complete checkout with PayPal integration
- 📋 **Order History** - View past orders
- 👤 **Authentication** - Secure sign-in/sign-up with Better Auth

### Technical Features
- ⚡ Next.js 15 with App Router
- 🔒 Better Auth integration
- 🗄️ PostgreSQL database with Prisma ORM
- 🚀 tRPC for type-safe API calls
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- ✅ TypeScript with strict type checking

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── products/
│   │   ├── page.tsx                # All products listing
│   │   └── [slug]/
│   │       ├── page.tsx            # Product detail (server)
│   │       └── product-detail-client.tsx
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx            # Category products
│   ├── checkout/
│   │   └── page.tsx                # Cart & checkout
│   ├── orders/
│   │   └── page.tsx                # Order history
│   └── layout.tsx                  # Root layout with navbar
├── components/
│   ├── layout/
│   │   └── navbar.tsx              # Global navigation
│   └── products/
│       ├── product-card.tsx        # Product card component
│       └── product-grid.tsx        # Product grid layout
├── server/
│   └── api/
│       └── routers/
│           ├── product.ts          # Product tRPC router
│           ├── cart.ts             # Cart operations
│           ├── orders.ts           # Order management
│           └── paypal.ts           # Payment processing
└── lib/
    ├── auth.ts                     # Server-side auth
    └── auth-client.ts              # Client-side auth
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Docker (for PostgreSQL)

### Installation

1. **Start the database and seed data:**
   ```bash
   # On Unix/Linux/macOS:
   ./start-database.sh
   
   # On Windows:
   setup-database.bat
   ```
   
   This script:
   - Starts PostgreSQL via Docker
   - Runs Prisma migrations
   - Seeds the database with 6 t-shirt products

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4000`

## 📊 Database Schema

### Products
- 6 t-shirt products with various categories
- Each product has multiple color and size variants
- Price management with sale pricing support
- Stock tracking per product

### Product Categories
- `basics` - Classic Cotton Tee
- `graphic` - Graphic Print Tee
- `premium` - Premium V-Neck Tee
- `casual` - Pocket Tee Collection
- `long-sleeve` - Striped Long Sleeve Tee
- `athletic` - Athletic Performance Tee

### Variants
Each product includes:
- **Colors:** Various options (White, Black, Navy, Gray, etc.)
- **Sizes:** S, M, L, XL

## 🛣️ Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with featured products |
| `/products` | All products listing |
| `/products/[id]` | Product detail page |
| `/category/[slug]` | Products by category |
| `/checkout` | Shopping cart & checkout |
| `/orders` | Order history (auth required) |
| `/sign-in` | Sign in page |
| `/sign-up` | Sign up page |

## 🔧 Key Scripts

```bash
# Development
pnpm dev              # Start dev server

# Database
pnpm db:setup         # Setup database (Unix/Linux/macOS)
pnpm db:setup:win     # Setup database (Windows)
pnpm db:seed          # Re-seed database with products
pnpm db:studio        # Open Prisma Studio

# Build & Deploy
pnpm build            # Build for production
pnpm start            # Start production server
pnpm typecheck        # Run TypeScript checks
pnpm lint             # Run ESLint
```

## 🎯 User Flow

1. **Browse Products**
   - View featured products on home page
   - Browse all products or filter by category
   - Click on any product to view details

2. **Add to Cart**
   - Select color and size on product detail page
   - Choose quantity
   - Click "Add to Cart" (requires sign-in)

3. **Checkout**
   - Review cart items
   - Update quantities or remove items
   - Enter shipping information
   - Complete payment via PayPal

4. **View Orders**
   - Access order history from navbar
   - View order details and status

## 🔐 Authentication

The app uses Better Auth for authentication:
- Email/password authentication
- Secure session management
- Protected routes for cart and orders
- Navbar shows user status and sign out option

## 🎨 Customization

### Adding New Products
Edit `prisma/seed.ts` and run:
```bash
pnpm db:seed
```

### Modifying Styles
All components use Tailwind CSS classes. The design system includes:
- Blue primary color scheme
- Responsive grid layouts
- Hover effects and transitions

### Adding Features
1. Create new tRPC router in `src/server/api/routers/`
2. Add to root router in `src/server/api/root.ts`
3. Use in components via `api.yourRouter.yourProcedure.useQuery()`

## ✅ Quality Checks Passed

- ✅ TypeScript compilation (zero errors)
- ✅ ESLint (zero warnings)
- ✅ Production build successful
- ✅ All dynamic routes have page.tsx files
- ✅ No empty folders in route structure
- ✅ Database setup and seeding working
- ✅ Authentication integrated
- ✅ Cart functionality working
- ✅ Responsive design implemented

## 📝 Environment Variables

The `.env` file is pre-configured with:
- `DATABASE_URL` - PostgreSQL connection
- `BETTER_AUTH_SECRET` - Auth secret key
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Auth API URL

**⚠️ Important:** Do not modify the `.env` file - it's already configured correctly.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Restart the database
docker compose down
./start-database.sh
```

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Prisma Issues
```bash
# Regenerate Prisma client
pnpm prisma generate
```

## 🚀 Deployment

The app is production-ready and can be deployed to:
- Vercel (recommended for Next.js)
- Railway
- Render
- Any Node.js hosting platform

Remember to:
1. Set environment variables on your hosting platform
2. Use a production PostgreSQL database
3. Run migrations: `pnpm prisma migrate deploy`

## 📚 Tech Stack

- **Framework:** Next.js 15.2.3
- **Language:** TypeScript 5.8
- **Database:** PostgreSQL + Prisma
- **API:** tRPC
- **Auth:** Better Auth
- **Styling:** Tailwind CSS
- **Payments:** PayPal

## 🎉 What's Working

✨ **Complete e-commerce functionality:**
- Product browsing and filtering
- Category navigation
- Size and color selection
- Shopping cart management
- Secure checkout process
- Order tracking
- User authentication

All core features are implemented and tested!
