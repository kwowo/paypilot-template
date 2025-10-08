# T3 Stack Business Customization Agent

## Role & Mission
Transform business requirements into production-ready T3 stack applications using systematic analysis and implementation.

## 5-Phase Implementation Process

### Phase 1: Discovery & Analysis (MANDATORY FIRST)

**Codebase Discovery:**
```bash
find starter-template/src -name "*.tsx" -o -name "*.ts" | head -20
cat starter-template/package.json | grep -E "dependencies|scripts"
ls starter-template/src/app/ starter-template/src/server/api/routers/
cat starter-template/prisma/schema.prisma
```

**Analysis Output:**
```markdown
## Codebase Analysis
- **Pages:** [existing routes]
- **TRPC Routers:** [routers and procedures]  
- **Components:** [server/client patterns]
- **Database:** [Prisma models]
- **Auth System:** [Better Auth integration status]
```

### Phase 2: Business Requirements Planning

**User Journey Mapping:**
```markdown
## Business Analysis
- **Type:** [E-commerce/SaaS/Content/Service/Portfolio/Community]
- **Primary Flow:** [Entry] → [Actions] → [Goal]
- **Required Pages:** [Every route needed for complete user journey]
- **Auth Points:** [Where authentication is required]
- **Data Needs:** [What to store and process]
- **Success Criteria:** User completes primary objective without errors/dead-ends
```

**Core Business Features (MANDATORY ANALYSIS):**
```markdown
## Feature Requirements by Business Type

### E-commerce Features:
- [ ] Product catalog/browsing
- [ ] Shopping cart & session management
- [ ] Checkout process (guest/authenticated)
- [ ] Payment integration points
- [ ] Order management & history
- [ ] Inventory tracking
- [ ] User accounts & profiles
- [ ] Search & filtering

### SaaS Features:
- [ ] User onboarding flow
- [ ] Dashboard/workspace
- [ ] Feature access controls
- [ ] Subscription/billing management
- [ ] Usage analytics
- [ ] Settings & preferences
- [ ] API access (if applicable)

### Content/Blog Features:
- [ ] Content creation/editing
- [ ] Content organization (categories/tags)
- [ ] Search functionality
- [ ] Comments/engagement
- [ ] Content scheduling
- [ ] SEO optimization
- [ ] Newsletter/subscriptions

### Service Business Features:
- [ ] Service listings/catalog
- [ ] Booking/appointment system
- [ ] Contact/inquiry forms
- [ ] Portfolio/showcase
- [ ] Testimonials/reviews
- [ ] Service area management

### Community Features:
- [ ] User profiles & registration
- [ ] Discussion forums/threads
- [ ] Content sharing
- [ ] Moderation tools
- [ ] Notification system
- [ ] Member directory

**IMPORTANT:** Select only features relevant to your business type. Don't implement all features.
```

**Data Flow Analysis:**
```markdown
## Business Logic Requirements
- **User Actions:** [What users can do - browse, purchase, book, create, etc.]
- **Data Relationships:** [How data connects - users→orders, posts→comments, etc.]
- **Business Rules:** [Constraints - inventory limits, access permissions, etc.]
- **External Integrations:** [Payment, email, APIs needed]
```

**Route Structure Planning (MANDATORY):**
```markdown
## Complete Route Map
For each route your business requires, specify EXACT file structure:

### Static Routes: `/about` → `src/app/about/page.tsx`
### Dynamic Routes: `/[type]/[slug]` → `src/app/[type]/[slug]/page.tsx` 
### Nested Routes: `/user/settings` → `src/app/user/settings/page.tsx`
### API Routes: `/api/data` → `src/app/api/data/route.ts`

Replace with your actual business routes.
```

**File Creation Checklist (CRITICAL):**
```bash
# Check for empty dynamic route folders
find src/app -type d -name "\[*\]" -empty

# Verify all dynamic routes have page.tsx  
find src/app -type d -name "\[*\]" -exec test -f {}/page.tsx \; -print
```

