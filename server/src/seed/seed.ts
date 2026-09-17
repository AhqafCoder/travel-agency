import { connectDB, disconnectDB } from "../db/mongoose.js";
import { env } from "../config/env.js";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Destination, type DestinationDoc } from "../models/Destination.js";
import { Trip } from "../models/Trip.js";
import { Experience } from "../models/Experience.js";
import { Story } from "../models/Story.js";
import { Coupon } from "../models/Coupon.js";
import { Booking } from "../models/Booking.js";
import { Departure } from "../models/Departure.js";
import { Review } from "../models/Review.js";
import { Payment } from "../models/Payment.js";
import { Captain } from "../models/Captain.js";

// All seeded accounts share this dev password so you can log in as any of them.
const DEFAULT_PASSWORD = "editmytrips123";

const users = [
  { name: "Arjun Mehta", email: "arjun@editmytrips.com", phone: "+919876543210", role: "SUPER_ADMIN" },
  { name: "Priya Nair", email: "priya@editmytrips.com", phone: "+919876543211", role: "OPERATIONS" },
  { name: "Ravi Sharma", email: "ravi@editmytrips.com", phone: "+919876543212", role: "CAPTAIN" },
  { name: "Sonia Das", email: "sonia@editmytrips.com", phone: "+919876543213", role: "CAPTAIN" },
  { name: "Kabir Patel", email: "kabir@editmytrips.com", phone: "+919876543214", role: "CUSTOMER" },
];

const destinations = [
  { name: "Manali", slug: "manali", state: "Himachal Pradesh", country: "India", description: "A high-altitude resort town in Himachal Pradesh with stunning views of snow-capped peaks.", bestTime: "Oct to Jun" },
  { name: "Rishikesh", slug: "rishikesh", state: "Uttarakhand", country: "India", description: "The yoga capital of the world and India's adventure sports hub.", bestTime: "Sep to May" },
  { name: "Goa", slug: "goa", state: "Goa", country: "India", description: "India's smallest state, famous for its pristine beaches and nightlife.", bestTime: "Oct to Mar" },
  { name: "Spiti Valley", slug: "spiti-valley", state: "Himachal Pradesh", country: "India", description: "A cold desert mountain valley at high altitude.", bestTime: "Jun to Sep" },
  { name: "Kaziranga", slug: "kaziranga", state: "Assam", country: "India", description: "Home to the world's largest population of one-horned rhinoceroses.", bestTime: "Nov to Apr" },
];

const trips = [
  {
    title: "Manali Adventure",
    slug: "manali-adventure",
    shortDescription: "A 4-day high-altitude adventure through the valleys of Himachal Pradesh.",
    description: "Manali is a magical land of frozen rivers and snow-capped mountains. This 4-day trip takes you through the heart of Himachal Pradesh with guided trekking, camping, and white water rafting.",
    durationDays: 4,
    durationNights: 3,
    basePrice: 8999,
    discountedPrice: 7999,
    tripType: "Adventure" as const,
    difficulty: "Moderate" as const,
    minAge: 16,
    maxGroupSize: 20,
    status: "PUBLISHED" as const,
    featured: true,
    trending: true,
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
    inclusions: [
      "Transportation (Delhi – Manali – Delhi)",
      "Accommodation (3 nights hotel, 1 night camping)",
      "All meals (breakfast + dinner)",
      "Experienced trip captain",
    ],
    exclusions: ["Flights or trains", "Personal shopping", "Anything not mentioned in inclusions"],
  },
  {
    title: "Rishikesh River & Soul Retreat",
    slug: "rishikesh-river-soul-retreat",
    shortDescription: "3 days of white water rafting, yoga, and camping on the Ganges banks.",
    description: "Rishikesh does something to you. The sound of the Ganges, early morning yoga, the smell of incense, and the rush of white water rapids — it resets you completely.",
    durationDays: 3,
    durationNights: 2,
    basePrice: 5999,
    discountedPrice: 4999,
    tripType: "Adventure" as const,
    difficulty: "Easy" as const,
    minAge: 16,
    maxGroupSize: 16,
    status: "PUBLISHED" as const,
    featured: false,
    trending: true,
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    inclusions: [
      "Delhi – Rishikesh – Delhi transport",
      "2 nights riverside camping",
      "All meals",
      "Rafting (16 km)",
      "Yoga sessions",
      "Bonfire",
    ],
    exclusions: ["Bungee jumping (optional)", "Personal expenses"],
  },
  {
    title: "Goa Beach Bums",
    slug: "goa-beach-bums",
    shortDescription: "4 nights of sun, sand, and sea on Goa's best beaches.",
    description: "The perfect coastal getaway. This 4-night trip covers North and South Goa — from the vibrant Anjuna flea market to the serene Palolem beaches.",
    durationDays: 5,
    durationNights: 4,
    basePrice: 12499,
    discountedPrice: 10999,
    tripType: "Beach" as const,
    difficulty: "Easy" as const,
    minAge: 14,
    maxGroupSize: 24,
    status: "PUBLISHED" as const,
    featured: false,
    trending: true,
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    inclusions: [
      "Goa airport/railway pickup & drop",
      "3 nights beach resort accommodation",
      "Daily breakfast",
      "Goa sightseeing",
      "Spice farm visit",
      "Beach party night",
    ],
    exclusions: ["Flights/trains", "Lunches & dinners (mostly)", "Water sports"],
  },
];

