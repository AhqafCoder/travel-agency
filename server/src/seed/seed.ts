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

const DEFAULT_PASSWORD = "editmytrips123";

// ─── Users ────────────────────────────────────────────────────────────────────
const users = [
  { name: "Arjun Mehta", email: "arjun@editmytrips.com", phone: "+919876543210", role: "SUPER_ADMIN" },
  { name: "Priya Nair", email: "priya@editmytrips.com", phone: "+919876543211", role: "OPERATIONS" },
  { name: "Ravi Sharma", email: "ravi@editmytrips.com", phone: "+919876543212", role: "CAPTAIN" },
  { name: "Sonia Das", email: "sonia@editmytrips.com", phone: "+919876543213", role: "CAPTAIN" },
  { name: "Kabir Patel", email: "kabir@editmytrips.com", phone: "+919876543214", role: "CUSTOMER" },
  { name: "Divya Rao", email: "divya@editmytrips.com", phone: "+919876543215", role: "CUSTOMER" },
  { name: "Nikhil Gupta", email: "nikhil@editmytrips.com", phone: "+919876543216", role: "CUSTOMER" },
  { name: "Anjali Kapoor", email: "anjali@editmytrips.com", phone: "+919876543217", role: "EDITOR" },
];

// ─── Destinations ─────────────────────────────────────────────────────────────
const destinations = [
  {
    name: "Manali",
    slug: "manali",
    state: "Himachal Pradesh",
    country: "India",
    description: "A high-altitude resort town in Himachal Pradesh with stunning views of snow-capped peaks, vibrant local culture, and endless adventure.",
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
      "https://images.unsplash.com/photo-1619860317893-ef8fa15a6afc?w=1200&q=80",
    ],
    bestTime: "Oct to Jun",
    featured: true,
    latitude: 32.2396,
    longitude: 77.1887,
  },
  {
    name: "Rishikesh",
    slug: "rishikesh",
    state: "Uttarakhand",
    country: "India",
    description: "The yoga capital of the world and India's adventure sports hub, nestled in the foothills of the Himalayas along the Ganges.",
    heroImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    ],
    bestTime: "Sep to May",
    featured: true,
    latitude: 30.0869,
    longitude: 78.2676,
  },
  {
    name: "Goa",
    slug: "goa",
    state: "Goa",
    country: "India",
    description: "India's smallest state, famous for its pristine beaches, Portuguese heritage, vibrant nightlife, and laid-back coastal charm.",
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    ],
    bestTime: "Oct to Mar",
    featured: true,
    latitude: 15.2993,
    longitude: 74.1240,
  },
  {
    name: "Spiti Valley",
    slug: "spiti-valley",
    state: "Himachal Pradesh",
    country: "India",
    description: "A cold desert mountain valley at 12,500 feet, home to ancient monasteries, dramatic landscapes, and rare wildlife.",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
    gallery: [],
    bestTime: "Jun to Sep",
    featured: false,
    latitude: 32.2461,
    longitude: 78.0339,
  },
  {
    name: "Kaziranga",
    slug: "kaziranga",
    state: "Assam",
    country: "India",
    description: "UNESCO World Heritage Site and home to the world's largest population of one-horned rhinoceroses, elephants, and wild buffaloes.",
    heroImage: "https://images.unsplash.com/photo-1566396535568-34282eecd10f?w=1400&q=80",
    gallery: [],
    bestTime: "Nov to Apr",
    featured: false,
    latitude: 26.5775,
    longitude: 93.1708,
  },
  {
    name: "Varanasi",
    slug: "varanasi",
    state: "Uttar Pradesh",
    country: "India",
    description: "One of the world's oldest living cities, a sacred pilgrimage site on the Ganges with ancient ghats, temples, and timeless rituals.",
    heroImage: "https://images.unsplash.com/photo-1561361058-c12e9f6e8e3b?w=1400&q=80",
    gallery: [],
    bestTime: "Oct to Mar",
    featured: false,
    latitude: 25.3176,
    longitude: 82.9739,
  },
];