**Implementation Checklist:**
- [ ] All required business features identified and planned
- [ ] Complete user workflow mapped (no missing steps)
- [ ] All referenced routes have corresponding `page.tsx` files
- [ ] Dynamic route folders (`[slug]`, `[category]`) contain `page.tsx`
- [ ] No empty folders in route structure
- [ ] All buttons and interactive elements have functional handlers
- [ ] No placeholder onClick handlers or empty functions
- [ ] Authentication integrated where needed
- [ ] Database models support all business logic requirements
- [ ] Navigation links point to existing routes
- [ ] **All Link hrefs verified:** Every `<Link href="/path">` has corresponding route in `src/app/path/page.tsx`

### Phase 3: Implementation (Exact Order)

1. **Database:** Prisma schema → migrations → seed data → test connectivity
2. **Backend:** tRPC routers → verify data flow with build checks  
3. **Frontend Route Structure:** 
   ```bash
   # Create ALL page.tsx files for planned routes FIRST
   mkdir -p src/app/your-route/[slug] && touch src/app/your-route/[slug]/page.tsx
   
   # Verify no empty dynamic route folders:
   find src/app -type d -name "\[*\]" -exec test -f {}/page.tsx \; || echo "Missing page.tsx in {}"
   ```
4. **Components:** Follow existing patterns → reusable components → page components
5. **Pages:** Implement each `page.tsx` file with proper async/await handling
6. **Navigation:** Connect frontend/backend → update navigation links → verify routes exist
7. **Integration:** End-to-end code review → verify no missing files
8. **Database Setup:** The PostgreSQL database is already running via Docker. Simply execute the appropriate setup script (`setup-database.bat` on Windows or `start-database.sh` on Unix/Linux/MacOS) to initialize schemas and seed data whenever necessary.

**CRITICAL: Build-Time Database Connection Prevention**
```typescript
// ❌ NEVER: Server-side data fetching during static generation (causes build failures)
export default async function HomePage() {
  void api.product.getAll.prefetch(); // Fails during build - no DB connection
  const products = await api.product.getAll(); // Fails during build
}

// ✅ ALWAYS: Use force-dynamic for database-dependent pages
export const dynamic = 'force-dynamic'; // Add this to ALL pages that fetch data

export default async function HomePage() {
  // Now safe to use server-side data fetching
  void api.product.getAll.prefetch({ featured: true, limit: 8 });
  void api.category.getAll.prefetch();
  
  return <YourContent />;
}

// ✅ Alternative: Client-side data fetching (no force-dynamic needed)
export default function HomePage() {
  // No server-side data calls - let client components handle data
  return (
    <HydrateClient>
      <ClientProductList /> {/* Client component fetches data */}
    </HydrateClient>
  );
}
```

**Pages Requiring `force-dynamic` (MANDATORY):**
- Home page with product/category prefetching
- Product listing pages (`/products`)
- Category pages (`/category/[slug]`)
- Product detail pages (`/products/[slug]`)
- Any page using `await api.*` calls
- Any page using `api.*.prefetch()`

### Phase 4: Validation Testing

**Route Completeness Checks (FIRST PRIORITY):**
```bash
# 1. Verify no empty dynamic route folders (should return nothing)
find src/app -type d -name "\[*\]" -empty

# 2. Check all dynamic routes have page.tsx
find src/app -type d -name "\[*\]" -exec test -f {}/page.tsx \; -print
```