const experiences = [
  { title: "Sunrise Yoga in Rishikesh", slug: "sunrise-yoga-rishikesh", description: "Join local instructors for a grounding yoga session by the Ganges.", duration: "2 hours", price: 999, capacity: 20, category: "Yoga", highlights: ["Riverfront setting", "All levels welcome", "Post-session chai"] },
  { title: "Village Walk in Manali", slug: "village-walk-manali", description: "Explore hidden hamlets with a local guide — temples, orchards, and mountain views.", duration: "3 hours", price: 1299, capacity: 10, category: "Cultural", highlights: ["Off-the-beaten-path", "Local snacks", "Great photos"] },
  { title: "Spice Farm Tour, Goa", slug: "spice-farm-tour-goa", description: "Learn about tropical spices, see how they grow, and sample them.", duration: "4 hours", price: 1799, capacity: 15, category: "Culinary", highlights: ["Hands-on experience", "Organic farm", "Lunch included"] },
];

const stories = [
  { title: "Rishikesh hit different", slug: "rishikesh-hit-different", excerpt: "I went to Rishikesh looking for adventure and found something deeper.", category: "Travel", readTime: 5, views: 12430 },
  { title: "The ₹10,000 Budget That Took Me to Manali, Rishikesh, and Back", slug: "budget-manali-rishikesh", excerpt: "Backpacking through Himachal Pradesh doesn't have to break the bank.", category: "Budget", readTime: 8, views: 8900 },
  { title: "Anjuna Flea Market — What to Buy & Skip", slug: "anjuna-flea-market-guide", excerpt: "A seasoned Goa explorer shares what's worth buying and what's tourist trap.", category: "Guide", readTime: 6, views: 15200 },
];

const coupons = [
  {
    code: "WELCOME10",
    description: "10% off your first trip",
    type: "PERCENTAGE" as const,
    value: 10,
    minimumAmount: 3000,
    usageLimit: 500,
    usedCount: 12,
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2027-12-31"),
    active: true,
  },
  {
    code: "FLAT500",
    description: "Flat ₹500 off",
    type: "FIXED" as const,
    value: 500,
    minimumAmount: 4000,
    usageLimit: 100,
    usedCount: 5,
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2027-12-31"),
    active: true,
  },
];

const DEST_SLUG_FOR_EXP = (slug: string): number =>
  slug.includes("manali") ? 0 : slug.includes("rishikesh") ? 1 : 2;