// ─── Trips ────────────────────────────────────────────────────────────────────
const trips = [
  {
    title: "Manali Snow Adventure",
    slug: "manali-snow-adventure",
    shortDescription: "A 4-day high-altitude adventure through the valleys and snowfields of Himachal Pradesh.",
    description: `<p>Manali is a magical land of frozen rivers and snow-capped mountains. This 4-day trip takes you through the heart of Himachal Pradesh with guided trekking, camping under the stars, and exhilarating white water rafting on the Beas River.</p>
<p>Wake up to mountain sunrises, explore the ancient Hidimba Temple, and drive through the legendary Rohtang Pass. Every day brings a new adventure in one of India's most stunning landscapes.</p>`,
    destSlug: "manali",
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
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
      "https://images.unsplash.com/photo-1619860317893-ef8fa15a6afc?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    ],
    inclusions: [
      "Transportation (Delhi – Manali – Delhi) by Volvo AC bus",
      "Accommodation (3 nights hotel/camp)",
      "All meals (breakfast + dinner daily)",
      "Experienced trip captain",
      "Rafting on Beas (Grade II–III)",
      "Rohtang Pass trip (if open)",
    ],
    exclusions: [
      "Flights or personal trains",
      "Personal shopping & expenses",
      "Adventure activity insurance",
      "Anything not mentioned in inclusions",
    ],
    faqs: [
      { question: "What is the altitude of the trip?", answer: "Manali town sits at ~2,050m. Rohtang Pass is ~3,978m. Acclimatization rest is built into Day 1." },
      { question: "Is the Rohtang Pass trip guaranteed?", answer: "Rohtang access depends on weather and government permits. We do our best but cannot guarantee it." },
      { question: "What fitness level is required?", answer: "Moderate — you should be comfortable with 3–4 hour hikes on uneven terrain." },
    ],
    itinerary: [
      { dayNumber: 1, title: "Delhi → Manali (Overnight Bus)", description: "Board the Volvo bus from Delhi ISBT at 5:30 PM. Scenic drive through Punjab plains.", activities: ["Board bus at ISBT Kashmere Gate", "Dinner on route", "Overnight journey"], meals: ["Dinner"], stay: "Volvo AC Bus", transport: "Bus", distance: "540 km" },
      { dayNumber: 2, title: "Arrive Manali — Explore Old Manali", description: "Arrive Manali by morning. Check in, freshen up and explore Old Manali village, Hidimba Temple and Mall Road.", activities: ["Hotel check-in", "Hidimba Devi Temple", "Old Manali walk", "Manu Temple", "Free evening at Mall Road"], meals: ["Breakfast", "Dinner"], stay: "Hotel in Manali", transport: "Walking / Auto" },
      { dayNumber: 3, title: "Rohtang Pass & Snow Adventure", description: "Early morning drive to Rohtang Pass (if permits available). Snow activities, hot momos, and panoramic views.", activities: ["Rohtang Pass drive", "Snow activities — sledging, snowball fights", "Solang Valley visit", "Bhrigu Lake viewpoint"], meals: ["Breakfast", "Dinner"], stay: "Hotel in Manali", transport: "Private vehicle", distance: "52 km round trip" },
      { dayNumber: 4, title: "River Rafting → Delhi (Overnight Bus)", description: "Morning white water rafting on Beas River followed by local lunch and evening bus back to Delhi.", activities: ["Rafting on Beas (16 km)", "Local lunch", "Hotel checkout", "Board bus back to Delhi"], meals: ["Breakfast", "Lunch"], stay: "Volvo AC Bus", transport: "Bus + Private vehicle" },
    ],
    metaTitle: "Manali Snow Adventure | 4D/3N Trip ₹7,999 | editmytrips",
    metaDescription: "4-day Manali adventure with Rohtang Pass, river rafting on Beas, and Himachal sightseeing. All-inclusive group trips starting ₹7,999.",
    rating: 4.8,
    reviewCount: 142,
  },
  {
    title: "Rishikesh River & Soul Retreat",
    slug: "rishikesh-river-soul-retreat",
    shortDescription: "3 days of white water rafting, sunrise yoga, and campfire magic on the Ganges banks.",
    description: `<p>Rishikesh does something to you. The sound of the Ganges, early morning yoga, the smell of incense, and the rush of white water rapids — it resets you completely.</p>
<p>This 3-day trip is perfectly designed for the adventurous soul seeking a break from city chaos. Camp riverside, raft through grade IV rapids on the Ganga, and participate in the famous Ganga Aarti at Triveni Ghat.</p>`,
    destSlug: "rishikesh",
    durationDays: 3,
    durationNights: 2,
    basePrice: 5999,
    discountedPrice: 4999,
    tripType: "Adventure" as const,
    difficulty: "Easy" as const,
    minAge: 16,
    maxGroupSize: 16,
    status: "PUBLISHED" as const,
    featured: true,
    trending: true,
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    ],
    inclusions: [
      "Delhi – Rishikesh – Delhi AC transport",
      "2 nights riverside camping with tents",
      "All meals (breakfast, lunch & dinner)",
      "White water rafting (16 km, Grade III–IV)",
      "Yoga & meditation sessions",
      "Ganga Aarti visit",
      "Bonfire with music",
      "Life jackets & safety gear",
    ],
    exclusions: [
      "Bungee jumping & zip-lining (optional, extra cost)",
      "Personal expenses & shopping",
      "Travel insurance",
    ],
    faqs: [
      { question: "Do I need to know swimming for rafting?", answer: "No! You will be given a life jacket and briefed by our expert rafting guides. Non-swimmers are welcome." },
      { question: "What should I pack?", answer: "Light clothing, a light jacket, sunscreen, sports shoes/sandals, ID proof, and a sense of adventure!" },
    ],
    itinerary: [
      { dayNumber: 1, title: "Delhi → Rishikesh — Riverside Camp Check-In", description: "Pick up from Delhi in early morning. Reach Rishikesh, check in to riverside camp. Evening Ganga Aarti.", activities: ["Delhi pickup 6 AM", "Arrive Rishikesh by noon", "Camp check-in & freshen up", "Rafting safety briefing", "Ganga Aarti at Triveni Ghat", "Campfire & bonfire night"], meals: ["Lunch", "Dinner"], stay: "Riverside Tent Camp", transport: "AC Tempo Traveller" },
      { dayNumber: 2, title: "Sunrise Yoga → White Water Rafting", description: "Start the day with sunrise yoga on the Ganges bank, then hit the rapids for a 16 km rafting run.", activities: ["6 AM sunrise yoga session", "Breakfast", "16 km rafting from Shivpuri to Rishikesh", "Cliff jumping at Marine Drive", "Free afternoon — Beatles Ashram, Laxman Jhula", "Evening campfire"], meals: ["Breakfast", "Lunch", "Dinner"], stay: "Riverside Tent Camp", transport: "Rafts & walking" },
      { dayNumber: 3, title: "Morning Yoga → Delhi Departure", description: "Final morning yoga, breakfast, and head back to Delhi with incredible memories.", activities: ["Sunrise yoga", "Breakfast", "Camp checkout", "Drop at Rishikesh bus stand or Haridwar", "Arrive Delhi by evening"], meals: ["Breakfast"] },
    ],
    metaTitle: "Rishikesh Rafting & Yoga Retreat | 3D/2N ₹4,999 | editmytrips",
    metaDescription: "3-day Rishikesh adventure with white water rafting, sunrise yoga, camping by the Ganga and Ganga Aarti. Starting ₹4,999.",
    rating: 4.9,
    reviewCount: 217,
  },
  {
    title: "Goa Beach Bums",
    slug: "goa-beach-bums",
    shortDescription: "5 days of sun, sand, feni, and Goa vibes across the best beaches in India.",
    description: `<p>The perfect coastal getaway. This 5-day trip covers North and South Goa — from the vibrant Anjuna flea market to the serene Palolem beaches, from Goan fish curry to sunset beach parties.</p>
<p>We stay at a beautiful beach resort with a pool, explore local Portuguese heritage villages, and visit an organic spice farm. Goa's magic is best experienced in a group.</p>`,
    destSlug: "goa",
    durationDays: 5,
    durationNights: 4,
    basePrice: 12499,
    discountedPrice: 10999,
    tripType: "Beach" as const,
    difficulty: "Easy" as const,
    minAge: 14,
    maxGroupSize: 24,
    status: "PUBLISHED" as const,
    featured: true,
    trending: true,
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    ],
    inclusions: [
      "Goa airport/railway pickup & drop",
      "4 nights beach resort accommodation",
      "Daily breakfast",
      "North & South Goa sightseeing by private vehicle",
      "Spice farm visit with lunch",
      "Beach party night at Anjuna",
      "Dudhsagar Falls trip",
    ],
    exclusions: [
      "Flights/trains to/from Goa",
      "Lunches & dinners (except spice farm)",
      "Water sports (optional extras)",
      "Personal expenses",
    ],
    faqs: [
      { question: "Is Goa good for solo travellers?", answer: "Absolutely! Our group trips are perfect for solos — you'll meet amazing people from across India." },
      { question: "What is the beach resort like?", answer: "We stay at 3-star beachside resorts in North Goa with a pool, restaurant, and beach access." },
    ],
    itinerary: [
      { dayNumber: 1, title: "Goa Arrival — Beach Check-In", description: "Picked up from Goa airport/railway station. Check into beach resort, freshen up and head to Calangute Beach for sunset.", activities: ["Airport/railway pickup", "Resort check-in", "Calangute Beach sunset", "Welcome dinner & group introductions"], meals: ["Dinner"], stay: "Beach Resort, North Goa" },
      { dayNumber: 2, title: "North Goa Day — Forts & Flea Markets", description: "Explore Chapora Fort, Anjuna Beach, Anjuna Flea Market and the Portuguese quarter.", activities: ["Chapora Fort", "Anjuna Beach", "Anjuna Flea Market", "Baga Beach evening", "Optional nightlife"], meals: ["Breakfast"], stay: "Beach Resort, North Goa" },
      { dayNumber: 3, title: "South Goa — Palolem & Colva", description: "Drive to South Goa's quieter, more beautiful beaches. Palolem's crescent beach is unforgettable.", activities: ["Drive to South Goa", "Palolem Beach", "Colva Beach", "Seafood lunch", "Return to resort"], meals: ["Breakfast"], stay: "Beach Resort, North Goa" },
      { dayNumber: 4, title: "Spice Farm & Dudhsagar Falls", description: "Morning spice farm tour with organic lunch. Afternoon at the majestic Dudhsagar waterfall.", activities: ["Sahakari Spice Farm tour", "Organic Goan lunch", "Dudhsagar Falls hike", "Sunset at resort pool", "Beach party night"], meals: ["Breakfast", "Lunch"], stay: "Beach Resort, North Goa" },
      { dayNumber: 5, title: "Free Morning → Departure", description: "Free morning for last-minute shopping, beach time or spa. Hotel checkout and drop to airport/railway.", activities: ["Free morning", "Checkout by 10 AM", "Last-minute Calangute market shopping", "Airport/railway drop"], meals: ["Breakfast"] },
    ],
    metaTitle: "Goa Beach Trip | 5D/4N ₹10,999 | editmytrips",
    metaDescription: "5-day Goa trip with beach resort stay, spice farm, Dudhsagar Falls, Anjuna flea market and beach party. Starting ₹10,999.",
    rating: 4.7,
    reviewCount: 89,
  },
  {
    title: "Spiti Valley Expedition",
    slug: "spiti-valley-expedition",
    shortDescription: "8 days in the cold desert — ancient monasteries, moon-like valleys, and stargazing at 4,000m.",
    description: `<p>Spiti Valley is not for the faint-hearted — but it rewards the bold traveller like nowhere else. This 8-day circuit takes you from Shimla through the Kinnaur Valley to the heart of Spiti, visiting Key Monastery, Kibber (the world's highest motorable village), and Chandratal Lake.</p>`,
    destSlug: "spiti-valley",
    durationDays: 8,
    durationNights: 7,
    basePrice: 18999,
    discountedPrice: 16999,
    tripType: "Trek" as const,
    difficulty: "Challenging" as const,
    minAge: 18,
    maxGroupSize: 12,
    status: "PUBLISHED" as const,
    featured: false,
    trending: true,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    ],
    inclusions: [
      "Delhi – Shimla – Spiti – Manali – Delhi transport",
      "7 nights accommodation (guesthouses/camps)",
      "All meals (breakfast + dinner daily)",
      "Experienced high-altitude guide",
      "Oxygen cylinder (emergency)",
      "Monastery entry permits",
    ],
    exclusions: [
      "Inner Line Permit (₹400, arranged by us)",
      "Personal travel insurance (mandatory)",
      "Meals not mentioned",
    ],
    faqs: [
      { question: "Is altitude sickness a risk?", answer: "Yes, Spiti is at 3,800–4,500m. We carry oxygen cylinders and acclimatize properly with a slow ascent. Those with heart conditions should consult a doctor." },
    ],
    itinerary: [],
    metaTitle: "Spiti Valley Expedition | 8D/7N ₹16,999 | editmytrips",
    metaDescription: "8-day Spiti Valley circuit from Delhi — Key Monastery, Chandratal Lake, Kibber village. Starting ₹16,999.",
    rating: 4.9,
    reviewCount: 67,
  },
  {
    title: "Varanasi Spiritual Journey",
    slug: "varanasi-spiritual-journey",
    shortDescription: "3 days in India's holiest city — ghats, Ganga Aarti, and ancient temples.",
    description: `<p>Varanasi is the eternal city — one of the oldest continuously inhabited places on Earth. Witness the soul-stirring Ganga Aarti at Dashashwamedh Ghat, take a dawn boat ride on the Ganges, and explore the labyrinthine lanes of the old city.</p>`,
    destSlug: "varanasi",
    durationDays: 3,
    durationNights: 2,
    basePrice: 6499,
    discountedPrice: 5499,
    tripType: "Pilgrimage" as const,
    difficulty: "Easy" as const,
    minAge: 10,
    maxGroupSize: 20,
    status: "PUBLISHED" as const,
    featured: false,
    trending: false,
    coverImage: "https://images.unsplash.com/photo-1561361058-c12e9f6e8e3b?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1561361058-c12e9f6e8e3b?w=1200&q=80",
    ],
    inclusions: [
      "Train / bus transportation (Delhi – Varanasi – Delhi)",
      "2 nights heritage hotel accommodation",
      "Daily breakfast",
      "Ganga Aarti (evening) & dawn boat ride",
      "Kashi Vishwanath Temple darshan",
      "Sarnath day trip",
    ],
    exclusions: ["Lunches & dinners", "Personal shopping", "Donations at temples"],
    faqs: [],
    itinerary: [],
    metaTitle: "Varanasi Spiritual Trip | 3D/2N ₹5,499 | editmytrips",
    metaDescription: "3-day Varanasi spiritual journey with Ganga Aarti, dawn boat ride, Kashi Vishwanath and Sarnath. Starting ₹5,499.",
    rating: 4.6,
    reviewCount: 54,
  },
  {
    title: "Kaziranga Safari Special",
    slug: "kaziranga-safari-special",
    shortDescription: "3 days of jungle safaris hunting the rare one-horned rhinoceros in Assam's wilderness.",
    description: `<p>Kaziranga National Park is a UNESCO World Heritage Site and home to the world's largest population of one-horned rhinoceroses. This 3-day trip includes elephant-back safaris, jeep safaris in multiple zones, and a visit to a local tea plantation.</p>`,
    destSlug: "kaziranga",
    durationDays: 3,
    durationNights: 2,
    basePrice: 14999,
    discountedPrice: 12999,
    tripType: "Wildlife" as const,
    difficulty: "Easy" as const,
    minAge: 8,
    maxGroupSize: 10,
    status: "PUBLISHED" as const,
    featured: false,
    trending: false,
    coverImage: "https://images.unsplash.com/photo-1566396535568-34282eecd10f?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566396535568-34282eecd10f?w=1200&q=80",
    ],
    inclusions: [
      "Flight Guwahati – Guwahati included",
      "2 nights Kaziranga jungle lodge",
      "All meals",
      "2 jeep safaris (Western & Central zones)",
      "1 elephant safari",
      "Tea estate visit",
      "Park entry fees",
    ],
    exclusions: ["Personal binoculars/cameras", "Tips to guides", "Personal expenses"],
    faqs: [],
    itinerary: [],
    metaTitle: "Kaziranga Safari | 3D/2N ₹12,999 | editmytrips",
    metaDescription: "3-day Kaziranga wildlife safari with elephant safaris, jeep safaris and one-horned rhino sightings. Starting ₹12,999.",
    rating: 4.8,
    reviewCount: 38,
  },
];

