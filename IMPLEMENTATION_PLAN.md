# editmytrips — Implementation Plan

> **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · shadcn/ui (base-nova) · MongoDB + Mongoose · JWT auth (jsonwebtoken + bcryptjs) · Razorpay · Resend · Cloudinary · TanStack Query

---

## Project Structure (Final)

```
server/                       ← Express + Mongoose REST API (monorepo root)
└── src/
    ├── index.ts              ← Bootstrap (connect DB + listen)
    ├── app.ts                ← Express app factory
    ├── config/env.ts         ← Zod-validated env vars
    ├── db/mongoose.ts        ← MongoDB singleton connection
    ├── middleware/
    │   ├── error.ts          ← notFound + error handler
    │   └── auth.ts           ← requireAuth / requireRole JWT guards (done)
    ├── models/               ← Mongoose models (same shape as client types)
    │   ├── User.ts, Trip.ts, Destination.ts, Experience.ts,
    │   ├── Booking.ts, Payment.ts, Review.ts, Story.ts, Captain.ts,
    │   ├── Coupon.ts, enums.ts
    ├── controllers/          ← Route handlers
    ├── routes/               ← Express routers
    ├── services/             ← Business logic (price engine, seat reservation)
    └── seed/seed.ts          ← Seed DB from client mock data

client/
└── src/
    ├── app/
    │   ├── (website)/              ← Customer-facing site
    │   │   ├── layout.tsx
    │   │   ├── page.tsx            ← Homepage
    │   │   ├── explore/
    │   │   ├── trips/
    │   │   │   ├── page.tsx
    │   │   │   └── [slug]/page.tsx
    │   │   ├── destinations/
    │   │   │   ├── page.tsx
    │   │   │   └── [slug]/page.tsx
    │   │   ├── experiences/
    │   │   ├── stories/
    │   │   │   ├── page.tsx
    │   │   │   └── [slug]/page.tsx
    │   │   ├── community/
    │   │   ├── booking/
    │   │   │   └── [tripId]/page.tsx
    │   │   └── profile/
    │   │       └── page.tsx        ← Auth-aware ProfileShell
    │   │
    │   ├── (auth)/                 ← Account auth (centered layout)
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   │
    │   ├── admin/                  ← Admin dashboard
    │   │   ├── layout.tsx
    │   │   ├── page.tsx            ← Dashboard
    │   │   ├── trips/
    │   │   ├── departures/
    │   │   ├── bookings/
    │   │   ├── customers/
    │   │   ├── captains/
    │   │   ├── destinations/
    │   │   ├── experiences/
    │   │   ├── reviews/
    │   │   ├── stories/
    │   │   ├── media/
    │   │   ├── coupons/
    │   │   ├── payments/
    │   │   ├── notifications/
    │   │   ├── settings/
    │   │   └── audit-logs/
    │   │
    │   ├── globals.css
    │   └── layout.tsx              ← Root layout
    │
    ├── components/
    │   ├── ui/                     ← shadcn (already generated)
    │   ├── auth/
    │   │   ├── AuthContext.tsx     ← AuthProvider + useAuth (JWT session)
    │   │   └── AuthForm.tsx        ← login/register card form
    │   ├── navigation/
    │   │   ├── Navbar.tsx
    │   │   ├── MobileNav.tsx
    │   │   └── Footer.tsx
    │   ├── travel/
    │   │   ├── TripCard.tsx
    │   │   ├── DestinationCard.tsx
    │   │   ├── ExperienceCard.tsx
    │   │   ├── ReviewCard.tsx
    │   │   ├── CaptainCard.tsx
    │   │   └── TravellerCard.tsx
    │   ├── booking/
    │   │   ├── BookingWidget.tsx
    │   │   ├── DateSelector.tsx
    │   │   ├── TravellerSelector.tsx
    │   │   ├── PriceBreakdown.tsx
    │   │   └── BookingSummary.tsx
    │   └── admin/
    │       ├── AdminSidebar.tsx
    │       ├── AdminHeader.tsx
    │       ├── StatCard.tsx
    │       ├── DataTable.tsx
    │       ├── StatusBadge.tsx
    │       └── ConfirmDialog.tsx
    │
    ├── lib/
    │   ├── utils.ts                ← cn() (exists)
    │   ├── constants.ts            ← site config, nav links
    │   ├── api.ts                  ← typed fetch wrapper + JWT session helpers
    │   ├── fonts.ts                ← Geist config
    │   └── mock-data.ts            ← Realistic mock data (swapped for Express API later)
    │
    ├── schemas/                    ← Zod validation schemas
    │   ├── trip.schema.ts
    │   ├── booking.schema.ts
    │   ├── user.schema.ts
    │   ├── payment.schema.ts
    │   └── coupon.schema.ts
    │
    ├── types/
    │   └── index.ts                ← Shared TypeScript types
    │
    └── hooks/
        ├── useTrips.ts
        ├── useBooking.ts
        └── useDebounce.ts
```