async function seed() {
  console.log(`🔗 Connecting to MongoDB: ${env.MONGODB_URI}`);
  await connectDB();

  // Wipe existing data
  await Promise.all([
    User.deleteMany({}),
    Destination.deleteMany({}),
    Trip.deleteMany({}),
    Experience.deleteMany({}),
    Story.deleteMany({}),
    Coupon.deleteMany({}),
    Booking.deleteMany({}),
    Departure.deleteMany({}),
    Review.deleteMany({}),
    Payment.deleteMany({}),
    Captain.deleteMany({}),
  ]);
  console.log("🧹 Cleared existing data");

  // Seed destinations
  const destDocs = await Destination.insertMany(destinations);
  console.log(`✅ Seeded ${destDocs.length} destinations`);

  // Seed users (with hashed password so /login works against the seeded DB).
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const usersWithHash = users.map((u) => ({ ...u, passwordHash }));
  const userDocs = await User.insertMany(usersWithHash);
  console.log(`✅ Seeded ${userDocs.length} users`);

  // Seed captains (link to CAPTAIN users by order)
  const captains = userDocs.filter((u) => u.role === "CAPTAIN");
  if (captains.length > 0) {
    await Captain.insertMany(
      captains.map((c) => ({
        userId: c._id,
        bio: "Passionate about the mountains and sharing them with new friends.",
        rating: 4.9,
        reviewCount: 84,
        tripsLed: 22,
        specializations: ["Adventure", "Trek"],
        languages: ["Hindi", "English"],
        experience: 6,
        avatar: "",
        available: true,
      }))
    );
    console.log(`✅ Seeded ${captains.length} captains`);
  }

  // Seed trips — each trip links to a destination by slug
  const destMap = new Map(
    (destDocs as DestinationDoc[]).map((d) => [d.slug, d._id])
  );
  const tripDocs = await Trip.insertMany(
    trips.map((t) => ({
      ...t,
      destinationId: destMap.get(t.slug.split("-")[0]) ?? destDocs[0]._id,
      gallery: [t.coverImage],
      faqs: [],
      itinerary: [],
    }))
  );
  console.log(`✅ Seeded ${tripDocs.length} trips`);

  // Seed departures for each trip (a few upcoming departures)
  const departures: Array<Record<string, unknown>> = [];
  for (const trip of tripDocs) {
    const base = new Date();
    const price = (trip as unknown as { discountedPrice?: number; basePrice: number }).discountedPrice ??
      (trip as unknown as { basePrice: number }).basePrice;
    for (let i = 1; i <= 3; i++) {
      const start = new Date(base);
      start.setDate(start.getDate() + i * 14); // bi-weekly
      const end = new Date(start);
      end.setDate(
        end.getDate() +
          ((trip as unknown as { durationDays: number }).durationDays - 1)
      );
      departures.push({
        tripId: trip._id,
        startDate: start,
        endDate: end,
        capacity: 20,
        bookedSeats: 0,
        availableSeats: 20,
        price,
        meetingPoint: "Delhi ISBT Kashmere Gate",
        meetingTime: "07:00 AM",
        status: "ACTIVE",
      });
    }
  }
  if (departures.length > 0) {
    const inserted = await Departure.insertMany(departures);
    console.log(`✅ Seeded ${inserted.length} departures`);
  }

  // Seed experiences — link to destination by name
  const expDocs = await Experience.insertMany(
    experiences.map((e) => ({
      ...e,
      destinationId: destDocs[DEST_SLUG_FOR_EXP(e.slug)]._id,
      status: "ACTIVE",
      images: [],
    }))
  );
  console.log(`✅ Seeded ${expDocs.length} experiences`);

  // Seed stories — authorId links to first user (admin)
  const storyDocs = await Story.insertMany(
    stories.map((s) => ({
      ...s,
      authorId: userDocs[0]._id,
      content: `<p>${s.excerpt}</p><p>Detailed content coming soon...</p>`,
      status: "PUBLISHED",
      publishedAt: new Date(),
      featured: s.slug === "rishikesh-hit-different",
    }))
  );
  console.log(`✅ Seeded ${storyDocs.length} stories`);

  // Seed coupons
  const couponDocs = await Coupon.insertMany(coupons);
  console.log(`✅ Seeded ${couponDocs.length} coupons`);

  console.log("\n🎉 Seed complete");
  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});