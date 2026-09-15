import type {
  Trip,
  Destination,
  Experience,
  Story,
  Review,
  Captain,
  TripDeparture,
  Booking,
  User,
  Coupon,
  AuditLog,
  DashboardStats,
  RevenueChartData,
} from "@/types";

// ─────────────────────────────────────────────
// Realistic mock data — swap data sources for
// MongoDB repositories when backend is wired.
// ─────────────────────────────────────────────

const now = new Date();
const d = (daysFromNow: number) =>
  new Date(now.getTime() + daysFromNow * 86400000);

// ── Destinations ──────────────────────────────

export const MOCK_DESTINATIONS: Destination[] = [
  {
    _id: "dest_001",
    name: "Manali",
    slug: "manali",
    state: "Himachal Pradesh",
    country: "India",
    description:
      "Nestled in the Beas River Valley, Manali is a high-altitude Himalayan resort town known for its dramatic scenery, adventure sports, and vibrant culture. From snowy peaks to lush valleys, it's a playground for every kind of traveller.",
    heroImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    bestTime: "October to June",
    latitude: 32.2396,
    longitude: 77.1887,
    featured: true,
    tripCount: 14,
    createdAt: d(-90),
    updatedAt: d(-10),
  },
  {
    _id: "dest_002",
    name: "Spiti Valley",
    slug: "spiti-valley",
    state: "Himachal Pradesh",
    country: "India",
    description:
      "A cold desert mountain valley in the Himalayas, Spiti sits at an altitude of 12,500 feet. Raw, remote, and breathtaking — this is off-the-beaten-path India at its finest.",
    heroImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    bestTime: "June to September",
    latitude: 32.2461,
    longitude: 78.0338,
    featured: true,
    tripCount: 8,
    createdAt: d(-80),
    updatedAt: d(-5),
  },
  {
    _id: "dest_003",
    name: "Rishikesh",
    slug: "rishikesh",
    state: "Uttarakhand",
    country: "India",
    description:
      "The yoga capital of the world and India's adventure sports hub. White water rafting, bungee jumping, camping on the Ganges banks — Rishikesh has it all.",
    heroImage:
      "https://images.unsplash.com/photo-1583309219338-a582f1db9bde?w=1200&q=80",
    gallery: [],
    bestTime: "September to May",
    latitude: 30.0869,
    longitude: 78.2676,
    featured: true,
    tripCount: 11,
    createdAt: d(-70),
    updatedAt: d(-3),
  },
  {
    _id: "dest_004",
    name: "Goa",
    slug: "goa",
    state: "Goa",
    country: "India",
    description:
      "India's beach paradise. Think golden sands, Portuguese architecture, fresh seafood, and a pace of life that refuses to rush.",
    heroImage:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    gallery: [],
    bestTime: "November to March",
    latitude: 15.2993,
    longitude: 74.124,
    featured: true,
    tripCount: 9,
    createdAt: d(-60),
    updatedAt: d(-2),
  },
  {
    _id: "dest_005",
    name: "Meghalaya",
    slug: "meghalaya",
    state: "Meghalaya",
    country: "India",
    description:
      "The abode of clouds. Living root bridges, crystal clear rivers, and the wettest place on earth — Meghalaya is unlike anywhere else in India.",
    heroImage:
      "https://images.unsplash.com/photo-1581918719906-c2b6b92ae47c?w=1200&q=80",
    gallery: [],
    bestTime: "October to May",
    latitude: 25.467,
    longitude: 91.3662,
    featured: false,
    tripCount: 6,
    createdAt: d(-50),
    updatedAt: d(-1),
  },
  {
    _id: "dest_006",
    name: "Kashmir",
    slug: "kashmir",
    state: "Jammu & Kashmir",
    country: "India",
    description:
      "Heaven on Earth. Dal Lake houseboats, Mughal gardens, snow-capped mountains, and some of the most stunning valleys in the world.",
    heroImage:
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80",
    gallery: [],
    bestTime: "April to October",
    latitude: 33.7782,
    longitude: 76.5762,
    featured: true,
    tripCount: 12,
    createdAt: d(-40),
    updatedAt: d(-1),
  },
];

// ── Captains ──────────────────────────────────

export const MOCK_CAPTAINS: Captain[] = [
  {
    _id: "cap_001",
    userId: "usr_cap_001",
    bio: "Mountain enthusiast with 10+ years of guiding experience across the Himalayas. Certified mountaineer and wilderness first responder.",
    rating: 4.9,
    reviewCount: 234,
    tripsLed: 127,
    specializations: ["Trek", "Adventure", "Backpacking"],
    languages: ["Hindi", "English", "Pahari"],
    experience: 10,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    documents: [],
    available: true,
    createdAt: d(-200),
    updatedAt: d(-5),
  },
  {
    _id: "cap_002",
    userId: "usr_cap_002",
    bio: "Beach and coastal adventure specialist. Expert in water sports, island hopping, and creating unforgettable coastal experiences.",
    rating: 4.8,
    reviewCount: 189,
    tripsLed: 84,
    specializations: ["Beach", "Road Trip", "Adventure"],
    languages: ["Hindi", "English", "Konkani"],
    experience: 7,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    documents: [],
    available: true,
    createdAt: d(-150),
    updatedAt: d(-2),
  },
  {
    _id: "cap_003",
    userId: "usr_cap_003",
    bio: "Cultural travel specialist with deep knowledge of North Indian heritage, temples, and local traditions. Fluent in 4 languages.",
    rating: 4.7,
    reviewCount: 156,
    tripsLed: 93,
    specializations: ["Cultural", "Pilgrimage", "Wildlife"],
    languages: ["Hindi", "English", "Rajasthani", "Bengali"],
    experience: 8,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    documents: [],
    available: false,
    createdAt: d(-180),
    updatedAt: d(-1),
  },
];