---

## Implementation Phases & TODO

### ✅ DONE — Already Set Up
- [x] Next.js 16 + TypeScript + Tailwind v4 scaffolded
- [x] shadcn/ui base-nova components installed (button, card, badge, input, dialog, drawer, tabs, select, avatar, skeleton, toast, dropdown-menu, sheet, table, form, textarea, separator, label, checkbox, switch)
- [x] All major npm packages installed (TanStack Query, Zod, React Hook Form, Razorpay, Resend, Recharts, Lucide, date-fns, sonner)
- [x] `cn()` utility in lib/utils.ts
- [x] Geist font configured in layout.tsx
- [x] globals.css with Tailwind v4 design tokens

---

### Phase 1 — Foundation (Config + Design System)

- [x] **1.1** `globals.css` — Override design tokens: brand orange (`#FF6B35`) + teal (`#0D9488`) travel palette
- [x] **1.2** `src/types/index.ts` — All shared TypeScript interfaces (Trip, Destination, Booking, User, etc.)
- [x] **1.3** `src/lib/constants.ts` — Nav links, site name, trip types, difficulty levels, filter options
- [x] **1.4** `src/lib/mock-data.ts` — Realistic dummy data for all entities (used until DB is wired)
- [x] **1.5** `src/lib/fonts.ts` — Font config extracted
- [x] **1.6** `next.config.ts` — Image domains (unsplash, cloudinary), env validation

---

### Phase 2 — App Shell

- [x] **2.1** `src/app/layout.tsx` — Root layout (fonts, TanStack Query provider, Sonner toaster)
- [x] **2.2** `src/app/(website)/layout.tsx` — Website layout (Navbar + Footer wrapper)
- [x] **2.3** `src/app/not-found.tsx` — 404 page
- [x] **2.4** `src/components/navigation/Navbar.tsx` — Logo, nav links, auth CTA, sticky header with scroll blur
- [x] **2.5** `src/components/navigation/MobileNav.tsx` — Sheet-based mobile menu (integrated into Navbar)
- [x] **2.6** `src/components/navigation/Footer.tsx` — Links, socials, newsletter CTA, legal

---

### Phase 3 — Travel Domain Components

- [x] **3.1** `TripCard.tsx` — Cover image, title, destination, duration, price, rating, seats left badge, difficulty chip
- [x] **3.2** `DestinationCard.tsx` — Hero image, name, state, trip count
- [x] **3.3** `ExperienceCard.tsx` — Image, title, duration, price, host
- [x] **3.4** `ReviewCard.tsx` — Star rating, text, author avatar, trip name, verified badge
- [x] **3.5** `CaptainCard.tsx` — Avatar, name, rating, trips led, bio snippet
- [x] **3.6** `TravellerCard.tsx` — Photo, name, trips count (community use)

---

### Phase 4 — Customer Website Pages

- [x] **4.1** `(website)/page.tsx` — **Homepage**
  - Hero section (full-bleed, search bar, animated headline)
  - Trending Trips carousel / grid
  - Popular Destinations grid
  - Experiences section
  - Stories / Blog preview
  - Community / Traveller photos
  - Why editmytrips (trust signals)
  - CTA banner