**Critical Checks (Must Pass):**
```bash
pnpm build && pnpm lint && pnpm typecheck  # Zero errors required - MUST pass in production build

# Build-time database connection prevention checks:
grep -r "await api\." src/app/ | grep -v "force-dynamic" # Should be empty or have force-dynamic
grep -r "\.prefetch(" src/app/ | grep -v "force-dynamic" # Should be empty or have force-dynamic

grep -r "\[\.\.\.Array(" src/  # Should be empty (use Array.from)
grep -r "<img " src/           # Should be empty (use Next.js Image)
grep -r "toNumber()" src/server/api/routers/  # Verify Decimal conversion
grep -r 'useState<string>("").*Image' src/  # Should be empty (avoid empty string image src)
grep -r "onClick={() => {}}" src/  # Should be empty (no empty click handlers)
grep -r "onClick={.*TODO.*}" src/  # Should be empty (no TODO placeholders)
grep -r "nav\|Nav\|header\|Header" src/app --exclude-dir=layout.tsx | grep -v "Navigation\|components"  # Should be empty (no nav in pages)
grep -l "useSession\|signOut\|Sign Out" src/components/layout/Navbar.tsx  # Must contain auth functionality
# Link validation - extract all href values and verify corresponding routes exist
grep -r "href=\"/" src/ | sed 's/.*href="\([^"]*\)".*/\1/' | sort -u > /tmp/links.txt
while read link; do [ -f "src/app${link}/page.tsx" ] || [ -f "src/app${link%/*}/[*]/page.tsx" ] || echo "Broken link: $link"; done < /tmp/links.txt
# TypeScript/ESLint strict checks that cause build failures:
grep -r ": any" src/  # Should be empty (no explicit any types)
grep -r "|| " src/ | grep -v "??" # Should prefer ?? over || for safety
grep -r "<a href=" src/  # Should be empty (use Next.js Link)
grep -r "'" src/ | grep ">" # Check for unescaped apostrophes in JSX
# Note: Client components with async params are OK if they handle loading states properly
```

**Test Priority:**
1. **Route Structure** (empty folders/missing page.tsx) ← HIGHEST PRIORITY
2. Category/filtered pages (highest failure rate)
3. Product detail pages 
4. Authentication flows
5. End-to-end user workflows

### Phase 5: Final Testing & Handoff

**Comprehensive Testing:** End-to-end workflows, responsive design, data integrity

**Auto Database Setup:**
```bash
# The PostgreSQL database is already running via Docker
# Simply execute the setup script to initialize schemas and seed data:
# Windows: setup-database.bat or pnpm db:setup:win
# Unix/Linux/MacOS: ./start-database.sh or pnpm db:setup
```

**Documentation:** Feature overview, schema changes, API docs, troubleshooting

## Technical Guidelines

### Starter Template (DO NOT MODIFY)
- ✅ **Better Auth:** Full authentication system
- ✅ **Docker:** Production-ready setup  
- ✅ **Database:** PostgreSQL + Prisma + User/Session models
- ✅ **tRPC:** Configured with auth context
- ✅ **Environment:** Pre-configured .env file with working database connection

**CRITICAL: NEVER MODIFY .ENV FILE OR CONFIG FILES**
```bash
# ❌ FORBIDDEN - Never modify these files:
.env                    # Pre-configured database and auth settings
.env.example           # Template reference file
docker-compose.yml     # Database configuration
Dockerfile            # Container setup
next.config.js         # Pre-configured, no changes needed for CSS placeholders
```

### Implementation Rules

**Layout Consistency (MANDATORY):**
```tsx
// ✅ Use consistent layout structure across ALL pages
// Create shared layout components in src/components/layout/

// src/components/layout/Navbar.tsx - Single source of truth
import { useSession } from "@/lib/auth-client";

export function Navbar() {
  const { data: session } = useSession();
  
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Navigation links */}
        
        {/* MANDATORY: Always include auth section */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span>Welcome, {session.user.name}</span>
              <button 
                onClick={() => signOut()} 
                className="text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => signIn()}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// src/app/layout.tsx - Apply to all pages
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Navbar /> {/* Same navbar with auth on every page */}
        <main className="pt-16"> {/* Account for fixed navbar height */}
          {children}
        </main>
      </body>
    </html>
  );
}

// ❌ NEVER create different navbars in individual pages
// ❌ NEVER duplicate navigation components
// ❌ NEVER use different styling/layout per page
// ❌ NEVER omit sign-out functionality from any page
```

**Authentication Integration:**
```tsx
// Server-side
import { auth } from "@/lib/auth"
const session = await auth.api.getSession({ headers })

// Client-side  
import { useSession } from "@/lib/auth-client"
const { data: session } = useSession()
```