// ─── Experiences ─────────────────────────────────────────────────────────────
const experiences = [
  {
    title: "Sunrise Yoga on the Ganges",
    slug: "sunrise-yoga-ganges",
    destSlug: "rishikesh",
    description: "Join certified local yoga instructors for a grounding asana session on the Ganges riverbank as the sun rises over the Himalayas.",
    duration: "2 hours",
    price: 999,
    capacity: 20,
    category: "Yoga",
    highlights: ["Riverfront setting at Triveni Ghat", "All levels welcome", "Post-session masala chai", "Certified instructor"],
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"],
    status: "ACTIVE" as const,
    rating: 4.9,
    reviewCount: 203,
  },
  {
    title: "Old Manali Village Walk",
    slug: "old-manali-village-walk",
    destSlug: "manali",
    description: "Explore hidden Himachali hamlets with a knowledgeable local guide — ancient temples, apple orchards, and stunning mountain panoramas.",
    duration: "3 hours",
    price: 1299,
    capacity: 10,
    category: "Cultural",
    highlights: ["Off-the-beaten-path lanes", "Local snacks (siddu & apple juice)", "Hidimba Temple history", "Great photo ops"],
    images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80"],
    status: "ACTIVE" as const,
    rating: 4.7,
    reviewCount: 87,
  },
  {
    title: "Goa Spice Farm Tour",
    slug: "goa-spice-farm-tour",
    destSlug: "goa",
    description: "Visit a working organic spice farm, learn how cardamom, pepper, and turmeric grow, and sample freshly cooked Goan food.",
    duration: "4 hours",
    price: 1799,
    capacity: 15,
    category: "Culinary",
    highlights: ["Hands-on planting experience", "Organic certified farm", "Full Goan lunch included", "Complimentary kokum juice"],
    images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80"],
    status: "ACTIVE" as const,
    rating: 4.6,
    reviewCount: 134,
  },
  {
    title: "Beas River White Water Rafting",
    slug: "beas-rafting-manali",
    destSlug: "manali",
    description: "Raft through Grade II–III rapids on the Beas river with certified guides, safety equipment, and unforgettable views.",
    duration: "2.5 hours",
    price: 1499,
    capacity: 12,
    category: "Adventure",
    highlights: ["Grade II–III rapids", "Life jacket & helmet provided", "Post-rafting bonfire", "Beginners welcome"],
    images: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"],
    status: "ACTIVE" as const,
    rating: 4.8,
    reviewCount: 156,
  },
  {
    title: "Goa Sunset Catamaran Cruise",
    slug: "goa-sunset-cruise",
    destSlug: "goa",
    description: "Sail into the Arabian Sea sunset on a luxury catamaran with unlimited drinks, live music, and dolphin-spotting.",
    duration: "2 hours",
    price: 2499,
    capacity: 30,
    category: "Cruise",
    highlights: ["Dolphin spotting", "Unlimited soft drinks & beer", "Live DJ music", "Beautiful sunset views"],
    images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80"],
    status: "ACTIVE" as const,
    rating: 4.5,
    reviewCount: 211,
  },
];