- [x] **4.2** `(website)/explore/page.tsx` — **Explore**
  - Search input with URL params
  - Filter sidebar: trip type, difficulty, duration range, price range, destination, sort
  - Trip grid with skeleton loading
- [x] **4.3** `(website)/trips/page.tsx` — **All Trips** listing
- [x] **4.4** `(website)/trips/[slug]/page.tsx` — **Trip Detail**
  - Cover image gallery
  - Overview (duration, difficulty, group size, min age)
  - Tabs: Itinerary | Inclusions | Reviews | FAQs
  - Itinerary day-by-day accordion
  - Inclusion/exclusion checklist
  - Reviews section
  - Sticky BookingWidget sidebar
  - Captain card
- [ ] **4.5** `(website)/destinations/page.tsx` — Destinations grid
- [ ] **4.6** `(website)/destinations/[slug]/page.tsx` — Destination detail (hero, about, best time, trips from here)
- [x] **4.7** `(website)/experiences/page.tsx` — Experiences grid with filter
- [x] **4.8** `(website)/stories/page.tsx` — Blog listing (featured + grid)
- [x] **4.9** `(website)/stories/[slug]/page.tsx` — Story/blog detail with rich content
- [x] **4.10** `(website)/community/page.tsx` — Traveller photos, trip reviews, social feed style

---

### Phase 5 — Booking Components + Flow

- [x] **5.1** `components/booking/BookingWidget.tsx` — Sticky trip sidebar: departure picker, traveller count, price, Book Now CTA
- [x] **5.2** `components/booking/DateSelector.tsx` — Available departures list with seats left
- [x] **5.3** `components/booking/TravellerSelector.tsx` — Adults/children counter with max cap
- [x] **5.4** `components/booking/PriceBreakdown.tsx` — Subtotal, tax, coupon discount, total
- [x] **5.5** `components/booking/BookingSummary.tsx` — Final confirmation summary card
- [x] **5.6** `(website)/booking/[tripId]/page.tsx` — **Multi-step booking flow**
  - Step 1: Select departure + traveller count
  - Step 2: Traveller details form (name, age, gender, phone, emergency contact)
  - Step 3: Add-ons + coupon code
  - Step 4: Price summary + T&C
  - Step 5: Payment (Razorpay)
  - Step 6: Confirmation page

---

### Phase 6 — User Account

- [x] **6.1** `(website)/profile/page.tsx` — Upcoming bookings, past trips, edit profile

---

### Phase 7 — Admin Shell

- [ ] **7.1** `components/admin/AdminSidebar.tsx` — Full sidebar (Content, Operations, Marketing, Finance, Community, System sections), collapsible, role-filtered
- [ ] **7.2** `components/admin/AdminHeader.tsx` — Breadcrumb, user menu, notifications bell
- [ ] **7.3** `components/admin/StatCard.tsx` — Metric card with icon, value, trend arrow
- [ ] **7.4** `components/admin/DataTable.tsx` — Reusable sortable/filterable table wrapper
- [ ] **7.5** `components/admin/StatusBadge.tsx` — Color-coded booking/payment/trip status
- [ ] **7.6** `components/admin/ConfirmDialog.tsx` — Destructive action confirmation modal
- [ ] **7.7** `admin/layout.tsx` — Admin layout with sidebar + header, auth guard

---

### Phase 8 — Admin Pages

- [ ] **8.1** `admin/page.tsx` — **Dashboard**: stats (revenue, bookings, trips, departures), Recharts revenue chart, upcoming departures table, recent bookings
- [ ] **8.2** `admin/trips/` — Trip listing DataTable + **10-step Create/Edit wizard**
  - Step 1: Basic Info (title, slug, description, type, difficulty)
  - Step 2: Destination
  - Step 3: Pricing (base price, tax, discount)
  - Step 4: Itinerary builder (add/remove days, drag reorder)
  - Step 5: Inclusions / Exclusions
  - Step 6: Images (drag-drop gallery, reorder, cover select)
  - Step 7: Departures (add multiple)
  - Step 8: SEO (meta title, description, OG image)
  - Step 9: Preview
  - Step 10: Publish