// ── Trips ─────────────────────────────────────

export const MOCK_TRIPS: Trip[] = [
  {
    _id: "trip_001",
    title: "Manali Backpacking Adventure",
    slug: "manali-backpacking-adventure",
    shortDescription:
      "5 days of raw Himalayan exploration — snow peaks, pine forests, and bonfire nights.",
    description:
      "This isn't your average Manali trip. We skip the tourist hotspots and take you deep into the Himalayan wilderness — hidden villages, ancient temples, and trails most travellers never find. Nights around campfires, mornings with mountain views, and days filled with adventure. Join a group of like-minded explorers and make memories that last a lifetime.",
    destinationId: "dest_001",
    destination: MOCK_DESTINATIONS[0],
    durationDays: 5,
    durationNights: 4,
    basePrice: 8999,
    discountedPrice: 8499,
    tripType: "Backpacking",
    difficulty: "Moderate",
    minAge: 18,
    maxGroupSize: 20,
    status: "PUBLISHED",
    featured: true,
    trending: true,
    coverImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    inclusions: [
      "Transportation (Delhi – Manali – Delhi)",
      "Accommodation (3 nights hotel, 1 night camping)",
      "All meals (breakfast + dinner)",
      "Experienced trip captain",
      "Bonfire nights",
      "Entry fees & permits",
      "First aid & emergency support",
    ],
    exclusions: [
      "Personal expenses",
      "Adventure activities (optional)",
      "Lunch",
      "Travel insurance",
      "Tips for captain",
    ],
    faqs: [
      {
        question: "What is the fitness requirement?",
        answer:
          "Moderate fitness is required. You should be comfortable walking 6–8 km per day on uneven terrain.",
      },
      {
        question: "What should I pack?",
        answer:
          "Warm layers, trekking shoes, rain jacket, sunscreen, and basic medications. We'll send a detailed packing list after booking.",
      },
      {
        question: "Is solo booking allowed?",
        answer:
          "Absolutely! Most of our travellers book solo. You'll be part of a group from day one.",
      },
    ],
    itinerary: [
      {
        _id: "itin_001_1",
        tripId: "trip_001",
        dayNumber: 1,
        title: "Delhi → Manali (Overnight Bus)",
        description:
          "Meet your trip captain and fellow travellers at the departure point in Delhi. Board the overnight Volvo bus to Manali. Get to know the group over snacks and good vibes.",
        activities: ["Group meetup", "Overnight bus journey", "Ice-breaker sessions"],
        meals: ["Dinner"],
        transport: "Volvo AC Bus",
        highlights: ["Meet your tribe", "Departure night energy"],
      },
      {
        _id: "itin_001_2",
        tripId: "trip_001",
        dayNumber: 2,
        title: "Arrive Manali — Explore Old Manali",
        description:
          "Arrive in Manali early morning. Check in, freshen up, and head out to explore Old Manali — the Hadimba Temple, Mall Road, and local cafes.",
        activities: [
          "Check-in",
          "Hadimba Temple",
          "Old Manali street walk",
          "Local café hopping",
        ],
        meals: ["Breakfast", "Dinner"],
        stay: "Hotel Himalayan View",
        transport: "Walking",
        highlights: ["Hadimba Temple vibes", "Old Manali cafes"],
      },
      {
        _id: "itin_001_3",
        tripId: "trip_001",
        dayNumber: 3,
        title: "Solang Valley & Snow Activities",
        description:
          "Full day at Solang Valley — skiing, zorbing, snow scooters (optional, extra cost). End the day with sunset views and a bonfire back at camp.",
        activities: [
          "Solang Valley excursion",
          "Snow activities",
          "Sunset photography",
          "Bonfire night",
        ],
        meals: ["Breakfast", "Dinner"],
        stay: "Riverside Camp",
        transport: "Private cab",
        distance: "15 km from Manali",
        highlights: ["Snow fun", "Bonfire under the stars"],
      },
      {
        _id: "itin_001_4",
        tripId: "trip_001",
        dayNumber: 4,
        title: "Sissu & Atal Tunnel Drive",
        description:
          "Drive through the iconic Atal Tunnel to Sissu — a hidden gem on the other side with turquoise lakes and open meadows. Perfect for photos and reflection.",
        activities: [
          "Atal Tunnel drive",
          "Sissu exploration",
          "Waterfall walk",
          "Photography session",
        ],
        meals: ["Breakfast", "Dinner"],
        stay: "Hotel Himalayan View",
        transport: "Private cab",
        distance: "26 km via tunnel",
        highlights: ["Atal Tunnel experience", "Sissu's hidden beauty"],
      },
      {
        _id: "itin_001_5",
        tripId: "trip_001",
        dayNumber: 5,
        title: "Manali → Delhi (Departure)",
        description:
          "Morning free for last-minute shopping and café visits. Board the evening bus back to Delhi. Reach Delhi next morning.",
        activities: ["Free morning", "Shopping", "Departure"],
        meals: ["Breakfast"],
        transport: "Volvo AC Bus",
        highlights: ["Final goodbyes", "Memories packed"],
      },
    ],
    captainId: "cap_001",
    captain: MOCK_CAPTAINS[0],
    rating: 4.8,
    reviewCount: 124,
    metaTitle: "Manali Backpacking Adventure — 5 Days | GetSet Junction",
    metaDescription:
      "5 days of raw Himalayan exploration in Manali. Snow peaks, pine forests, bonfire nights. Starting ₹8,499.",
    createdAt: d(-60),
    updatedAt: d(-3),
  },
  {
    _id: "trip_002",
    title: "Spiti Valley Expedition",
    slug: "spiti-valley-expedition",
    shortDescription:
      "9 days through the world's highest motorable roads and ancient monasteries.",
    description:
      "Spiti is not for the faint-hearted — and that's exactly why we love it. 9 days through India's most remote high-altitude desert valley, visiting ancient Buddhist monasteries, staying in homestays, and driving roads that touch the sky.",
    destinationId: "dest_002",
    destination: MOCK_DESTINATIONS[1],
    durationDays: 9,
    durationNights: 8,
    basePrice: 18999,
    tripType: "Adventure",
    difficulty: "Challenging",
    minAge: 21,
    maxGroupSize: 12,
    status: "PUBLISHED",
    featured: true,
    trending: false,
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    gallery: [],
    inclusions: [
      "Shimla – Spiti – Manali transportation",
      "All accommodation (homestays + hotels)",
      "All meals",
      "Monastery permits",
      "Trip captain",
      "Emergency oxygen supply",
    ],
    exclusions: [
      "Personal expenses",
      "Travel insurance",
      "Flight/train to Shimla",
    ],
    faqs: [
      {
        question: "Is altitude sickness a concern?",
        answer:
          "Yes. Spiti reaches 14,000+ feet. We acclimatize gradually and carry emergency oxygen. We recommend consulting a doctor before booking.",
      },
    ],
    captainId: "cap_001",
    captain: MOCK_CAPTAINS[0],
    rating: 4.9,
    reviewCount: 67,
    createdAt: d(-50),
    updatedAt: d(-2),
  },
  {
    _id: "trip_003",
    title: "Rishikesh River & Soul Retreat",
    slug: "rishikesh-river-soul-retreat",
    shortDescription:
      "3 days of white water rafting, yoga, and camping on the Ganges banks.",
    description:
      "Rishikesh does something to you. The sound of the Ganges, early morning yoga, the smell of incense, and the rush of white water rapids — it resets you completely. This 3-day retreat combines adventure with mindfulness.",
    destinationId: "dest_003",
    destination: MOCK_DESTINATIONS[2],
    durationDays: 3,
    durationNights: 2,
    basePrice: 5999,
    discountedPrice: 4999,
    tripType: "Adventure",
    difficulty: "Easy",
    minAge: 16,
    maxGroupSize: 16,
    status: "PUBLISHED",
    featured: false,
    trending: true,
    coverImage:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    gallery: [],
    inclusions: [
      "Delhi – Rishikesh – Delhi transport",
      "2 nights riverside camping",
      "All meals",
      "Rafting (16 km)",
      "Yoga sessions",
      "Bonfire",
    ],
    exclusions: ["Bungee jumping (optional)", "Personal expenses"],
    faqs: [
      {
        question: "Can non-swimmers do rafting?",
        answer:
          "Yes! Life jackets and helmets are provided. Our guides are trained river safety experts.",
      },
    ],
    captainId: "cap_002",
    captain: MOCK_CAPTAINS[1],
    rating: 4.7,
    reviewCount: 198,
    createdAt: d(-40),
    updatedAt: d(-1),
  },
  {
    _id: "trip_004",
    title: "Goa Beach & Culture Escape",
    slug: "goa-beach-culture-escape",
    shortDescription:
      "4 days of sun, sand, feni, and Portuguese history. The Goa you haven't seen.",
    description:
      "Forget the party Goa. We take you to the real one — heritage villages, spice farms, deserted beaches, and fish thalis so good you'll dream about them. Plus, all the beaches you love.",
    destinationId: "dest_004",
    destination: MOCK_DESTINATIONS[3],
    durationDays: 4,
    durationNights: 3,
    basePrice: 12499,
    tripType: "Cultural",
    difficulty: "Easy",
    minAge: 18,
    maxGroupSize: 18,
    status: "PUBLISHED",
    featured: false,
    trending: true,
    coverImage:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    gallery: [],
    inclusions: [
      "Goa airport/railway pickup & drop",
      "3 nights beach resort accommodation",
      "Daily breakfast",
      "Goa sightseeing",
      "Spice farm visit",
      "Beach party night",
    ],
    exclusions: ["Flights/trains", "Lunches & dinners (mostly)", "Water sports"],
    faqs: [],
    captainId: "cap_002",
    captain: MOCK_CAPTAINS[1],
    rating: 4.6,
    reviewCount: 231,
    createdAt: d(-30),
    updatedAt: d(-1),
  },
  {
    _id: "trip_005",
    title: "Kashmir Great Lakes Trek",
    slug: "kashmir-great-lakes-trek",
    shortDescription:
      "7 days trekking through 7 alpine lakes at 12,000–13,000 feet.",
    description:
      "The Kashmir Great Lakes trek is one of India's most spectacular high-altitude treks. Seven pristine alpine lakes, vast meadows, and panoramic Himalayan views — this is bucket-list territory.",
    destinationId: "dest_006",
    destination: MOCK_DESTINATIONS[5],
    durationDays: 7,
    durationNights: 6,
    basePrice: 22999,
    tripType: "Trek",
    difficulty: "Challenging",
    minAge: 21,
    maxGroupSize: 10,
    status: "PUBLISHED",
    featured: true,
    trending: false,
    coverImage:
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80",
    gallery: [],
    inclusions: [
      "Srinagar – trek base – Srinagar transport",
      "Full tenting accommodation",
      "All meals on trek",
      "Experienced trek captain + guides",
      "Mules for luggage",
      "Permits",
      "Emergency medical kit",
    ],
    exclusions: ["Flights to Srinagar", "Personal equipment", "Insurance"],
    faqs: [
      {
        question: "What is the trek difficulty like?",
        answer:
          "This is a challenging trek with daily distances of 10–14 km at altitude. Good physical preparation is essential.",
      },
    ],
    captainId: "cap_001",
    captain: MOCK_CAPTAINS[0],
    rating: 4.9,
    reviewCount: 89,
    createdAt: d(-25),
    updatedAt: d(-1),
  },
  {
    _id: "trip_006",
    title: "Meghalaya Roots & Waterfalls",
    slug: "meghalaya-roots-waterfalls",
    shortDescription:
      "6 days exploring living root bridges, crystal rivers, and the world's wettest village.",
    description:
      "Meghalaya is India's best-kept secret and we want to keep it that way — which is why our groups are small and our footprint minimal. Living root bridges, underground caves, crystal clear rivers that look photoshopped, and Cherrapunji's legendary rainfall.",
    destinationId: "dest_005",
    destination: MOCK_DESTINATIONS[4],
    durationDays: 6,
    durationNights: 5,
    basePrice: 16499,
    tripType: "Adventure",
    difficulty: "Moderate",
    minAge: 18,
    maxGroupSize: 10,
    status: "PUBLISHED",
    featured: false,
    trending: false,
    coverImage:
      "https://images.unsplash.com/photo-1581918719906-c2b6b92ae47c?w=1200&q=80",
    gallery: [],
    inclusions: [
      "Guwahati/Shillong airport pickup",
      "5 nights accommodation (mix of hotels and homestays)",
      "All meals",
      "All local transfers",
      "Cave and waterfall entry fees",
      "Trip captain",
    ],
    exclusions: ["Flights to Guwahati", "Personal expenses"],
    faqs: [],
    captainId: "cap_003",
    captain: MOCK_CAPTAINS[2],
    rating: 4.8,
    reviewCount: 52,
    createdAt: d(-20),
    updatedAt: d(-1),
  },
];

