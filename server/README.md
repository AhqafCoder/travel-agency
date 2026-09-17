# editmytrips — API Server

Standalone **Express + Mongoose** REST backend for the editmytrips travel agency.

## Quick start

```bash
cd server
cp .env.example .env   # set MONGODB_URI, PORT, CLIENT_ORIGIN
npm install
npm run seed           # populate the DB with sample data (needs MongoDB running)
npm run dev            # tsx watch — auto-restarts on change
```

Server starts on `http://localhost:4000` (configurable via `PORT`).

## Scripts

| Script            | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Run with `tsx watch` (hot reload)             |
| `npm run build`   | Compile TypeScript to `dist/`                 |
| `npm start`       | Run the compiled build (`node dist/index.js`) |
| `npm run typecheck` | `tsc --noEmit`, no output = clean          |
| `npm run seed`    | Wipe + reseed sample data                     |

## Environment

| Var             | Default                            | Purpose                        |
| --------------- | ---------------------------------- | ------------------------------ |
| `NODE_ENV`      | `development`                      | Env mode                       |
| `PORT`          | `4000`                             | HTTP port                      |
| `CLIENT_ORIGIN` | `http://localhost:3000`            | CORS allowlist for the Next app |
| `MONGODB_URI`   | `mongodb://127.0.0.1:27017/editmytrips` | Mongo connection string |
| `JWT_SECRET`    | `dev-secret-change-me`             | Secret for signing auth tokens — **set a strong value in production** |

The HTTP server starts even if MongoDB is down — `/api/health` reports DB state so a
load balancer can tell readiness apart from liveness.

## API

All routes are prefixed `/api`. Responses use a stable envelope:

```json
{ "success": true, "data": ... }
{ "success": false, "error": "message" }
```

| Method | Route                            | Description                              |
| ------ | -------------------------------- | ---------------------------------------- |
| GET    | `/api/health`                    | Liveness + DB readiness                  |
| POST   | `/api/auth/register`             | Create account (name, email, password ≥ 8 chars) |
| POST   | `/api/auth/login`                | Verify credentials → `{ token, user }`   |
| GET    | `/api/auth/me`                   | Current user from token *(auth)*         |
| GET    | `/api/trips`                     | List with filters + pagination           |
| GET    | `/api/trips/featured`            | Featured trips                           |
| GET    | `/api/trips/search?q=`           | Text search                              |
| GET    | `/api/trips/:slug`               | Trip detail (populated destination/captain) |
| GET    | `/api/trips/destination/:id`     | Trips for a destination                  |
| GET    | `/api/destinations`              | Destinations (with trip counts)          |
| GET    | `/api/destinations/:slug`        | Destination detail + its trips           |
| GET    | `/api/experiences`               | Active experiences                       |
| GET    | `/api/experiences/:slug`         | Experience detail                        |
| GET    | `/api/stories`                   | Published stories                        |
| GET    | `/api/stories/:slug`             | Story detail (increments views)          |
| GET    | `/api/bookings`                  | Caller's bookings *(auth)*               |
| POST   | `/api/bookings`                  | Create booking (atomic seat reservation) *(auth)* |
| POST   | `/api/bookings/price`            | Price preview without reserving *(auth)* |
| GET    | `/api/bookings/:id`              | Booking detail *(auth)*                  |
| PATCH  | `/api/bookings/:id/cancel`       | Cancel + release seats *(auth)*          |
| GET    | `/api/trips/:tripId/reviews`     | Approved reviews                         |
| POST   | `/api/trips/:tripId/reviews`     | Submit review *(auth)*                   |

## Auth

JWT-based account auth. Register/login return an envelope with a 7-day token
and a safe user object (password hash is never sent):

```json
{ "success": true, "data": { "token": "eyJhbGciOi...", "user": { "id": "...", "name": "...", "email": "...", "role": "CUSTOMER" } } }
```

Protected routes (`GET /api/auth/me`, and any route marked *(auth)*) require:

```
Authorization: Bearer <token>
```

The `requireAuth` middleware verifies the token signature/expiry against
`JWT_SECRET` and sets `res.locals.user = { id, role, email }`; `requireRole`
narrows it further (SUPER_ADMIN / OPERATIONS / CAPTAIN / CUSTOMER).

Passwords are hashed with bcrypt (cost 10). Duplicate emails get `409 Conflict`.

**Seeded dev users** (from `npm run seed`) all use the password
`editmytrips123`:

| Name          | Email                     | Role        |
| ------------- | ------------------------- | ----------- |
| Arjun Mehta   | arjun@editmytrips.com     | SUPER_ADMIN |
| Priya Nair    | priya@editmytrips.com     | OPERATIONS  |
| Ravi Sharma   | ravi@editmytrips.com      | CAPTAIN     |
| Sonia Das     | sonia@editmytrips.com     | CAPTAIN     |
| Kabir Patel   | kabir@editmytrips.com     | CUSTOMER    |

### Trip filters (`GET /api/trips`)

`search`, `tripType`, `difficulty`, `destination`, `minPrice`, `maxPrice`,
`minDuration`, `maxDuration`, `featured=true`, `trending=true`,
`sort` (`newest` | `price_asc` | `price_desc` | `rating` | `popular`),
`page`, `pageSize`.

### Seat reservation (anti-double-booking)

`booking.service.createBooking` runs:

1. Load trip → price per person.
2. `Departure.findOneAndUpdate` with `availableSeats: { $gte: n }` and
   `$inc: { availableSeats: -n, bookedSeats: n }` — atomic, fails cleanly
   with 409 when seats run out.
3. Compute price (coupon-aware, 5% GST).
4. Persist the booking.

Cancellation reverses step 2 to release the seats.

## Project layout

```
server/src/
├── index.ts            bootstrap
├── app.ts              express app factory
├── config/env.ts       zod env validation
├── db/mongoose.ts      connection singleton
├── lib/jwt.ts          token sign/verify
├── middleware/         error, notFound, asyncHandler, auth (requireAuth/requireRole)
├── models/             mongoose models (+ enums)
├── controllers/        route handlers (incl. auth.controller)
├── routes/             express routers (incl. auth.routes)
├── services/           pricing engine, booking service
└── seed/seed.ts        sample data loader (+ hashed passwords)
```