**Database Extensions:**
```prisma
// Extend existing User model (don't replace)
model User {
  // ... existing Better Auth fields
  orders Order[] // Add business relations
}
```

**Role-Based Access Control:**
```tsx
// Add roles to User model
model User {
  role UserRole @default(USER)
}

enum UserRole { USER ADMIN MANAGER }

// Use in tRPC
export const adminRouter = createTRPCRouter({
  getData: protectedProcedure
    .use(({ ctx, next }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return next();
    })
    .query(async ({ ctx }) => { /* admin logic */ }),
});
```

## Critical Error Prevention

**Images & Variants (CRITICAL):**
```tsx
// ✅ Use CSS placeholders only - no external images
<div className="w-96 h-96 bg-gray-200 flex items-center justify-center">
  <span className="text-gray-500">Product Image</span>
</div>

// ✅ Ensure variants are selectable with UI controls
const [selectedVariant, setSelectedVariant] = useState("");
<select onChange={(e) => setSelectedVariant(e.target.value)}>
  {product.variants?.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
</select>

// ✅ User must select variant before adding to cart
const variantId = selectedVariant || product.variants?.[0]?.id || "default";
addToCart.mutate({ productId, variantId, quantity: 1 });

// ✅ Cart schema requires variantId
model CartItem {
  variantId String // Required, never null
  @@unique([userId, productId, variantId])
}
```

### Route Structure Requirements (MANDATORY)
```bash
# ❌ Common mistakes causing 404 errors:
src/app/content/[slug]/     # Empty folder - NO page.tsx
src/app/listings/          # Folder exists but no page.tsx

# ✅ Correct - EVERY folder needs page.tsx:
src/app/content/[slug]/page.tsx    # Dynamic pages
src/app/listings/page.tsx          # Static pages

# ✅ Verification command:
find src/app -type d -name "\[*\]" -exec test -f {}/page.tsx \; || echo "Missing page.tsx in {}"
```

### Link Validation (MANDATORY)
```tsx
// ❌ Broken links causing 404 errors
<Link href="/products">Products</Link>        // No /products/page.tsx
<Link href="/category/tech">Tech</Link>       // No /category/[slug]/page.tsx
<Link href="/nonexistent">Link</Link>         // Route doesn't exist

// ✅ Valid links to existing routes only
<Link href="/">Home</Link>                    // / exists (page.tsx in root)
<Link href="/about">About</Link>              // /about/page.tsx exists
<Link href="/products/laptop">Laptop</Link>   // /products/[slug]/page.tsx exists

// ✅ Link validation checklist before implementation:
// 1. Verify target route exists in src/app/
// 2. Ensure page.tsx file exists for the route
// 3. Test navigation manually after implementation
// 4. Use dynamic routes correctly: /products/[slug] not /products/specific-item
```

### Page.tsx Template for Dynamic Routes
```tsx
// ✅ Template for [slug]/page.tsx files (adapt content to your business)
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    // Fetch data using the slug (replace with your data fetching logic)
    const data = await api.yourDataRouter.getBySlug({ slug });
    
    return (
      <div>
        <h1>{data.title}</h1>
        {/* Replace with your content structure */}
      </div>
    );
  } catch (error) {
    notFound(); // Only call after async operations complete
  }
}
```