// ── Departures ────────────────────────────────

export const MOCK_DEPARTURES: TripDeparture[] = [
  {
    _id: "dep_001",
    tripId: "trip_001",
    trip: MOCK_TRIPS[0],
    startDate: d(12),
    endDate: d(16),
    capacity: 20,
    bookedSeats: 17,
    availableSeats: 3,
    price: 8499,
    meetingPoint: "Kashmiri Gate ISBT, Delhi",
    meetingTime: "9:00 PM",
    status: "ACTIVE",
    captainId: "cap_001",
    captain: MOCK_CAPTAINS[0],
    createdAt: d(-30),
    updatedAt: d(-1),
  },
  {
    _id: "dep_002",
    tripId: "trip_001",
    trip: MOCK_TRIPS[0],
    startDate: d(26),
    endDate: d(30),
    capacity: 20,
    bookedSeats: 7,
    availableSeats: 13,
    price: 8999,
    meetingPoint: "Kashmiri Gate ISBT, Delhi",
    meetingTime: "9:00 PM",
    status: "ACTIVE",
    captainId: "cap_001",
    captain: MOCK_CAPTAINS[0],
    createdAt: d(-25),
    updatedAt: d(-1),
  },
  {
    _id: "dep_003",
    tripId: "trip_002",
    trip: MOCK_TRIPS[1],
    startDate: d(14),
    endDate: d(22),
    capacity: 12,
    bookedSeats: 12,
    availableSeats: 0,
    price: 18999,
    meetingPoint: "Shimla Bus Stand",
    meetingTime: "8:00 AM",
    status: "CLOSED",
    captainId: "cap_001",
    captain: MOCK_CAPTAINS[0],
    createdAt: d(-20),
    updatedAt: d(-2),
  },
  {
    _id: "dep_004",
    tripId: "trip_003",
    trip: MOCK_TRIPS[2],
    startDate: d(18),
    endDate: d(20),
    capacity: 16,
    bookedSeats: 14,
    availableSeats: 2,
    price: 4999,
    meetingPoint: "Haridwar Railway Station",
    meetingTime: "7:00 AM",
    status: "ACTIVE",
    captainId: "cap_002",
    captain: MOCK_CAPTAINS[1],
    createdAt: d(-15),
    updatedAt: d(-1),
  },
  {
    _id: "dep_005",
    tripId: "trip_004",
    trip: MOCK_TRIPS[3],
    startDate: d(20),
    endDate: d(23),
    capacity: 18,
    bookedSeats: 11,
    availableSeats: 7,
    price: 12499,
    meetingPoint: "Goa Airport, Terminal 1",
    meetingTime: "11:00 AM",
    status: "ACTIVE",
    captainId: "cap_002",
    captain: MOCK_CAPTAINS[1],
    createdAt: d(-10),
    updatedAt: d(-1),
  },
];

