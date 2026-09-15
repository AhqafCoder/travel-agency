# GetSet Junction — API Server

Standalone **Express + Mongoose** REST backend for the GetSet Junction travel agency.

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
| `MONGODB_URI`   | `mongodb://127.0.0.1:27017/getset-junction` | Mongo connection string |
| `JWT_SECRET`    | `dev-secret-change-me`             | Reserved for Phase 10 auth     |

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

**Auth** is a placeholder: send `Authorization: Bearer <userId>` to use the
protected routes. Real JWT + session flow lands in Phase 10, and this middleware
is the single swap point.

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
├── middleware/         error, notFound, asyncHandler, auth
├── models/             mongoose models (+ enums)
├── controllers/        route handlers
├── routes/             express routers
├── services/           pricing engine, booking service
└── seed/seed.ts        sample data loader
```