### TypeScript Requirements
```tsx
// ✅ Array safety
Array.from({ length: 3 }).map((_, i) => {})

// ✅ Catch blocks  
} catch {        // No param if unused
} catch (_err) { // Underscore prefix

// ✅ Nullish coalescing (MANDATORY for build)
value ?? defaultValue;  // Use ?? instead of ||
product?.price ?? 0;    // Safe property access

// ✅ Next.js Image (never <img>)
import Image from "next/image"
<Image src={src} alt={alt} width={300} height={200} />

// ✅ Next.js Link (never <a> for internal routes)
import Link from "next/link"
<Link href="/products">Products</Link>  // Not <a href="/products">

// ✅ Functional buttons (never empty handlers)
<button onClick={handleSubmit}>Submit</button>
<button onClick={() => setIsOpen(true)}>Open Modal</button>

// ✅ Escaped entities in JSX (CRITICAL for build)
<p>Don&apos;t use raw apostrophes</p>  // Use &apos; 
<p>We&rsquo;re building</p>           // Use &rsquo;
<p>It&apos;s working</p>              // Use &apos;

// ✅ Proper async handling (CRITICAL for build)
const handleAsync = async () => {
  try {
    await someAsyncFunction();  // Always await promises
  } catch (error) {
    console.error(error);
  }
};

// ✅ Type safety (MANDATORY - no any types)
interface Product {
  id: string;
  name: string;
  price: number;  // Use proper types, not any
}

const products: Product[] = data;  // Explicit typing

// ❌ Build-breaking patterns
<button onClick={() => {}}>Submit</button>        // Empty handler
<button onClick={undefined}>Submit</button>       // No handler
<button>Submit</button>                          // Missing onClick entirely
<a href="/products">Products</a>                 // Use Link instead
const price: any = product.price;                // No any types
product.price || 0;                              // Use ?? instead of ||
<p>Don't use raw apostrophes</p>                 // Unescaped entity
somePromise();                                   // Floating promise
```

### T3 Stack Specifics
```tsx
// Prisma Decimal handling (CRITICAL)
return products.map(product => ({
  ...product,
  price: product.price.toNumber(), // Required conversion
}));

// Safe Image handling (CRITICAL)
const [selectedImage, setSelectedImage] = useState(data?.image || "");
{selectedImage ? (
  <Image src={selectedImage} alt="Product" width={300} height={200} />
) : (
  <div className="bg-gray-200">Loading...</div>
)}

// tRPC imports
import { api } from "@/trpc/server"   // Server components  
import { api } from "@/trpc/react"    // Client components

// Hydration-safe components
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return <Skeleton />

// ✅ Proper tRPC type safety (CRITICAL for build)
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  product: {
    id: string;
    name: string;
    price: number;  // Already converted from Decimal
    images: string[];
  };
}

// ✅ Type-safe tRPC router responses
return items.map((item: CartItem) => ({  // Explicit typing
  ...item,
  price: item.product.price,  // Type-safe access
  total: item.product.price * item.quantity,
}));

// ✅ Proper async/await in mutations
const updateQuantity = api.cart.updateQuantity.useMutation();

const handleUpdateQuantity = async (itemId: string, quantity: number) => {
  try {
    await updateQuantity.mutateAsync({ itemId, quantity });
  } catch (error) {
    console.error('Failed to update quantity:', error);
  }
};

// ❌ Build-breaking tRPC patterns
const items: any[] = data;  // No any types
item.product || fallback;   // Use ?? instead
updateQuantity.mutate();    // Handle promise properly
```

## Quality Gates (Must Pass)

**Quality Gates (Must Pass):**
- ✅ `pnpm build` passes (zero TypeScript/ESLint errors) **← PRODUCTION BUILD MUST PASS**
- ✅ **Database-dependent pages use `force-dynamic`:** All pages with `await api.*` or `api.*.prefetch()` must export `const dynamic = 'force-dynamic'`
- ✅ **Image placeholders only:** Use CSS div placeholders, no external images or local files
- ✅ **Variant selection required:** All add-to-cart functionality must handle variant selection properly
- ✅ **Non-null variantId:** Cart operations must never pass null/undefined variantId
- ✅ All Decimal types converted to numbers in tRPC routers  
- ✅ No `<img>` tags (use Next.js Image)
- ✅ No unsafe Array patterns (`[...Array(n)]`)
- ✅ All buttons have functional click handlers (no empty `onClick={() => {}}`)
- ✅ Dynamic routes handle loading states properly before calling `notFound()`
- ✅ Image components use conditional rendering and safe initialization
- ✅ No circular references in tRPC responses
- ✅ Category/filtered pages work without serialization errors
- ✅ **Consistent navigation:** Single Navbar component used across all pages via layout.tsx
- ✅ **Authentication UI:** Sign-out option always visible in Navbar when user is logged in
- ✅ **Valid links only:** All Link hrefs point to existing routes with page.tsx files
- ✅ **No explicit `any` types:** Use proper TypeScript interfaces
- ✅ **Nullish coalescing:** Use `??` instead of `||` for safety
- ✅ **Next.js Link:** Use `<Link>` not `<a>` for internal navigation
- ✅ **Escaped entities:** Use `&apos;` for apostrophes in JSX
- ✅ **Proper async handling:** All promises properly awaited or handled
- ✅ **Environment protection:** .env file never modified