// ── Reviews ───────────────────────────────────

export const MOCK_REVIEWS: Review[] = [
  {
    _id: "rev_001",
    userId: "usr_001",
    user: {
      _id: "usr_001",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80",
      role: "CUSTOMER",
      createdAt: d(-200),
      updatedAt: d(-1),
    },
    tripId: "trip_001",
    bookingId: "bkg_001",
    rating: 5,
    title: "Best trip of my life!",
    content:
      "Absolutely loved every moment of the Manali trip. Our captain Rohan was incredible — knowledgeable, fun, and made the whole group feel like family within hours. The Sissu day was a revelation. I had no idea such beauty existed so close.",
    status: "APPROVED",
    verifiedBooking: true,
    createdAt: d(-20),
    updatedAt: d(-18),
  },
  {
    _id: "rev_002",
    userId: "usr_002",
    user: {
      _id: "usr_002",
      name: "Priya Menon",
      email: "priya@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      role: "CUSTOMER",
      createdAt: d(-180),
      updatedAt: d(-1),
    },
    tripId: "trip_003",
    bookingId: "bkg_002",
    rating: 5,
    title: "Rishikesh hit different",
    content:
      "I went solo and came back with 15 new friends. The rafting was exhilarating, the yoga sessions were peaceful, and the campfire conversations went till 2 AM every night. GetSet Junction nails the group dynamics.",
    status: "APPROVED",
    verifiedBooking: true,
    createdAt: d(-15),
    updatedAt: d(-12),
  },
  {
    _id: "rev_003",
    userId: "usr_003",
    user: {
      _id: "usr_003",
      name: "Arjun Patel",
      email: "arjun@example.com",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
      role: "CUSTOMER",
      createdAt: d(-160),
      updatedAt: d(-1),
    },
    tripId: "trip_002",
    bookingId: "bkg_003",
    rating: 5,
    title: "Spiti changed my perspective on life",
    content:
      "9 days in Spiti felt like a lifetime. The landscapes are unlike anything I've seen — Moon-like terrain, ancient monasteries perched on cliffs, and a silence that's almost spiritual. Highly recommend to anyone seeking a truly different experience.",
    status: "APPROVED",
    verifiedBooking: true,
    createdAt: d(-10),
    updatedAt: d(-8),
  },
  {
    _id: "rev_004",
    userId: "usr_004",
    user: {
      _id: "usr_004",
      name: "Sneha Iyer",
      email: "sneha@example.com",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&q=80",
      role: "CUSTOMER",
      createdAt: d(-140),
      updatedAt: d(-1),
    },
    tripId: "trip_001",
    bookingId: "bkg_004",
    rating: 4,
    title: "Great value, amazing group",
    content:
      "The trip was very well organized. The captain was attentive and the itinerary was perfectly paced. One small gripe — the hotel on day 2 wasn't quite as described. But the camping night more than made up for it!",
    status: "APPROVED",
    verifiedBooking: true,
    createdAt: d(-8),
    updatedAt: d(-6),
  },
];