// ─── Stories ─────────────────────────────────────────────────────────────────
const stories = [
  {
    title: "Rishikesh Hit Different This Time",
    slug: "rishikesh-hit-different",
    excerpt: "I went to Rishikesh looking for adventure and found something I didn't know I was missing.",
    content: `<p>It was my third time in Rishikesh. I thought I knew exactly what to expect — the rafting, the ashrams, the Instagram spots. But this time something was different.</p>
<p>We arrived at 5 AM after a night bus from Delhi. The camp was pitch dark except for the sound of the Ganga. Our trip captain, Ravi, met us with a smile and masala chai. "The river will set the pace today," he said.</p>
<p>The sunrise yoga session the next morning undid something in me. Sitting cross-legged on the riverbank, watching the mist lift off the Ganges as the first light hit the Himalayas — I genuinely cried. Didn't see that coming.</p>
<p>The rafting was incredible, sure. But what I remember most is the campfire on night two, when 14 strangers from Mumbai, Bangalore, Delhi and Kolkata sat together, shared stories, sang songs they half-remembered, and laughed until it hurt.</p>
<p>If you've been to Rishikesh before — go again. You'll find something new.</p>`,
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    category: "Travel",
    tags: ["rishikesh", "yoga", "rafting", "spirituality"],
    status: "PUBLISHED" as const,
    featured: true,
    readTime: 5,
    views: 12430,
    metaTitle: "Why Rishikesh Hit Different This Time | editmytrips Stories",
    metaDescription: "A personal essay about finding unexpected depth on a third visit to Rishikesh — rafting, yoga, and campfire conversations that changed everything.",
  },
  {
    title: "The ₹10,000 Budget That Took Me to Manali and Back",
    slug: "budget-manali-rishikesh",
    excerpt: "Backpacking through Himachal Pradesh doesn't have to break the bank. Here's exactly how I did it.",
    content: `<p>Everyone thinks Manali is expensive. They're wrong — if you go with the right group trip, ₹10,000 including transport is entirely possible.</p>
<p>I went with editmytrips on their Manali Snow Adventure package. The Volvo bus from Delhi was actually comfortable (I've taken worse flights), and we had 20 people sharing costs for transport and accommodation.</p>
<p><strong>The breakdown for my trip:</strong></p>
<ul><li>Group trip package (transport + hotel + meals): ₹7,999</li><li>Personal shopping at Old Manali: ₹800</li><li>Rohtang Pass permit (government fee): ₹150</li><li>Street food, chai, maggi: ₹600</li><li>Miscellaneous: ₹451</li></ul>
<p><strong>Total: ₹10,000</strong></p>
<p>The trick? Book a group trip instead of going solo. You split vehicle costs, get better accommodation rates, and frankly, it's more fun.</p>`,
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
    category: "Budget",
    tags: ["manali", "budget travel", "group trips", "himachal"],
    status: "PUBLISHED" as const,
    featured: false,
    readTime: 8,
    views: 8900,
    metaTitle: "Budget Manali Trip Under ₹10,000 | editmytrips Stories",
    metaDescription: "How I did a 4-day Manali trip for under ₹10,000 with transport, hotel, and all meals included. The exact cost breakdown.",
  },
  {
    title: "Anjuna Flea Market: What to Buy & What to Skip",
    slug: "anjuna-flea-market-guide",
    excerpt: "A seasoned Goa traveller shares her verdict on what's worth buying and what's a tourist trap.",
    content: `<p>The Anjuna Flea Market is a Goa institution. Every Wednesday, vendors from across India (and some from Tibet, Nepal, and even Israel) set up stalls selling everything from hand-embroidered kurtis to vintage cameras to live chickens.</p>
<p>After visiting six times, here's my honest guide:</p>
<h3>Buy These</h3>
<ul><li><strong>Kashmiri shawls:</strong> Look for the Pashmina certification tag. ₹800–2,000 is fair.</li><li><strong>Silver jewellery:</strong> Tribal silver from Rajasthan vendors is genuinely beautiful and fairly priced.</li><li><strong>Spices:</strong> The spice vendors near the market entrance sell incredible vanilla pods and Goan chilli powder.</li><li><strong>Hand-printed cotton:</strong> Block-print fabric from Gujarat vendors, sold by the metre.</li></ul>
<h3>Skip These</h3>
<ul><li><strong>"Genuine" antiques:</strong> Almost nothing at Anjuna is genuinely antique. Don't pay antique prices.</li><li><strong>Beachwear from market stalls:</strong> Quality is poor and identical to Mumbai street markets at 3x the price.</li></ul>`,
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    category: "Guide",
    tags: ["goa", "anjuna", "shopping", "flea market"],
    status: "PUBLISHED" as const,
    featured: false,
    readTime: 6,
    views: 15200,
    metaTitle: "Anjuna Flea Market Guide 2025 — What to Buy & Skip | editmytrips",
    metaDescription: "An insider guide to Anjuna Flea Market in Goa. What to buy (Pashmina, silver, spices) and what tourist traps to avoid.",
  },
  {
    title: "How Spiti Valley Changed the Way I Travel",
    slug: "spiti-valley-changed-me",
    excerpt: "At 4,500m, with no cell signal and no coffee, I had to sit with myself. It was exactly what I needed.",
    content: `<p>I've been to 23 states in India. I thought I'd seen everything. Spiti Valley proved me wrong in 8 days.</p>
<p>The landscape is unlike anything else on the subcontinent — brown, barren, moonlike, with the bluest skies I've ever seen and rivers so clear you can count pebbles 10 feet below. And then you turn a corner and there's a 1,000-year-old monastery perched on an impossible cliff.</p>
<p>Key Monastery at dawn. That's what did it for me. Standing in the courtyard as monks chanted, watching the valley wake up in golden light — I stopped thinking about work for the first time in years.</p>`,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    category: "Travel",
    tags: ["spiti", "himachal", "monastery", "travel philosophy"],
    status: "PUBLISHED" as const,
    featured: false,
    readTime: 7,
    views: 6100,
    metaTitle: "How Spiti Valley Changed the Way I Travel | editmytrips Stories",
    metaDescription: "A personal essay about finding perspective in the cold desert of Spiti Valley — Key Monastery, altitude, and the gift of no Wi-Fi.",
  },
];

