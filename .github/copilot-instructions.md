# AI Agent Instructions - MALLV2LECTURA

## Project Overview

**MALLV2LECTURA** is a Next.js e-commerce & service booking platform (v0.app-generated) for a multi-store shopping center ("Nexus Center mall"). The system integrates stores with external service APIs, manages products/services, appointments, payments, and user orders.

**Key Tech Stack:**
- Next.js 14+ (App Router, TypeScript)
- Supabase (PostgreSQL auth + database)
- Radix UI primitives for components
- Python backend (Nexus API) for availability/stock validation
- External store APIs (per-store integrations)

## Architecture Patterns

### Multi-Layer API Integration Pattern
The project uses **three API tiers** for scalability across store integrations:

1. **Next.js Route Handlers** (`/app/api/stores/[slug]/*`) - Main entry point
2. **Python Nexus Backend** (NEXT_PUBLIC_API_URL) - Orchestrates external API calls
3. **External Store APIs** - Per-store service/product endpoints

**Example Flow (Service Availability):**
- Frontend → `/api/stores/[slug]/availability?date=...&serviceId=...`
- Route Handler maps slug to store_id, translates service IDs via `SERVICE_ID_MAP`
- Calls Nexus API `/dispo_servicio/` with translated IDs
- Nexus validates against external API (`TARGET_API_URL`)
- Results merged with local Supabase appointment bookings

**Critical Files:**
- `app/api/stores/[slug]/availability/route.ts` - Availability orchestration with ID translation
- `app/api/stores/[slug]/service/route.ts` - Service catalog aggregation
- `lib/api/services.ts` - External API fetch wrapper
- `lib/api/availability.ts` - Stock verification logic

### Database Schema (Supabase)
Key tables used:
- `stores` (slug, store_id, name) - Store metadata with external API IDs
- `profiles` (id, role) - User roles (admin, super_admin, user)
- `appointments` (store_id, service_external_id, appointment_date, appointment_time, status)
- `products`, `cart_items`, `orders` - E-commerce data

### ID Translation Strategy
**Problem:** External APIs use different ID formats than Supabase (e.g., "SPA-SERV-001" vs "1").

**Solution:** Hardcoded lookup maps in route handlers:
```typescript
// app/api/stores/[slug]/availability/route.ts
const STORE_ID_MAP: Record<string, number> = { "urban-style": 1, ... }
const SERVICE_ID_MAP: Record<string, string> = { "1": "SPA-SERV-001", ... }
```
Update these maps when adding new stores or services. ⚠️ **TODO: Move to Supabase config table** for dynamic management.

### Authentication & Authorization
- Middleware (`middleware.ts`) protects `/admin` routes - requires auth + "admin"/"super_admin" role
- Client-side: `getSupabaseBrowserClient()` for component auth checks
- Server-side: `createClient()` (SSR-compatible) for API routes

## Development Workflow

### Setup
```bash
# Install dependencies
pnpm install

# Configure environment
# Required vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_URL
# See .env.example or docs/ADMIN_ACCESS_GUIDE.md

# Start dev server
npm run dev  # Runs on http://localhost:3000
```

### Build & Test
```bash
npm run build      # TypeScript + Next.js build (typesError: ignored by next.config)
npm run lint       # ESLint check
npm start          # Production server
```

### Common Tasks
- **Add new store**: Insert row in `stores` table, update ID maps in route handlers, test API calls
- **Debug availability**: Check `SERVICE_ID_MAP` translation first, then Python backend logs at NEXUS_API_URL
- **Component reuse**: Use Radix UI primitives from `components/ui/` (button, card, dialog, etc.)

## File Organization & Conventions

### Component Structure
- **Page components** (`app/[feature]/page.tsx`) - Route entry points, minimal logic
- **Feature components** (`components/[feature]/`) - Reusable UI (e.g., `ServiceBookingForm`, `ProductCard`)
- **UI primitives** (`components/ui/`) - Radix-based building blocks
- **Hooks** (`hooks/use-*.ts`) - Data fetching & state (e.g., `useStores()`, `useCart()`)
- **API layer** (`lib/api/*.ts`) - External API wrappers with error handling

### Naming & Type Safety
- Components: PascalCase, typed with `React.FC<Props>` or arrow functions
- API functions: camelCase, explicitly typed return values
- Database types: `import type { Store, CartItem } from "@/lib/types/database"`
- Use `@/` path alias for all imports (configured in `tsconfig.json`)

### Client vs Server Markers
- Components with `"use client"` directive → Client-only (React hooks, browser APIs)
- API routes & utilities → Server-side by default
- Supabase clients: `getSupabaseBrowserClient()` (client) vs `createClient()` (server)

## Known Issues & Workarounds

1. **External API Inconsistency** - Different stores return different JSON shapes (service data)
   - **Solution:** Flexible mapping in `app/api/stores/[slug]/service/route.ts` handles `{ catalogo: [...] }`, `{ services: [...] }`, or direct array
   - Add new shape patterns as stores are integrated

2. **ID Translation Gaps** - Maps are hardcoded; new stores require code changes
   - **Workaround:** Use fallback IDs (`serviceId || "temp-id"`) during development
   - **TODO:** Migrate to Supabase `store_config` table for zero-downtime updates

3. **Timezone Handling** - Dates are formatted as `YYYY-MM-DD` locally; external APIs may expect different formats
   - Verify with each external API; see `service-booking-form.tsx` for locale formatting example

## Testing & Debugging

### Useful Hooks
- `useServices(storeId)` - Fetches services for a store
- `useStores()` - Loads all stores
- `useCart()` - Cart state management
- Check `hooks/use-*.ts` for full list

### Debug Logs
Look for `[DEBUG]`, `[API SERVICE]`, `[AVAILABILITY]` console logs in route handlers and components for troubleshooting.

### External API Testing
- Nexus API base URL: `process.env.NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000`)
- Test endpoints: `/dispo_servicio/`, `/dispo_producto/`, `/catalogo/{storeId}`

## Next Steps for Agents

1. **Understand store setup** - Check `STORE_ID_MAP` and `SERVICE_ID_MAP` before modifying availability logic
2. **Verify Supabase connectivity** - Ensure middleware auth works before adding protected routes
3. **Test API chains** - Use browser DevTools Network tab to trace request flow (Frontend → Next.js → Nexus → External API)
4. **Check component examples** - `ServiceBookingForm` and `ProductCard` show data fetching + Supabase integration patterns