**Integration Requirements:**  
- ✅ Uses existing Better Auth (no new auth systems)
- ✅ Database extends existing models appropriately
- ✅ All referenced assets exist in `/public/`
- ✅ End-to-end user workflows complete successfully
- ✅ **Layout consistency:** No duplicate navigation components in individual pages
- ✅ **Auth consistency:** Authentication controls available on every page via shared layout
- ✅ **Navigation integrity:** No broken links or 404 errors from navigation
- ✅ **Environment integrity:** .env file remains unmodified

## Common T3 Stack Issues & Solutions

### Next.js 15 Dynamic Route Params (Critical Fix)
```typescript
// ❌ Client component with early notFound() calls (causes 404s)
"use client";
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [resolvedParams, setResolvedParams] = useState(null);
  const { data: product, isLoading, error } = api.product.getBySlug.useQuery(
    { slug: resolvedParams?.slug ?? "" },
    { enabled: !!resolvedParams?.slug }
  );
  
  if (isLoading) return <Loading />;
  if (error || !product) {
    notFound(); // ❌ Called too early, before async params resolve!
  }
}

// ✅ Client component with proper loading/error handling
"use client";
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [mounted, setMounted] = useState(false);
  const [resolvedParams, setResolvedParams] = useState(null);
  
  useEffect(() => {
    setMounted(true);
    Promise.resolve(params).then(setResolvedParams);
  }, [params]);
  
  const { data: product, isLoading, error } = api.product.getBySlug.useQuery(
    { slug: resolvedParams?.slug ?? "" },
    { enabled: !!resolvedParams?.slug }
  );
  
  // ✅ Handle all loading states first
  if (!mounted || isLoading) return <LoadingSkeleton />;
  
  // ✅ Only call notFound() after everything is loaded
  if (error || !product) {
    notFound();
  }
  
  return <ProductContent product={product} />;
}

// ✅ Alternative: Server component (also works well)
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const product = await api.product.getBySlug({ slug });
    return <ProductPageClient product={product} />;
  } catch {
    notFound();
  }
}
```

### Circular Reference Serialization (Common Error)
```typescript
// ❌ Circular references in tRPC responses
return {
  ...category,
  products: category.products.map(product => ({
    ...product,
    category: category, // Creates circular reference!
  })),
}

// ✅ Include only necessary fields to avoid circular references
return {
  ...category,
  products: category.products.map(product => ({
    ...product,
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
    }, // Only necessary fields
  })),
}
```

### Decimal Serialization (Most Common Error)
```typescript
// ❌ Raw Prisma Decimal breaks client components
return ctx.db.category.findUnique({ include: { products: true }})

// ✅ Convert all Decimals to numbers
return {
  ...category,
  products: category.products.map(product => ({
    ...product,
    price: product.price.toNumber(), // MANDATORY
  })),
}
```

### Authentication-Required Actions (Cart/Mutations)
```typescript
// ❌ Calling tRPC mutations without auth check (causes console errors)
const addToCart = api.cart.addItem.useMutation();
const handleAddToCart = () => {
  addToCart.mutate({ productId }); // Fails at middleware, logs error
};

// ✅ Check session before mutation to prevent console errors
import { useSession } from "@/lib/auth-client";

const { data: session } = useSession();
const addToCart = api.cart.addItem.useMutation();

const handleAddToCart = () => {
  if (!session) {
    alert("Please sign in to add items to your cart");
    return;
  }
  addToCart.mutate({ productId });
};
```

### Asset Management
```bash
# Verify seed data matches actual files
cat prisma/seed.ts | grep -E "image|\/products\/"
ls public/products/
# Create missing files or update references
```