// ── Experiences ───────────────────────────────

export const MOCK_EXPERIENCES: Experience[] = [
  {
    _id: "exp_001",
    title: "Manali Sunset Trek to Bhrigu Lake",
    slug: "manali-sunset-bhrigu-lake-trek",
    destinationId: "dest_001",
    destination: MOCK_DESTINATIONS[0],
    description:
      "A 4-hour guided trek to the sacred Bhrigu Lake at 14,100 feet. Witness a Himalayan sunset that will stay with you forever.",
    duration: "4 hours",
    price: 1499,
    capacity: 8,
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    category: "Trekking",
    highlights: ["Guided trek", "Sunset at 14,100 ft", "Lake photography", "Certified guide"],
    status: "ACTIVE",
    rating: 4.9,
    reviewCount: 43,
    createdAt: d(-40),
    updatedAt: d(-2),
  },
  {
    _id: "exp_002",
    title: "Rishikesh White Water Rafting — 16 km",
    slug: "rishikesh-white-water-rafting-16km",
    destinationId: "dest_003",
    destination: MOCK_DESTINATIONS[2],
    description:
      "Navigate Class III–IV rapids on the holy Ganges with certified river guides. The 16 km stretch is the ultimate rush.",
    duration: "3 hours",
    price: 999,
    capacity: 8,
    images: [
      "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80",
    ],
    category: "Water Sports",
    highlights: ["16 km river stretch", "Class III-IV rapids", "Safety equipment included", "Cliff jumping opportunity"],
    status: "ACTIVE",
    rating: 4.8,
    reviewCount: 312,
    createdAt: d(-35),
    updatedAt: d(-1),
  },
  {
    _id: "exp_003",
    title: "Goa Portuguese Heritage Walk",
    slug: "goa-portuguese-heritage-walk",
    destinationId: "dest_004",
    destination: MOCK_DESTINATIONS[3],
    description:
      "A 3-hour walking tour through Old Goa's UNESCO-listed churches, colonial mansions, and spice markets with a local historian.",
    duration: "3 hours",
    price: 699,
    capacity: 12,
    images: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    ],
    category: "Cultural",
    highlights: ["UNESCO heritage sites", "Local historian guide", "Spice market visit", "Traditional Goan lunch"],
    status: "ACTIVE",
    rating: 4.7,
    reviewCount: 87,
    createdAt: d(-30),
    updatedAt: d(-1),
  },
  {
    _id: "exp_004",
    title: "Kashmir Shikara Sunset Cruise",
    slug: "kashmir-shikara-sunset-cruise",
    destinationId: "dest_006",
    destination: MOCK_DESTINATIONS[5],
    description:
      "Glide across the mirror-like Dal Lake in a traditional Shikara as the Himalayas turn golden in the setting sun. Pure magic.",
    duration: "2 hours",
    price: 1299,
    capacity: 6,
    images: [
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    ],
    category: "Leisure",
    highlights: ["Dal Lake sunset", "Traditional Shikara boat", "Floating garden visit", "Kashmiri tea served"],
    status: "ACTIVE",
    rating: 4.9,
    reviewCount: 156,
    createdAt: d(-25),
    updatedAt: d(-1),
  },
];