- [ ] **8.3** `admin/departures/` — Per-trip departure table: date, capacity, booked, price, status, assign captain
- [ ] **8.4** `admin/bookings/` — Filterable table + booking detail Sheet (travellers, payments, notes, cancel/refund)
- [ ] **8.5** `admin/customers/` — Customer list + detail (booking history, spend, upcoming trips)
- [ ] **8.6** `admin/captains/` — Captain profiles, ratings, availability, assign to departure
- [ ] **8.7** `admin/destinations/` — CRUD with image upload
- [ ] **8.8** `admin/experiences/` — CRUD
- [ ] **8.9** `admin/stories/` — Rich text editor (Tiptap), draft/publish, SEO
- [ ] **8.10** `admin/media/` — Media library grid, upload, copy URL, alt text, delete
- [ ] **8.11** `admin/coupons/` — CRUD (fixed/percent), usage stats, validity
- [ ] **8.12** `admin/payments/` — Payment ledger, refund initiation
- [ ] **8.13** `admin/reviews/` — Moderation queue (approve/reject/flag)
- [ ] **8.14** `admin/notifications/` — Send email/WhatsApp by template
- [ ] **8.15** `admin/settings/` — Site config (name, logo, contact, social links)
- [ ] **8.16** `admin/audit-logs/` — Full action log table

---

### Phase 9 — Backend / Data Layer

- [x] **9.0** `server/` — **Standalone Express + Mongoose REST API** (monorepo root)
  - `server/src/index.ts` — bootstrap (parallel DB connect, graceful shutdown)
  - `server/src/app.ts` — app factory (helmet, cors, morgan, `/api` router, error handling)
  - `server/src/config/env.ts` — Zod-validated env vars (PORT, MONGODB_URI, CLIENT_ORIGIN)
  - `server/src/db/mongoose.ts` — MongoDB singleton connection
  - `server/src/models/` — Mongoose models (User, Trip, Destination, Experience, Story, Departure, Booking, Payment, Review, Captain, Coupon, enums)
  - `server/src/controllers/` + `server/src/routes/` — REST endpoints:
    - `GET /api/health` · `GET/POST /api/trips` · `GET /api/trips/:slug` · `GET /api/trips/featured` · `GET /api/trips/search`
    - `GET /api/destinations` · `GET /api/destinations/:slug`
    - `GET /api/experiences` · `GET /api/experiences/:slug`
    - `GET /api/stories` · `GET /api/stories/:slug`
    - `GET/POST /api/bookings` · `POST /api/bookings/price` · `PATCH /api/bookings/:id/cancel`
    - `GET/POST /api/trips/:tripId/reviews`
  - `server/src/middleware/` — error handler, notFound, asyncHandler, requireAuth (JWT placeholder for Phase 10)
  - `server/src/services/` — `pricing.service.ts` (price engine + coupon validation), `booking.service.ts` (atomic seat reservation via `$inc`)
  - `server/src/seed/seed.ts` — `npm run seed` populates destinations, users, captains, trips, departures, experiences, stories, coupons
  - Deps: express, mongoose, cors, helmet, morgan, zod, dotenv, tsx, typescript — verified `tsc --noEmit` clean + smoke-tested `/api/health`
- [ ] **9.1** `src/lib/db/mongoose.ts` — MongoDB singleton connection (answer: now lives in `server/src/db/mongoose.ts`)
- [ ] **9.2** `src/models/` — All Mongoose models (answer: now live in `server/src/models/`)
- [ ] **9.3** `src/schemas/` — Zod validation schemas for all forms
- [ ] **9.4** `src/server/repositories/` — Data access layer (all DB queries)
- [ ] **9.5** `src/server/services/` — Business logic (booking seat reservation with atomic transaction, price engine, coupon application)
- [ ] **9.6** `src/server/actions/` — Next.js server actions (validated, authorized)
- [ ] **9.7** `src/app/api/` — REST API routes (trips, bookings, payments webhook, reviews, search)

---

### Phase 10 — Auth