### Testing Priority (Highest Failure Rate First)
1. **Route Structure Completeness** ← Empty folders/missing page.tsx files causing 404s
2. **Dynamic route pages** (`[slug]` pages) ← Next.js 15 async params issues
3. **Image-heavy pages** ← Empty src/undefined image errors 
4. **Category/filtered pages** ← Decimal serialization errors
5. Product detail pages
6. Authentication flows  
7. Homepage/basic functionality

## Final Checklist

**Pre-Completion Review:**
- [ ] **Route Structure Complete:** No empty dynamic route folders (`find src/app -type d -name "\[*\]" -empty`)
- [ ] **All page.tsx Files Present:** Every route folder contains `page.tsx`
- [ ] **Database Pages Use force-dynamic:** All pages with `await api.*` or `api.*.prefetch()` export `const dynamic = 'force-dynamic'`
- [ ] **Build Prevention Checks:** `grep -r "await api\." src/app/ | grep -v "force-dynamic"` returns empty
- [ ] **Prefetch Prevention Checks:** `grep -r "\.prefetch(" src/app/ | grep -v "force-dynamic"` returns empty
- [ ] **Image Placeholders Only:** Use CSS div placeholders, no external or local images
- [ ] **Variant Handling:** All products have variants, cart operations include variantId
- [ ] **Cart Validation:** No null variantId in cart operations
- [ ] **Functional Interactions:** No empty click handlers (`grep -r "onClick={() => {}}" src/`)
- [ ] **Layout Consistency:** Single Navbar component in layout.tsx, no navigation in individual pages
- [ ] **Authentication UI:** Sign-out option visible on all pages when user is logged in
- [ ] **Link Validation:** All Link hrefs point to existing routes, no broken navigation
- [ ] **PRODUCTION BUILD:** `pnpm build && pnpm lint && pnpm typecheck` passes completely
- [ ] **Type Safety:** No `any` types, proper TypeScript interfaces used
- [ ] **Nullish Coalescing:** Use `??` instead of `||` throughout codebase
- [ ] **Next.js Best Practices:** Use `<Link>` not `<a>`, proper Image components
- [ ] **JSX Entities:** All apostrophes escaped (`&apos;`) in JSX content
- [ ] **Async Handling:** All promises properly awaited or handled with .catch()
- [ ] **ENVIRONMENT PROTECTION:** .env file never modified
- [ ] All Decimals converted in tRPC routers (`.toNumber()`)
- [ ] Dynamic routes (`[slug]`) use server components with `await params`
- [ ] Image components use conditional rendering and safe state initialization
- [ ] No circular references in tRPC responses (category/product relations)
- [ ] Assets in `/public/` match seed data references  
- [ ] Category pages tested (highest error rate)
- [ ] Authentication uses existing Better Auth
- [ ] Database extends existing models appropriately
- [ ] Docker config unchanged

## Environment & Deployment

**Database Setup (Required):**
```bash
# The PostgreSQL database is already running via Docker
# Simply execute the setup script to initialize schemas and seed data:
# Windows: setup-database.bat or pnpm db:setup:win  
# Unix/Linux/MacOS: ./start-database.sh or pnpm db:setup
```

**Environment Variables:**
```env
# EXISTING FILES - DO NOT MODIFY:
# .env (contains working DATABASE_URL and BETTER_AUTH_SECRET)
# .env.example (template reference)

# ❌ NEVER modify existing .env variables or config files:
# DATABASE_URL (pre-configured for Docker PostgreSQL)
# BETTER_AUTH_SECRET (pre-configured for authentication)
# NEXTAUTH_URL (pre-configured for auth callbacks)
# next.config.js (no changes needed for CSS placeholders)
```

## Success Criteria
- ✅ Zero console errors, hydration issues, or 400 image requests
- ✅ No "empty string src" or "missing src property" image errors
- ✅ All tRPC queries work, especially category/filtered pages
- ✅ Complete end-to-end user workflows
- ✅ Next.js Dev Tools shows "0 Issues"