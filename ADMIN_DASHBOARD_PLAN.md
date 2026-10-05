# Admin Dashboard — Implementation Plan

> Goal: a full-featured dark-theme admin dashboard with an Aceternity-style animated sidebar,
> where **everything shown on the website (trips, departures, destinations, experiences,
> stories, coupons, reviews, bookings, leads, customers)** can be created, updated and
> deleted — with images served from **Cloudinary** and all data persisted in **MongoDB**.

## Current state (code audit)

### Backend — Express + Mongoose (mostly complete ✅)
- Admin REST API under `/api/admin/*` with role auth (`requireAuth` + fine-grained `requireRole`):
  - Trips CRUD + `PATCH /trips/:id/status` (publish/archive) ✅
  - Departures: `GET/POST /trips/:id/departures`, `PATCH/DELETE /departures/:depId` ✅
  - Destinations, Experiences, Stories, Coupons: full CRUD ✅
  - Bookings: list/get/`PATCH :id/status` ✅
  - Customers: list/get/`PATCH :id` (role update, su-only) ✅
  - Reviews: list/`PATCH :id/status`/delete ✅
  - Leads: list/get/`PATCH :id`/delete ✅
- Cloudinary wired: `lib/cloudinary.ts` + `POST /api/media/upload` (multer) + `DELETE /api/media/:publicId` ✅
- MongoDB URI configured in `server/.env.local`; seed script creates SUPER_ADMIN `arjun@editmytrips.com` / `editmytrips123` ✅
- **Missing server endpoints:** `GET /admin/departures` (all), `GET /admin/payments`, `GET /admin/captains`

### Frontend — Next.js 16 + TanStack Query + Tailwind 4 (partial ⚠️)
- `AdminGuard` (role gate) + admin layout + basic sidebar + login page ✅
- Dashboard with stats + revenue chart ✅
- List pages (DataTable) for trips/destinations/experiences/stories/coupons/bookings/customers/reviews/leads ✅
- Trip create/edit via `TripForm` ✅ (but **no image upload**, no departures UI)
- **Broken/missing:**
  - Create/Edit buttons on most list pages are dead (no forms, no routes)
  - Pages 404: `/admin/departures`, `/admin/captains`, `/admin/notifications`, `/admin/payments`, `/admin/settings`
  - Bookings/leads actions not wired; customers can't be edited
  - `api.ts` missing `customers.get/update`
- Seed login: any seeded email + `editmytrips123`

## Plan

### Phase 1 — Shell & Aceternity-style dark sidebar
1. Install `framer-motion`.
2. Rebuild `AdminSidebar` as an Aceternity-inspired animated sidebar:
   - Floating dark panel (zinc-950 / #0a0a0f), rounded, subtle gradient glow
   - Smooth width collapse (framer-motion springs) — icons + tooltips when collapsed
   - Active link indicator animated with `layoutId` (spring glide between items)
   - Section labels fade in/out; logo, logout, collapse toggle preserved
   - Remove dead links or point them at new pages (below)
3. Admin layout: true dark shell (`#0a0a0f`), header derives page title from pathname.

### Phase 2 — Shared building blocks
4. `ImageUploader` (client): drag-drop/click → `POST /api/media/upload` (Cloudinary) → returns URL;
   single & multi modes with previews + remove. Used by trips/destinations/experiences/stories.
5. `api.ts`: add `customers.get/update`.
6. Reusable `FormPage` shell (header + card + back link) for create/edit routes.

### Phase 3 — Content CRUD (everything editable)
7. **Destinations**: `DestinationForm` + `/admin/destinations/new` + `/admin/destinations/[id]/edit`;
   wire list buttons.
8. **Experiences**: `ExperienceForm` + new/edit routes; wire list buttons.
9. **Stories**: `StoryForm` + new/edit routes (cover image upload, publish toggle); wire list buttons.
10. **Trips**: add coverImage + gallery upload to `TripForm`; add departures manager
    (list/create/edit/delete per trip) inside trip edit; publish/unpublish action on trips list.
11. **Coupons**: create/edit dialog on coupons page (type, value, limits, validity, active toggle).

### Phase 4 — Operations wiring
12. **Bookings**: confirm/cancel/complete actions via `updateStatus` + ConfirmDialog.
13. **Leads**: status dropdown (NEW/CONTACTED/CONVERTED/CLOSED), notes editing, delete.
14. **Customers**: detail dialog + role change (su-only), search.
15. **Reviews**: verify approve/reject works; delete with confirm.

### Phase 5 — Missing pages & endpoints
16. Server: add `GET /admin/departures` (all, trip-populated), `GET /admin/payments`, `GET /admin/captains`.
17. Pages: departures (cross-trip manager), payments (read-only ledger), captains (list),
    notifications & settings (clean placeholders — no more 404s).

### Phase 6 — Verify
18. `npm run build` clean; runtime smoke test (server + login + key pages).

## Key files
| Area | Files |
|---|---|
| Sidebar/shell | `client/src/components/admin/AdminSidebar.tsx`, `AdminHeader.tsx`, `client/src/app/admin/layout.tsx` |
| Shared UI | `client/src/components/admin/ImageUploader.tsx`, `FormPage.tsx` |
| Forms | `DestinationForm`, `ExperienceForm`, `StoryForm`, `TripForm` (extend), `CouponDialog` |
| List pages | `client/src/app/admin/*/page.tsx` |
| API layer | `client/src/lib/api.ts`, `client/src/components/admin/ConfirmDialog.tsx` |
| Server additions | `admin.routes.ts`, `admin.trip.controller.ts`, `admin.controller.ts` |