// ─── Coupons ─────────────────────────────────────────────────────────────────
const coupons = [
  {
    code: "WELCOME10",
    description: "10% off your first trip — valid on all trips",
    type: "PERCENTAGE" as const,
    value: 10,
    minimumAmount: 3000,
    maximumDiscount: 1500,
    usageLimit: 500,
    usedCount: 127,
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2027-12-31"),
    active: true,
  },
  {
    code: "FLAT500",
    description: "Flat ₹500 off on bookings above ₹4,000",
    type: "FIXED" as const,
    value: 500,
    minimumAmount: 4000,
    usageLimit: 100,
    usedCount: 23,
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2027-12-31"),
    active: true,
  },
  {
    code: "SUMMER25",
    description: "25% off summer trips (Goa, Rishikesh)",
    type: "PERCENTAGE" as const,
    value: 25,
    minimumAmount: 5000,
    maximumDiscount: 3000,
    usageLimit: 200,
    usedCount: 0,
    validFrom: new Date("2026-04-01"),
    validUntil: new Date("2026-07-31"),
    active: true,
  },
  {
    code: "GROUPOF5",
    description: "₹1,000 off per head for groups of 5+",
    type: "FIXED" as const,
    value: 1000,
    minimumAmount: 20000,
    usageLimit: 50,
    usedCount: 8,
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2027-12-31"),
    active: true,
  },
];