// ── Stories ───────────────────────────────────

export const MOCK_STORIES: Story[] = [
  {
    _id: "story_001",
    title: "Why Spiti Valley Should Be On Every Indian's Bucket List",
    slug: "why-spiti-valley-bucket-list",
    excerpt:
      "We've been to a lot of beautiful places. None of them made us feel the way Spiti did. Here's why this cold desert is unlike anything in India.",
    content: "<p>Full rich text content goes here...</p>",
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    authorId: "usr_admin_001",
    author: {
      _id: "usr_admin_001",
      name: "Ahqaf Ali",
      email: "ahqaf@getsetjunction.com",
      role: "EDITOR",
      createdAt: d(-300),
      updatedAt: d(-1),
    },
    category: "Destination Guide",
    tags: ["Spiti", "Himachal Pradesh", "Road Trip", "Bucket List"],
    status: "PUBLISHED",
    featured: true,
    readTime: 8,
    views: 4523,
    publishedAt: d(-15),
    createdAt: d(-20),
    updatedAt: d(-15),
  },
  {
    _id: "story_002",
    title: "Solo Travel in India as a Woman — Real Talk from Our Captains",
    slug: "solo-travel-india-woman-real-talk",
    excerpt:
      "We asked three of our most experienced female trip captains about safety, freedom, and what solo travel in India really looks like in 2026.",
    content: "<p>Full rich text content goes here...</p>",
    coverImage:
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1200&q=80",
    authorId: "usr_admin_002",
    author: {
      _id: "usr_admin_002",
      name: "Meera Kapoor",
      email: "meera@getsetjunction.com",
      role: "EDITOR",
      createdAt: d(-280),
      updatedAt: d(-1),
    },
    category: "Solo Travel",
    tags: ["Solo Travel", "Women Travel", "Safety", "India"],
    status: "PUBLISHED",
    featured: true,
    readTime: 12,
    views: 7812,
    publishedAt: d(-10),
    createdAt: d(-14),
    updatedAt: d(-10),
  },
  {
    _id: "story_003",
    title: "The ₹10,000 Budget That Took Me to Rishikesh, Manali, and Back",
    slug: "10000-budget-rishikesh-manali",
    excerpt:
      "Yes, it's possible. Here's exactly how I planned it, what I spent, and what I'd do differently.",
    content: "<p>Full rich text content goes here...</p>",
    coverImage:
      "https://images.unsplash.com/photo-1583309219338-a582f1db9bde?w=1200&q=80",
    authorId: "usr_001",
    author: {
      _id: "usr_001",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "CUSTOMER",
      createdAt: d(-200),
      updatedAt: d(-1),
    },
    category: "Budget Travel",
    tags: ["Budget Travel", "Backpacking", "Manali", "Rishikesh"],
    status: "PUBLISHED",
    featured: false,
    readTime: 6,
    views: 3201,
    publishedAt: d(-7),
    createdAt: d(-9),
    updatedAt: d(-7),
  },
  {
    _id: "story_004",
    title: "Monsoon in Meghalaya: The India Nobody Talks About",
    slug: "monsoon-meghalaya-hidden-india",
    excerpt:
      "Most people warn you away from Meghalaya in the monsoon. Most people are wrong.",
    content: "<p>Full rich text content goes here...</p>",
    coverImage:
      "https://images.unsplash.com/photo-1581918719906-c2b6b92ae47c?w=1200&q=80",
    authorId: "usr_admin_001",
    author: {
      _id: "usr_admin_001",
      name: "Ahqaf Ali",
      email: "ahqaf@getsetjunction.com",
      role: "EDITOR",
      createdAt: d(-300),
      updatedAt: d(-1),
    },
    category: "Destination Guide",
    tags: ["Meghalaya", "Monsoon", "Northeast India", "Hidden Gems"],
    status: "PUBLISHED",
    featured: false,
    readTime: 10,
    views: 2890,
    publishedAt: d(-5),
    createdAt: d(-7),
    updatedAt: d(-5),
  },
];