- [x] **10.1** `server/src/lib/jwt.ts` — JWT sign/verify (jsonwebtoken, 7-day expiry, `sub/role/email` payload)
- [x] **10.2** `server/src/middleware/auth.ts` — `requireAuth` (Bearer parsing) + `requireRole` role guard
- [x] **10.3** `server/src/controllers/auth.controller.ts` + `server/src/routes/auth.routes.ts` — `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (bcrypt password hashing, 409 duplicate email, envelope `{ success, data }`)
- [x] **10.4** `server/src/seed/seed.ts` — seeded users with bcrypt-hashed password (`editmytrips123`)
- [x] **10.5** `client/src/components/auth/` — `AuthProvider` (loading/authenticated/unauthenticated + localStorage session + 401 clear), login/register forms
- [x] **10.6** `client/src/app/(auth)/` — centered `layout.tsx`, `login/page.tsx`, `register/page.tsx`
- [x] **10.7** Auth-aware UI — Navbar (user dropdown / log in / sign up) + `ProfileShell` (real session, mock bookings, sign-out)

> Note: original plan called for Auth.js v5 (Google + Email OTP, session-based). Implemented as **JWT (Bearer token) + bcrypt** instead — a self-contained Express auth API that the mock-first client already calls; swap to Auth.js/OAuth later if social login is needed. MongoDB must be running (`npm run seed` + `npm run dev`) for live auth.

---

### Phase 11 — Payments

- [ ] **11.1** `src/lib/payments/razorpay.ts` — Order creation, server-side signature verification
- [ ] **11.2** `src/app/api/payments/webhook/route.ts` — Webhook handler (never trust client-side success)
- [ ] **11.3** Booking confirmation email + WhatsApp trigger on webhook success

---

### Phase 12 — Notifications

- [ ] **12.1** `src/lib/email/` — Resend + React Email templates (Booking Confirmed, Payment, Reminder, Cancellation, Refund)
- [ ] **12.2** `src/lib/whatsapp/` — WhatsApp Business API templates

---

### Phase 13 — SEO

- [ ] **13.1** `src/app/sitemap.ts` — Dynamic sitemap (trips, destinations, stories)
- [ ] **13.2** `src/app/robots.ts`
- [ ] **13.3** Structured data helpers (JSON-LD: Product, TouristAttraction, Article, FAQ, BreadcrumbList)
- [ ] **13.4** Per-page metadata (generateMetadata for all dynamic routes)

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Database | MongoDB + Mongoose | As specified, flexible schema for travel content |
| Auth | Auth.js v5 | Google + Email OTP, session-based |
| Payments | Razorpay | India-focused, UPI/cards/wallets |
| Email | Resend + React Email | Best DX for transactional emails |
| File storage | Cloudinary | Free tier generous, image transforms built-in |
| UI library | shadcn base-nova | Already installed |
| Form validation | Zod + React Hook Form | Already installed |
| State management | TanStack Query | Server state, already installed |
| Rich text | Tiptap | Stories/CMS editor |
| Charts | Recharts | Admin dashboard, already installed |

---

## Brand Colors (Travel palette)

```
Primary:    #FF6B35  (vibrant orange — adventure, energy)
Secondary:  #0D9488  (teal — trust, nature)
Dark bg:    #0F172A  (slate-900)
Surface:    #F8FAFC  (slate-50)
Text:       #1E293B  (slate-800)
```

---

## Booking State Machine

```
PENDING → CONFIRMED → COMPLETED
PENDING → CANCELLED
CONFIRMED → CANCELLED → REFUNDED
```

Never allow arbitrary status jumps.

---

## Seat Reservation (Atomic)

MongoDB `findOneAndUpdate` with `$inc` on `availableSeats` + session-level transaction to prevent double-booking race conditions.

---

## Notes

- All customer pages are built with **mock data first** — just swap the data source to MongoDB repos when backend is wired
- Admin pages are fully functional UI — connected to server actions in Phase 9
- Never check roles only on the client — every admin server action re-verifies role server-side
- Payment status is ONLY updated via Razorpay webhook, never from frontend callback