// ─── Seed runner ─────────────────────────────────────────────────────────────
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

  // 1. Seed destinations
  const destDocs = await Destination.insertMany(destinations);
  const destMap = new Map((destDocs as DestinationDoc[]).map((d) => [d.slug, d._id]));
  console.log(`✅ Seeded ${destDocs.length} destinations`);

  // 2. Seed users
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const userDocs = await User.insertMany(users.map((u) => ({ ...u, passwordHash })));
  const adminUser = userDocs[0];
  console.log(`✅ Seeded ${userDocs.length} users`);

  // 3. Seed captains
  const captainUsers = userDocs.filter((u) => u.role === "CAPTAIN");
  if (captainUsers.length > 0) {
    const captainData = captainUsers.map((c, i) => ({
      userId: c._id,
      bio: i === 0
        ? "Ex-mountaineer and certified trek leader with 8 years of high-altitude experience in Himachal and Uttarakhand."
        : "Water sports instructor and yoga practitioner with expertise in river rafting and coastal adventures.",
      rating: i === 0 ? 4.9 : 4.8,
      reviewCount: i === 0 ? 134 : 98,
      tripsLed: i === 0 ? 28 : 19,
      specializations: i === 0 ? ["Adventure", "Trek"] : ["Adventure", "Beach"],
      languages: ["Hindi", "English"],
      experience: i === 0 ? 8 : 5,
      avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80",
      available: true,
    }));
    await Captain.insertMany(captainData);
    console.log(`✅ Seeded ${captainData.length} captains`);
  }

  // 4. Seed trips
  const tripDocs = await Trip.insertMany(
    trips.map((t) => {
      const { destSlug, ...rest } = t;
      return {
        ...rest,
        destinationId: destMap.get(destSlug) ?? destDocs[0]._id,
      };
    })
  );
  const tripMap = new Map(tripDocs.map((t) => [(t as unknown as { slug: string }).slug, t._id]));
  console.log(`✅ Seeded ${tripDocs.length} trips`);

  // 5. Seed departures (3 per trip, bi-weekly)
  const departures: Array<Record<string, unknown>> = [];
  for (const trip of tripDocs) {
    const tData = trip as unknown as { discountedPrice?: number; basePrice: number; durationDays: number };
    const price = tData.discountedPrice ?? tData.basePrice;
    for (let i = 1; i <= 3; i++) {
      const start = new Date();
      start.setDate(start.getDate() + i * 14);
      const end = new Date(start);
      end.setDate(end.getDate() + (tData.durationDays - 1));
      departures.push({
        tripId: trip._id,
        startDate: start,
        endDate: end,
        capacity: 20,
        bookedSeats: Math.floor(Math.random() * 10),
        availableSeats: 20 - Math.floor(Math.random() * 10),
        price,
        meetingPoint: "Delhi ISBT Kashmere Gate, Gate No. 3",
        meetingTime: "07:00 AM",
        status: "ACTIVE",
      });
    }
  }
  const departureDocs = await Departure.insertMany(departures);
  console.log(`✅ Seeded ${departureDocs.length} departures`);

  // 6. Seed experiences
  const expDocs = await Experience.insertMany(
    experiences.map((e) => {
      const { destSlug, ...rest } = e;
      return { ...rest, destinationId: destMap.get(destSlug) ?? destDocs[0]._id };
    })
  );
  console.log(`✅ Seeded ${expDocs.length} experiences`);

  // 7. Seed stories (assigned to admin user)
  const storyDocs = await Story.insertMany(
    stories.map((s) => ({
      ...s,
      authorId: adminUser._id,
      publishedAt: new Date(),
    }))
  );
  console.log(`✅ Seeded ${storyDocs.length} stories`);

  // 8. Seed coupons
  await Coupon.insertMany(coupons);
  console.log(`✅ Seeded ${coupons.length} coupons`);

  // 9. Seed sample reviews for the first two trips
  const customerUser = userDocs.find((u) => u.role === "CUSTOMER")!;
  const manaliTripId = tripMap.get("manali-snow-adventure");
  const rishikeshTripId = tripMap.get("rishikesh-river-soul-retreat");
  const sampleBookingId = departureDocs[0]._id; // reuse departure as placeholder

  const reviewData = [
    { userId: customerUser._id, tripId: manaliTripId, bookingId: sampleBookingId, rating: 5, title: "Life-changing!", content: "The Rohtang Pass views were absolutely unreal. Captain Ravi knew every hidden spot. Will book again.", status: "APPROVED", verifiedBooking: true },
    { userId: customerUser._id, tripId: manaliTripId, bookingId: sampleBookingId, rating: 4, title: "Great trip, minor logistics hiccup", content: "Everything was well organised. The bus was a bit late but Manali made up for it completely. Hotel was clean and food was good.", status: "APPROVED", verifiedBooking: true },
    { userId: customerUser._id, tripId: rishikeshTripId, bookingId: sampleBookingId, rating: 5, title: "Best trip of my life", content: "The sunrise yoga session on day 2 is something I'll never forget. The rafting was thrilling. Our captain Sonia was brilliant.", status: "APPROVED", verifiedBooking: true },
  ];
  await Review.insertMany(reviewData);
  console.log(`✅ Seeded ${reviewData.length} reviews`);

  console.log("\n🎉 Seed complete! Login with any seeded email at password: editmytrips123");
  console.log("   Admin: arjun@editmytrips.com");
  console.log("   Customer: kabir@editmytrips.com");

  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});