// ── Users (Customers) ─────────────────────────

export const MOCK_CUSTOMERS: User[] = [
  {
    _id: "usr_001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80",
    role: "CUSTOMER",
    createdAt: d(-200),
    updatedAt: d(-5),
  },
  {
    _id: "usr_002",
    name: "Priya Menon",
    email: "priya.menon@example.com",
    phone: "+91 91234 56789",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    role: "CUSTOMER",
    createdAt: d(-180),
    updatedAt: d(-3),
  },
  {
    _id: "usr_003",
    name: "Arjun Patel",
    email: "arjun.patel@example.com",
    phone: "+91 87654 32109",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
    role: "CUSTOMER",
    createdAt: d(-160),
    updatedAt: d(-2),
  },
  {
    _id: "usr_004",
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    phone: "+91 76543 21098",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&q=80",
    role: "CUSTOMER",
    createdAt: d(-140),
    updatedAt: d(-1),
  },
  {
    _id: "usr_005",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91 65432 10987",
    role: "CUSTOMER",
    createdAt: d(-120),
    updatedAt: d(-1),
  },
];

// ── Bookings ──────────────────────────────────

export const MOCK_BOOKINGS: Booking[] = [
  {
    _id: "bkg_001",
    bookingNumber: "GSJ10023",
    userId: "usr_001",
    user: MOCK_CUSTOMERS[0],
    tripId: "trip_001",
    trip: MOCK_TRIPS[0],
    departureId: "dep_001",
    departure: MOCK_DEPARTURES[0],
    travellers: [
      {
        _id: "btrav_001",
        bookingId: "bkg_001",
        fullName: "Rahul Sharma",
        age: 28,
        gender: "Male",
        phone: "+91 98765 43210",
        email: "rahul@example.com",
        emergencyContact: "Rohan Sharma",
        emergencyPhone: "+91 98765 00001",
      },
      {
        _id: "btrav_002",
        bookingId: "bkg_001",
        fullName: "Aanya Sharma",
        age: 26,
        gender: "Female",
        phone: "+91 98765 43211",
        email: "aanya@example.com",
        emergencyContact: "Rohan Sharma",
        emergencyPhone: "+91 98765 00001",
      },
    ],
    travellersCount: 2,
    subtotal: 16998,
    discount: 1000,
    couponCode: "WELCOME500",
    tax: 849.9,
    total: 16847.9,
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: d(-14),
    updatedAt: d(-12),
  },
  {
    _id: "bkg_002",
    bookingNumber: "GSJ10024",
    userId: "usr_002",
    user: MOCK_CUSTOMERS[1],
    tripId: "trip_003",
    trip: MOCK_TRIPS[2],
    departureId: "dep_004",
    departure: MOCK_DEPARTURES[3],
    travellers: [
      {
        _id: "btrav_003",
        bookingId: "bkg_002",
        fullName: "Priya Menon",
        age: 27,
        gender: "Female",
        phone: "+91 91234 56789",
        email: "priya@example.com",
        emergencyContact: "Suresh Menon",
        emergencyPhone: "+91 91234 00001",
      },
    ],
    travellersCount: 1,
    subtotal: 4999,
    discount: 0,
    tax: 249.95,
    total: 5248.95,
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: d(-10),
    updatedAt: d(-8),
  },
  {
    _id: "bkg_003",
    bookingNumber: "GSJ10025",
    userId: "usr_003",
    user: MOCK_CUSTOMERS[2],
    tripId: "trip_002",
    trip: MOCK_TRIPS[1],
    departureId: "dep_003",
    departure: MOCK_DEPARTURES[2],
    travellers: [
      {
        _id: "btrav_004",
        bookingId: "bkg_003",
        fullName: "Arjun Patel",
        age: 30,
        gender: "Male",
        phone: "+91 87654 32109",
        email: "arjun@example.com",
        emergencyContact: "Neha Patel",
        emergencyPhone: "+91 87654 00001",
      },
    ],
    travellersCount: 1,
    subtotal: 18999,
    discount: 0,
    tax: 949.95,
    total: 19948.95,
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: d(-7),
    updatedAt: d(-5),
  },
  {
    _id: "bkg_004",
    bookingNumber: "GSJ10026",
    userId: "usr_004",
    user: MOCK_CUSTOMERS[3],
    tripId: "trip_004",
    trip: MOCK_TRIPS[3],
    departureId: "dep_005",
    departure: MOCK_DEPARTURES[4],
    travellers: [
      {
        _id: "btrav_005",
        bookingId: "bkg_004",
        fullName: "Sneha Iyer",
        age: 25,
        gender: "Female",
        phone: "+91 76543 21098",
        email: "sneha@example.com",
        emergencyContact: "Ravi Iyer",
        emergencyPhone: "+91 76543 00001",
      },
    ],
    travellersCount: 1,
    subtotal: 12499,
    discount: 0,
    tax: 624.95,
    total: 13123.95,
    paymentStatus: "PENDING",
    bookingStatus: "PENDING",
    createdAt: d(-2),
    updatedAt: d(-1),
  },
];

// ── Coupons ───────────────────────────────────

export const MOCK_COUPONS: Coupon[] = [
  {
    _id: "coup_001",
    code: "WELCOME500",
    description: "Welcome discount for first-time travellers",
    type: "FIXED",
    value: 500,
    minimumAmount: 4999,
    usageLimit: 1000,
    usedCount: 234,
    validFrom: d(-60),
    validUntil: d(60),
    active: true,
    createdAt: d(-60),
    updatedAt: d(-1),
  },
  {
    _id: "coup_002",
    code: "ADVENTURE10",
    description: "10% off on adventure trips",
    type: "PERCENTAGE",
    value: 10,
    minimumAmount: 8000,
    maximumDiscount: 2000,
    usageLimit: 500,
    usedCount: 87,
    validFrom: d(-30),
    validUntil: d(30),
    active: true,
    createdAt: d(-30),
    updatedAt: d(-1),
  },
  {
    _id: "coup_003",
    code: "MONSOON2026",
    description: "Monsoon sale — flat ₹1500 off",
    type: "FIXED",
    value: 1500,
    minimumAmount: 10000,
    usageLimit: 200,
    usedCount: 143,
    validFrom: d(-15),
    validUntil: d(45),
    active: true,
    createdAt: d(-15),
    updatedAt: d(-1),
  },
];

// ── Audit Logs ────────────────────────────────

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    _id: "audit_001",
    adminId: "usr_admin_001",
    admin: {
      _id: "usr_admin_001",
      name: "Ahqaf Ali",
      email: "ahqaf@getsetjunction.com",
      role: "SUPER_ADMIN",
      createdAt: d(-300),
      updatedAt: d(-1),
    },
    action: "UPDATE",
    entity: "Trip",
    entityId: "trip_001",
    entityName: "Manali Backpacking Adventure",
    before: { basePrice: 8499 },
    after: { basePrice: 8999 },
    createdAt: d(-1),
  },
  {
    _id: "audit_002",
    adminId: "usr_admin_001",
    admin: {
      _id: "usr_admin_001",
      name: "Ahqaf Ali",
      email: "ahqaf@getsetjunction.com",
      role: "SUPER_ADMIN",
      createdAt: d(-300),
      updatedAt: d(-1),
    },
    action: "PUBLISH",
    entity: "Story",
    entityId: "story_001",
    entityName: "Why Spiti Valley Should Be On Every Indian's Bucket List",
    createdAt: d(-15),
  },
  {
    _id: "audit_003",
    adminId: "usr_admin_001",
    admin: {
      _id: "usr_admin_001",
      name: "Ahqaf Ali",
      email: "ahqaf@getsetjunction.com",
      role: "SUPER_ADMIN",
      createdAt: d(-300),
      updatedAt: d(-1),
    },
    action: "APPROVE",
    entity: "Review",
    entityId: "rev_001",
    entityName: "Review by Rahul Sharma",
    createdAt: d(-18),
  },
];

// ── Dashboard Stats ───────────────────────────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  revenue: {
    total: 482340,
    thisMonth: 84200,
    trend: 12.4,
  },
  bookings: {
    total: 128,
    thisMonth: 24,
    trend: 8.7,
    pending: 6,
    confirmed: 96,
  },
  trips: {
    total: 32,
    published: 28,
    draft: 4,
  },
  departures: {
    upcoming: 18,
    active: 12,
  },
  customers: {
    total: 847,
    newThisMonth: 67,
    trend: 15.2,
  },
};

export const MOCK_REVENUE_CHART: RevenueChartData[] = [
  { month: "Jan", revenue: 42000, bookings: 14 },
  { month: "Feb", revenue: 51000, bookings: 17 },
  { month: "Mar", revenue: 78000, bookings: 26 },
  { month: "Apr", revenue: 91000, bookings: 30 },
  { month: "May", revenue: 64000, bookings: 21 },
  { month: "Jun", revenue: 72000, bookings: 24 },
  { month: "Jul", revenue: 84200, bookings: 28 },
  { month: "Aug", revenue: 84200, bookings: 24 },
];

// ── Helper Functions ──────────────────────────

export function getTripBySlug(slug: string): Trip | undefined {
  return MOCK_TRIPS.find((t) => t.slug === slug);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return MOCK_DESTINATIONS.find((d) => d.slug === slug);
}

export function getStoryBySlug(slug: string): Story | undefined {
  return MOCK_STORIES.find((s) => s.slug === slug);
}

export function getTripDepartures(tripId: string): TripDeparture[] {
  return MOCK_DEPARTURES.filter((d) => d.tripId === tripId);
}

export function getTripReviews(tripId: string): Review[] {
  return MOCK_REVIEWS.filter((r) => r.tripId === tripId && r.status === "APPROVED");
}

export function getFeaturedTrips(): Trip[] {
  return MOCK_TRIPS.filter((t) => t.featured && t.status === "PUBLISHED");
}

export function getTrendingTrips(): Trip[] {
  return MOCK_TRIPS.filter((t) => t.trending && t.status === "PUBLISHED");
}

export function getFeaturedDestinations(): Destination[] {
  return MOCK_DESTINATIONS.filter((d) => d.featured);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
