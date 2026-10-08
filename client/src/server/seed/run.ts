/**
 * Database seed — mirrors the exact content the public site showed from
 * mock-data, plus the operational records that make every flow real:
 * completed bookings (fuel the post-trip review popup), payments,
 * coupons, leads, captains and staff accounts.
 *
 * Run: npm run seed   (destructive — wipes the 11 collections first)
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../db/mongoose";
import { User } from "../models/User";
import { Captain } from "../models/Captain";
import { Destination } from "../models/Destination";
import { Trip } from "../models/Trip";
import { Departure } from "../models/Departure";
import { Booking } from "../models/Booking";
import { Payment } from "../models/Payment";
import { Review } from "../models/Review";
import { Story } from "../models/Story";
import { Experience } from "../models/Experience";
import { Coupon } from "../models/Coupon";
import { Lead } from "../models/Lead";
import { refreshTripRating } from "../services/review.service";

const DEFAULT_PASSWORD = "Travel@123";

const d = (daysFromNow: number) => new Date(Date.now() + daysFromNow * 86_400_000);

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80`;

async function seed() {
  await connectDB();

  // ── wipe ────────────────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Captain.deleteMany({}),
    Destination.deleteMany({}),
    Trip.deleteMany({}),
    Departure.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({}),
    Review.deleteMany({}),
    Story.deleteMany({}),
    Experience.deleteMany({}),
    Coupon.deleteMany({}),
    Lead.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // ── users ───────────────────────────────────────────────────────────
  const staff = await User.insertMany([
    { name: "Ahqaf Ali", email: "ahqaf@editmytrips.com", phone: "+91 90000 00001", role: "SUPER_ADMIN", passwordHash, createdAt: d(-300) },
    { name: "Meera Kapoor", email: "meera@editmytrips.com", phone: "+91 90000 00002", role: "EDITOR", passwordHash, createdAt: d(-280) },
    { name: "Priya Ops", email: "priya.ops@editmytrips.com", phone: "+91 90000 00003", role: "OPERATIONS", passwordHash, createdAt: d(-270) },
  ]);

  const captainUsers = await User.insertMany([
    { name: "Ravi Thakur", email: "ravi@editmytrips.com", phone: "+91 90000 00011", role: "CAPTAIN", passwordHash, avatar: img("photo-1507003211169-0a1dd7228f2d", 200), createdAt: d(-200) },
    { name: "Sonia Naik", email: "sonia@editmytrips.com", phone: "+91 90000 00012", role: "CAPTAIN", passwordHash, avatar: img("photo-1500648767791-00dcc994a43e", 200), createdAt: d(-150) },
    { name: "Imran Sheikh", email: "imran@editmytrips.com", phone: "+91 90000 00013", role: "CAPTAIN", passwordHash, avatar: img("photo-1472099645785-5658abf4ff4e", 200), createdAt: d(-180) },
  ]);

  const customers = await User.insertMany([
    { name: "Rahul Sharma", email: "rahul.sharma@example.com", phone: "+91 98765 43210", role: "CUSTOMER", passwordHash, avatar: img("photo-1633332755192-727a05c4013d", 100), createdAt: d(-200) },
    { name: "Priya Menon", email: "priya.menon@example.com", phone: "+91 91234 56789", role: "CUSTOMER", passwordHash, avatar: img("photo-1494790108377-be9c29b29330", 100), createdAt: d(-180) },
    { name: "Arjun Patel", email: "arjun.patel@example.com", phone: "+91 87654 32109", role: "CUSTOMER", passwordHash, avatar: img("photo-1527980965255-d3b416303d12", 100), createdAt: d(-160) },
    { name: "Sneha Iyer", email: "sneha.iyer@example.com", phone: "+91 76543 21098", role: "CUSTOMER", passwordHash, avatar: img("photo-1607746882042-944635dfe10e", 100), createdAt: d(-140) },
    { name: "Vikram Singh", email: "vikram.singh@example.com", phone: "+91 65432 10987", role: "CUSTOMER", passwordHash, createdAt: d(-120) },
  ]);
  const [rahul, priyaM, arjun, sneha, vikram] = customers;

  // ── captains ────────────────────────────────────────────────────────
  const captains = await Captain.insertMany([
    {
      userId: captainUsers[0]._id,
      bio: "Mountain enthusiast with 10+ years of guiding experience across the Himalayas. Certified mountaineer and wilderness first responder.",
      rating: 4.9, reviewCount: 234, tripsLed: 127,
      specializations: ["Trek", "Adventure", "Backpacking"],
      languages: ["Hindi", "English", "Pahari"],
      experience: 10, avatar: img("photo-1507003211169-0a1dd7228f2d", 200), available: true, createdAt: d(-200),
    },
    {
      userId: captainUsers[1]._id,
      bio: "Beach and coastal adventure specialist. Expert in water sports, island hopping, and creating unforgettable coastal experiences.",
      rating: 4.8, reviewCount: 189, tripsLed: 84,
      specializations: ["Beach", "Road Trip", "Adventure"],
      languages: ["Hindi", "English", "Konkani"],
      experience: 7, avatar: img("photo-1500648767791-00dcc994a43e", 200), available: true, createdAt: d(-150),
    },
    {
      userId: captainUsers[2]._id,
      bio: "Cultural travel specialist with deep knowledge of North Indian heritage, temples, and local traditions. Fluent in 4 languages.",
      rating: 4.7, reviewCount: 156, tripsLed: 93,
      specializations: ["Cultural", "Pilgrimage", "Wildlife"],
      languages: ["Hindi", "English", "Rajasthani", "Bengali"],
      experience: 8, avatar: img("photo-1472099645785-5658abf4ff4e", 200), available: false, createdAt: d(-180),
    },
  ]);
  const [capRavi, capSonia, capImran] = captains;

  // ── destinations ────────────────────────────────────────────────────
  const [manali, spiti, rishikesh, goa, meghalaya, kashmir] = await Destination.insertMany([
    {
      name: "Manali", slug: "manali", state: "Himachal Pradesh", country: "India",
      description: "Nestled in the Beas River Valley, Manali is a high-altitude Himalayan resort town known for its dramatic scenery, adventure sports, and vibrant culture. From snowy peaks to lush valleys, it's a playground for every kind of traveller.",
      heroImage: img("photo-1626621341517-bbf3d9990a23"),
      gallery: [img("photo-1588083949404-c4f1ed1323b3", 800), img("photo-1506905925346-21bda4d32df4", 800), img("photo-1464822759023-fed622ff2c3b", 800)],
      bestTime: "October to June", latitude: 32.2396, longitude: 77.1887, featured: true, createdAt: d(-90),
    },
    {
      name: "Spiti Valley", slug: "spiti-valley", state: "Himachal Pradesh", country: "India",
      description: "A cold desert mountain valley in the Himalayas, Spiti sits at an altitude of 12,500 feet. Raw, remote, and breathtaking — this is off-the-beaten-path India at its finest.",
      heroImage: img("photo-1544735716-392fe2489ffa"),
      gallery: [img("photo-1506905925346-21bda4d32df4", 800), img("photo-1464822759023-fed622ff2c3b", 800)],
      bestTime: "June to September", latitude: 32.2461, longitude: 78.0338, featured: true, createdAt: d(-80),
    },
    {
      name: "Rishikesh", slug: "rishikesh", state: "Uttarakhand", country: "India",
      description: "The yoga capital of the world and India's adventure sports hub. White water rafting, bungee jumping, camping on the Ganges banks — Rishikesh has it all.",
      heroImage: img("photo-1470071459604-3b5ec3a7fe05"),
      gallery: [], bestTime: "September to May", latitude: 30.0869, longitude: 78.2676, featured: true, createdAt: d(-70),
    },
    {
      name: "Goa", slug: "goa", state: "Goa", country: "India",
      description: "India's beach paradise. Think golden sands, Portuguese architecture, fresh seafood, and a pace of life that refuses to rush.",
      heroImage: img("photo-1512343879784-a960bf40e7f2"),
      gallery: [], bestTime: "November to March", latitude: 15.2993, longitude: 74.124, featured: true, createdAt: d(-60),
    },
    {
      name: "Meghalaya", slug: "meghalaya", state: "Meghalaya", country: "India",
      description: "The abode of clouds. Living root bridges, crystal clear rivers, and the wettest place on earth — Meghalaya is unlike anywhere else in India.",
      heroImage: img("photo-1441974231531-c6227db76b6e"),
      gallery: [], bestTime: "October to May", latitude: 25.467, longitude: 91.3662, featured: false, createdAt: d(-50),
    },
    {
      name: "Kashmir", slug: "kashmir", state: "Jammu & Kashmir", country: "India",
      description: "Heaven on Earth. Dal Lake houseboats, Mughal gardens, snow-capped mountains, and some of the most stunning valleys in the world.",
      heroImage: img("photo-1566837945700-30057527ade0"),
      gallery: [], bestTime: "April to October", latitude: 33.7782, longitude: 76.5762, featured: true, createdAt: d(-40),
    },
  ]);

  // ── trips ───────────────────────────────────────────────────────────
  const [tripManali, tripSpiti, tripRishikesh, tripGoa, , tripMeghalaya] = await Trip.insertMany([
    {
      title: "Manali Backpacking Adventure", slug: "manali-backpacking-adventure",
      shortDescription: "5 days of raw Himalayan exploration — snow peaks, pine forests, and bonfire nights.",
      description: "This isn't your average Manali trip. We skip the tourist hotspots and take you deep into the Himalayan wilderness — hidden villages, ancient temples, and trails most travellers never find. Nights around campfires, mornings with mountain views, and days filled with adventure. Join a group of like-minded explorers and make memories that last a lifetime.",
      destinationId: manali._id, durationDays: 5, durationNights: 4,
      basePrice: 8999, discountedPrice: 8499,
      tripType: "Backpacking", difficulty: "Moderate", minAge: 18, maxGroupSize: 20,
      status: "PUBLISHED", featured: true, trending: true,
      coverImage: img("photo-1626621341517-bbf3d9990a23"),
      gallery: [img("photo-1588083949404-c4f1ed1323b3", 800), img("photo-1506905925346-21bda4d32df4", 800), img("photo-1464822759023-fed622ff2c3b", 800)],
      inclusions: [
        "Transportation (Delhi – Manali – Delhi)", "Accommodation (3 nights hotel, 1 night camping)",
        "All meals (breakfast + dinner)", "Experienced trip captain", "Bonfire nights",
        "Entry fees & permits", "First aid & emergency support",
      ],
      exclusions: ["Personal expenses", "Adventure activities (optional)", "Lunch", "Travel insurance", "Tips for captain"],
      faqs: [
        { question: "What is the fitness requirement?", answer: "Moderate fitness is required. You should be comfortable walking 6–8 km per day on uneven terrain." },
        { question: "What should I pack?", answer: "Warm layers, trekking shoes, rain jacket, sunscreen, and basic medications. We'll send a detailed packing list after booking." },
        { question: "Is solo booking allowed?", answer: "Absolutely! Most of our travellers book solo. You'll be part of a group from day one." },
      ],
      itinerary: [
        { dayNumber: 1, title: "Delhi → Manali (Overnight Bus)", description: "Meet your trip captain and fellow travellers at the departure point in Delhi. Board the overnight Volvo bus to Manali. Get to know the group over snacks and good vibes.", activities: ["Group meetup", "Overnight bus journey", "Ice-breaker sessions"], meals: ["Dinner"], transport: "Volvo AC Bus", highlights: ["Meet your tribe", "Departure night energy"] },
        { dayNumber: 2, title: "Arrive Manali — Explore Old Manali", description: "Arrive in Manali early morning. Check in, freshen up, and head out to explore Old Manali — the Hadimba Temple, Mall Road, and local cafes.", activities: ["Check-in", "Hadimba Temple", "Old Manali street walk", "Local café hopping"], meals: ["Breakfast", "Dinner"], stay: "Hotel Himalayan View", transport: "Walking", highlights: ["Hadimba Temple vibes", "Old Manali cafes"] },
        { dayNumber: 3, title: "Solang Valley & Snow Activities", description: "Full day at Solang Valley — skiing, zorbing, snow scooters (optional, extra cost). End the day with sunset views and a bonfire back at camp.", activities: ["Solang Valley excursion", "Snow activities", "Sunset photography", "Bonfire night"], meals: ["Breakfast", "Dinner"], stay: "Riverside Camp", transport: "Private cab", distance: "15 km from Manali", highlights: ["Snow fun", "Bonfire under the stars"] },
        { dayNumber: 4, title: "Sissu & Atal Tunnel Drive", description: "Drive through the iconic Atal Tunnel to Sissu — a hidden gem on the other side with turquoise lakes and open meadows. Perfect for photos and reflection.", activities: ["Atal Tunnel drive", "Sissu exploration", "Waterfall walk", "Photography session"], meals: ["Breakfast", "Dinner"], stay: "Hotel Himalayan View", transport: "Private cab", distance: "26 km via tunnel", highlights: ["Atal Tunnel experience", "Sissu's hidden beauty"] },
        { dayNumber: 5, title: "Manali → Delhi (Departure)", description: "Morning free for last-minute shopping and café visits. Board the evening bus back to Delhi. Reach Delhi next morning.", activities: ["Free morning", "Shopping", "Departure"], meals: ["Breakfast"], transport: "Volvo AC Bus", highlights: ["Final goodbyes", "Memories packed"] },
      ],
      captainId: capRavi._id, rating: 4.8, reviewCount: 124,
      metaTitle: "Manali Backpacking Adventure — 5 Days | editmytrips",
      metaDescription: "5 days of raw Himalayan exploration in Manali. Snow peaks, pine forests, bonfire nights. Starting ₹8,499.",
      createdAt: d(-60),
    },
    {
      title: "Spiti Valley Expedition", slug: "spiti-valley-expedition",
      shortDescription: "9 days through the world's highest motorable roads and ancient monasteries.",
      description: "Spiti is not for the faint-hearted — and that's exactly why we love it. 9 days through India's most remote high-altitude desert valley, visiting ancient Buddhist monasteries, staying in homestays, and driving roads that touch the sky.",
      destinationId: spiti._id, durationDays: 9, durationNights: 8,
      basePrice: 18999,
      tripType: "Adventure", difficulty: "Challenging", minAge: 21, maxGroupSize: 12,
      status: "PUBLISHED", featured: true, trending: false,
      coverImage: img("photo-1544735716-392fe2489ffa"), gallery: [],
      inclusions: ["Shimla – Spiti – Manali transportation", "All accommodation (homestays + hotels)", "All meals", "Monastery permits", "Trip captain", "Emergency oxygen supply"],
      exclusions: ["Personal expenses", "Travel insurance", "Flight/train to Shimla"],
      faqs: [{ question: "Is altitude sickness a concern?", answer: "Yes. Spiti reaches 14,000+ feet. We acclimatize gradually and carry emergency oxygen. We recommend consulting a doctor before booking." }],
      captainId: capRavi._id, rating: 4.9, reviewCount: 67, createdAt: d(-50),
    },
    {
      title: "Rishikesh River & Soul Retreat", slug: "rishikesh-river-soul-retreat",
      shortDescription: "3 days of white water rafting, yoga, and camping on the Ganges banks.",
      description: "Rishikesh does something to you. The sound of the Ganges, early morning yoga, the smell of incense, and the rush of white water rapids — it resets you completely. This 3-day retreat combines adventure with mindfulness.",
      destinationId: rishikesh._id, durationDays: 3, durationNights: 2,
      basePrice: 5999, discountedPrice: 4999,
      tripType: "Adventure", difficulty: "Easy", minAge: 16, maxGroupSize: 16,
      status: "PUBLISHED", featured: false, trending: true,
      coverImage: img("photo-1470071459604-3b5ec3a7fe05"), gallery: [],
      inclusions: ["Delhi – Rishikesh – Delhi transport", "2 nights riverside camping", "All meals", "Rafting (16 km)", "Yoga sessions", "Bonfire"],
      exclusions: ["Bungee jumping (optional)", "Personal expenses"],
      faqs: [{ question: "Can non-swimmers do rafting?", answer: "Yes! Life jackets and helmets are provided. Our guides are trained river safety experts." }],
      captainId: capSonia._id, rating: 4.7, reviewCount: 198, createdAt: d(-40),
    },
    {
      title: "Goa Beach & Culture Escape", slug: "goa-beach-culture-escape",
      shortDescription: "4 days of sun, sand, feni, and Portuguese history. The Goa you haven't seen.",
      description: "Forget the party Goa. We take you to the real one — heritage villages, spice farms, deserted beaches, and fish thalis so good you'll dream about them. Plus, all the beaches you love.",
      destinationId: goa._id, durationDays: 4, durationNights: 3,
      basePrice: 12499,
      tripType: "Cultural", difficulty: "Easy", minAge: 18, maxGroupSize: 18,
      status: "PUBLISHED", featured: false, trending: true,
      coverImage: img("photo-1512343879784-a960bf40e7f2"), gallery: [],
      inclusions: ["Goa airport/railway pickup & drop", "3 nights beach resort accommodation", "Daily breakfast", "Goa sightseeing", "Spice farm visit", "Beach party night"],
      exclusions: ["Flights/trains", "Lunches & dinners (mostly)", "Water sports"],
      faqs: [], captainId: capSonia._id, rating: 4.6, reviewCount: 231, createdAt: d(-30),
    },
    {
      title: "Kashmir Great Lakes Trek", slug: "kashmir-great-lakes-trek",
      shortDescription: "7 days trekking through 7 alpine lakes at 12,000–13,000 feet.",
      description: "The Kashmir Great Lakes trek is one of India's most spectacular high-altitude treks. Seven pristine alpine lakes, vast meadows, and panoramic Himalayan views — this is bucket-list territory.",
      destinationId: kashmir._id, durationDays: 7, durationNights: 6,
      basePrice: 22999,
      tripType: "Trek", difficulty: "Challenging", minAge: 21, maxGroupSize: 10,
      status: "PUBLISHED", featured: true, trending: false,
      coverImage: img("photo-1566837945700-30057527ade0"), gallery: [],
      inclusions: ["Srinagar – trek base – Srinagar transport", "Full tenting accommodation", "All meals on trek", "Experienced trek captain + guides", "Mules for luggage", "Permits", "Emergency medical kit"],
      exclusions: ["Flights to Srinagar", "Personal equipment", "Insurance"],
      faqs: [{ question: "What is the trek difficulty like?", answer: "This is a challenging trek with daily distances of 10–14 km at altitude. Good physical preparation is essential." }],
      captainId: capRavi._id, rating: 4.9, reviewCount: 89, createdAt: d(-25),
    },
    {
      title: "Meghalaya Roots & Waterfalls", slug: "meghalaya-roots-waterfalls",
      shortDescription: "6 days exploring living root bridges, crystal rivers, and the world's wettest village.",
      description: "Meghalaya is India's best-kept secret and we want to keep it that way — which is why our groups are small and our footprint minimal. Living root bridges, underground caves, crystal clear rivers that look photoshopped, and Cherrapunji's legendary rainfall.",
      destinationId: meghalaya._id, durationDays: 6, durationNights: 5,
      basePrice: 16499,
      tripType: "Adventure", difficulty: "Moderate", minAge: 18, maxGroupSize: 10,
      status: "PUBLISHED", featured: false, trending: false,
      coverImage: img("photo-1441974231531-c6227db76b6e"), gallery: [],
      inclusions: ["Guwahati/Shillong airport pickup", "5 nights accommodation (mix of hotels and homestays)", "All meals", "All local transfers", "Cave and waterfall entry fees", "Trip captain"],
      exclusions: ["Flights to Guwahati", "Personal expenses"],
      faqs: [], captainId: capImran._id, rating: 4.8, reviewCount: 52, createdAt: d(-20),
    },
  ]);

  // ── departures ──────────────────────────────────────────────────────
  // Upcoming (bookable) + past (COMPLETED — fuel for the review flow).
  const departures = await Departure.insertMany([
    // upcoming — the same five the UI showed
    { tripId: tripManali._id, startDate: d(12), endDate: d(16), capacity: 20, bookedSeats: 15, availableSeats: 5, price: 8499, meetingPoint: "Kashmiri Gate ISBT, Delhi", meetingTime: "9:00 PM", status: "ACTIVE", captainId: capRavi._id, createdAt: d(-30) },
    { tripId: tripManali._id, startDate: d(26), endDate: d(30), capacity: 20, bookedSeats: 7, availableSeats: 13, price: 8999, meetingPoint: "Kashmiri Gate ISBT, Delhi", meetingTime: "9:00 PM", status: "ACTIVE", captainId: capRavi._id, createdAt: d(-25) },
    { tripId: tripSpiti._id, startDate: d(14), endDate: d(22), capacity: 12, bookedSeats: 12, availableSeats: 0, price: 18999, meetingPoint: "Shimla Bus Stand", meetingTime: "8:00 AM", status: "CLOSED", captainId: capRavi._id, createdAt: d(-20) },
    { tripId: tripRishikesh._id, startDate: d(18), endDate: d(20), capacity: 16, bookedSeats: 14, availableSeats: 2, price: 4999, meetingPoint: "Haridwar Railway Station", meetingTime: "7:00 AM", status: "ACTIVE", captainId: capSonia._id, createdAt: d(-15) },
    { tripId: tripGoa._id, startDate: d(20), endDate: d(23), capacity: 18, bookedSeats: 11, availableSeats: 7, price: 12499, meetingPoint: "Goa Airport, Terminal 1", meetingTime: "11:00 AM", status: "ACTIVE", captainId: capSonia._id, createdAt: d(-10) },
    { tripId: tripSpiti._id, startDate: d(45), endDate: d(53), capacity: 12, bookedSeats: 3, availableSeats: 9, price: 18999, meetingPoint: "Shimla Bus Stand", meetingTime: "8:00 AM", status: "ACTIVE", captainId: capRavi._id, createdAt: d(-5) },
    { tripId: tripMeghalaya._id, startDate: d(33), endDate: d(38), capacity: 10, bookedSeats: 4, availableSeats: 6, price: 16499, meetingPoint: "Guwahati Airport", meetingTime: "10:00 AM", status: "ACTIVE", captainId: capImran._id, createdAt: d(-5) },
    // past — completed trips
    { tripId: tripManali._id, startDate: d(-40), endDate: d(-36), capacity: 20, bookedSeats: 3, availableSeats: 17, price: 8499, meetingPoint: "Kashmiri Gate ISBT, Delhi", meetingTime: "9:00 PM", status: "COMPLETED", captainId: capRavi._id, createdAt: d(-70) },
    { tripId: tripManali._id, startDate: d(-70), endDate: d(-66), capacity: 20, bookedSeats: 1, availableSeats: 19, price: 8499, meetingPoint: "Kashmiri Gate ISBT, Delhi", meetingTime: "9:00 PM", status: "COMPLETED", captainId: capRavi._id, createdAt: d(-95) },
    { tripId: tripRishikesh._id, startDate: d(-50), endDate: d(-48), capacity: 16, bookedSeats: 1, availableSeats: 15, price: 4999, meetingPoint: "Haridwar Railway Station", meetingTime: "7:00 AM", status: "COMPLETED", captainId: capSonia._id, createdAt: d(-80) },
    { tripId: tripSpiti._id, startDate: d(-65), endDate: d(-57), capacity: 12, bookedSeats: 1, availableSeats: 11, price: 18999, meetingPoint: "Shimla Bus Stand", meetingTime: "8:00 AM", status: "COMPLETED", captainId: capRavi._id, createdAt: d(-95) },
    { tripId: tripGoa._id, startDate: d(-35), endDate: d(-32), capacity: 18, bookedSeats: 1, availableSeats: 17, price: 12499, meetingPoint: "Goa Airport, Terminal 1", meetingTime: "11:00 AM", status: "COMPLETED", captainId: capSonia._id, createdAt: d(-60) },
  ]);
  const [depManali12, , , depRishikeshUp, depGoaUp, , , depManaliPastA, depManaliPastB, depRishikeshPast, depSpitiPast, depGoaPast] = departures;

  // ── bookings + payments ─────────────────────────────────────────────
  // COMPLETED trips → eligible for reviews. Vikram completed Manali and has
  // NOT reviewed yet → his next visit triggers the post-trip review popup.
  const bookings = await Booking.insertMany([
    { // rahul — completed Manali (reviewed)
      bookingNumber: "EMT10023", userId: rahul._id, tripId: tripManali._id, departureId: depManaliPastA._id,
      travellers: [
        { fullName: "Rahul Sharma", age: 28, gender: "Male", phone: "+91 98765 43210", email: "rahul.sharma@example.com", emergencyContact: "Rohan Sharma", emergencyPhone: "+91 98765 00001" },
        { fullName: "Aanya Sharma", age: 26, gender: "Female", phone: "+91 98765 43211", email: "aanya@example.com", emergencyContact: "Rohan Sharma", emergencyPhone: "+91 98765 00001" },
      ],
      travellersCount: 2, subtotal: 16998, discount: 1000, couponCode: "WELCOME500", tax: 800, total: 16798,
      paymentStatus: "PAID", bookingStatus: "COMPLETED", createdAt: d(-55), updatedAt: d(-36),
    },
    { // sneha — completed Manali (reviewed)
      bookingNumber: "EMT10031", userId: sneha._id, tripId: tripManali._id, departureId: depManaliPastB._id,
      travellers: [{ fullName: "Sneha Iyer", age: 25, gender: "Female", phone: "+91 76543 21098", email: "sneha.iyer@example.com", emergencyContact: "Ravi Iyer", emergencyPhone: "+91 76543 00001" }],
      travellersCount: 1, subtotal: 8499, discount: 0, tax: 425, total: 8924,
      paymentStatus: "PAID", bookingStatus: "COMPLETED", createdAt: d(-85), updatedAt: d(-66),
    },
    { // priya — completed Rishikesh (reviewed)
      bookingNumber: "EMT10024", userId: priyaM._id, tripId: tripRishikesh._id, departureId: depRishikeshPast._id,
      travellers: [{ fullName: "Priya Menon", age: 27, gender: "Female", phone: "+91 91234 56789", email: "priya.menon@example.com", emergencyContact: "Suresh Menon", emergencyPhone: "+91 91234 00001" }],
      travellersCount: 1, subtotal: 4999, discount: 0, tax: 250, total: 5249,
      paymentStatus: "PAID", bookingStatus: "COMPLETED", createdAt: d(-60), updatedAt: d(-48),
    },
    { // arjun — completed Spiti (reviewed)
      bookingNumber: "EMT10025", userId: arjun._id, tripId: tripSpiti._id, departureId: depSpitiPast._id,
      travellers: [{ fullName: "Arjun Patel", age: 30, gender: "Male", phone: "+91 87654 32109", email: "arjun.patel@example.com", emergencyContact: "Neha Patel", emergencyPhone: "+91 87654 00001" }],
      travellersCount: 1, subtotal: 18999, discount: 0, tax: 950, total: 19949,
      paymentStatus: "PAID", bookingStatus: "COMPLETED", createdAt: d(-75), updatedAt: d(-57),
    },
    { // vikram — completed Goa, NOT reviewed yet → post-trip popup fires for him
      bookingNumber: "EMT10044", userId: vikram._id, tripId: tripGoa._id, departureId: depGoaPast._id,
      travellers: [{ fullName: "Vikram Singh", age: 31, gender: "Male", phone: "+91 65432 10987", email: "vikram.singh@example.com", emergencyContact: "Manpreet Singh", emergencyPhone: "+91 65432 00001" }],
      travellersCount: 1, subtotal: 12499, discount: 0, tax: 625, total: 13124,
      paymentStatus: "PAID", bookingStatus: "COMPLETED", createdAt: d(-45), updatedAt: d(-32),
    },
    { // rahul — upcoming CONFIRMED Rishikesh
      bookingNumber: "EMT10026", userId: rahul._id, tripId: tripRishikesh._id, departureId: depRishikeshUp._id,
      travellers: [{ fullName: "Rahul Sharma", age: 28, gender: "Male", phone: "+91 98765 43210", email: "rahul.sharma@example.com", emergencyContact: "Rohan Sharma", emergencyPhone: "+91 98765 00001" }],
      travellersCount: 1, subtotal: 4999, discount: 0, tax: 250, total: 5249,
      paymentStatus: "PAID", bookingStatus: "CONFIRMED", createdAt: d(-10), updatedAt: d(-8),
    },
    { // sneha — upcoming PENDING Goa (payment pending)
      bookingNumber: "EMT10027", userId: sneha._id, tripId: tripGoa._id, departureId: depGoaUp._id,
      travellers: [{ fullName: "Sneha Iyer", age: 25, gender: "Female", phone: "+91 76543 21098", email: "sneha.iyer@example.com", emergencyContact: "Ravi Iyer", emergencyPhone: "+91 76543 00001" }],
      travellersCount: 1, subtotal: 12499, discount: 0, tax: 625, total: 13124,
      paymentStatus: "PENDING", bookingStatus: "PENDING", createdAt: d(-2), updatedAt: d(-1),
    },
  ]);
  const [bkgRahulManali, bkgSnehaManali, bkgPriyaRishikesh, bkgArjunSpiti, bkgVikramGoa] = bookings;

  await Payment.insertMany([
    { bookingId: bkgRahulManali._id, provider: "MANUAL", orderId: "ord_seed_001", transactionId: "txn_seed_001", amount: 16798, status: "PAID", paymentMethod: "UPI", paidAt: d(-55) },
    { bookingId: bkgSnehaManali._id, provider: "MANUAL", orderId: "ord_seed_002", transactionId: "txn_seed_002", amount: 8924, status: "PAID", paymentMethod: "CARD", paidAt: d(-85) },
    { bookingId: bkgPriyaRishikesh._id, provider: "MANUAL", orderId: "ord_seed_003", transactionId: "txn_seed_003", amount: 5249, status: "PAID", paymentMethod: "UPI", paidAt: d(-60) },
    { bookingId: bkgArjunSpiti._id, provider: "MANUAL", orderId: "ord_seed_004", transactionId: "txn_seed_004", amount: 19949, status: "PAID", paymentMethod: "NET_BANKING", paidAt: d(-75) },
    { bookingId: bkgVikramGoa._id, provider: "MANUAL", orderId: "ord_seed_005", transactionId: "txn_seed_005", amount: 13124, status: "PAID", paymentMethod: "UPI", paidAt: d(-45) },
    { bookingId: bookings[5]._id, provider: "MANUAL", orderId: "ord_seed_006", transactionId: "txn_seed_006", amount: 5249, status: "PAID", paymentMethod: "UPI", paidAt: d(-10) },
    { bookingId: bookings[6]._id, provider: "MANUAL", orderId: "ord_seed_007", amount: 13124, status: "PENDING" },
  ]);

  // ── reviews — the same four the site showed, now real and verified ──
  await Review.insertMany([
    {
      userId: rahul._id, tripId: tripManali._id, bookingId: bkgRahulManali._id,
      rating: 5, title: "Best trip of my life!",
      content: "Absolutely loved every moment of the Manali trip. Our captain Rohan was incredible — knowledgeable, fun, and made the whole group feel like family within hours. The Sissu day was a revelation. I had no idea such beauty existed so close.",
      images: [img("photo-1506905925346-21bda4d32df4", 800), img("photo-1464822759023-fed622ff2c3b", 800)],
      status: "APPROVED", verifiedBooking: true, createdAt: d(-20), updatedAt: d(-18),
    },
    {
      userId: priyaM._id, tripId: tripRishikesh._id, bookingId: bkgPriyaRishikesh._id,
      rating: 5, title: "Rishikesh hit different",
      content: "I went solo and came back with 15 new friends. The rafting was exhilarating, the yoga sessions were peaceful, and the campfire conversations went till 2 AM every night. editmytrips nails the group dynamics.",
      status: "APPROVED", verifiedBooking: true, createdAt: d(-15), updatedAt: d(-12),
    },
    {
      userId: arjun._id, tripId: tripSpiti._id, bookingId: bkgArjunSpiti._id,
      rating: 5, title: "Spiti changed my perspective on life",
      content: "9 days in Spiti felt like a lifetime. The landscapes are unlike anything I've seen — Moon-like terrain, ancient monasteries perched on cliffs, and a silence that's almost spiritual. Highly recommend to anyone seeking a truly different experience.",
      status: "APPROVED", verifiedBooking: true, createdAt: d(-10), updatedAt: d(-8),
    },
    {
      userId: sneha._id, tripId: tripManali._id, bookingId: bkgSnehaManali._id,
      rating: 4, title: "Great value, amazing group",
      content: "The trip was very well organized. The captain was attentive and the itinerary was perfectly paced. One small gripe — the hotel on day 2 wasn't quite as described. But the camping night more than made up for it!",
      status: "APPROVED", verifiedBooking: true, createdAt: d(-8), updatedAt: d(-6),
    },
  ]);

  // Trip ratings become REAL numbers derived from approved reviews.
  const allSeededTrips = await Trip.find({}).select("_id").lean();
  for (const trip of allSeededTrips) {
    await refreshTripRating(String(trip._id));
  }

  // ── experiences ─────────────────────────────────────────────────────
  await Experience.insertMany([
    {
      title: "Manali Sunset Trek to Bhrigu Lake", slug: "manali-sunset-bhrigu-lake-trek",
      destinationId: manali._id,
      description: "A 4-hour guided trek to the sacred Bhrigu Lake at 14,100 feet. Witness a Himalayan sunset that will stay with you forever.",
      duration: "4 hours", price: 1499, capacity: 8,
      images: [img("photo-1464822759023-fed622ff2c3b", 800)],
      category: "Trekking", highlights: ["Guided trek", "Sunset at 14,100 ft", "Lake photography", "Certified guide"],
      status: "ACTIVE", rating: 4.9, reviewCount: 43, createdAt: d(-40),
    },
    {
      title: "Rishikesh White Water Rafting — 16 km", slug: "rishikesh-white-water-rafting-16km",
      destinationId: rishikesh._id,
      description: "Navigate Class III–IV rapids on the holy Ganges with certified river guides. The 16 km stretch is the ultimate rush.",
      duration: "3 hours", price: 999, capacity: 8,
      images: [img("photo-1516939884455-1445c8652f83", 800)],
      category: "Water Sports", highlights: ["16 km river stretch", "Class III-IV rapids", "Safety equipment included", "Cliff jumping opportunity"],
      status: "ACTIVE", rating: 4.8, reviewCount: 312, createdAt: d(-35),
    },
    {
      title: "Goa Portuguese Heritage Walk", slug: "goa-portuguese-heritage-walk",
      destinationId: goa._id,
      description: "A 3-hour walking tour through Old Goa's UNESCO-listed churches, colonial mansions, and spice markets with a local historian.",
      duration: "3 hours", price: 699, capacity: 12,
      images: [img("photo-1516450360452-9312f5e86fc7", 800)],
      category: "Cultural", highlights: ["UNESCO heritage sites", "Local historian guide", "Spice market visit", "Traditional Goan lunch"],
      status: "ACTIVE", rating: 4.7, reviewCount: 87, createdAt: d(-30),
    },
    {
      title: "Kashmir Shikara Sunset Cruise", slug: "kashmir-shikara-sunset-cruise",
      destinationId: kashmir._id,
      description: "Glide across the mirror-like Dal Lake in a traditional Shikara as the Himalayas turn golden in the setting sun. Pure magic.",
      duration: "2 hours", price: 1299, capacity: 6,
      images: [img("photo-1566837945700-30057527ade0", 800)],
      category: "Leisure", highlights: ["Dal Lake sunset", "Traditional Shikara boat", "Floating garden visit", "Kashmiri tea served"],
      status: "ACTIVE", rating: 4.9, reviewCount: 156, createdAt: d(-25),
    },
  ]);

  // ── stories ─────────────────────────────────────────────────────────
  await Story.insertMany([
    {
      title: "Why Spiti Valley Should Be On Every Indian's Bucket List", slug: "why-spiti-valley-bucket-list",
      excerpt: "We've been to a lot of beautiful places. None of them made us feel the way Spiti did. Here's why this cold desert is unlike anything in India.",
      content: "<p>Full rich text content goes here...</p>",
      coverImage: img("photo-1544735716-392fe2489ffa"),
      authorId: staff[0]._id, category: "Destination Guide",
      tags: ["Spiti", "Himachal Pradesh", "Road Trip", "Bucket List"],
      status: "PUBLISHED", featured: true, readTime: 8, views: 4523,
      publishedAt: d(-15), createdAt: d(-20),
    },
    {
      title: "Solo Travel in India as a Woman — Real Talk from Our Captains", slug: "solo-travel-india-woman-real-talk",
      excerpt: "We asked three of our most experienced female trip captains about safety, freedom, and what solo travel in India really looks like in 2026.",
      content: "<p>Full rich text content goes here...</p>",
      coverImage: img("photo-1500835556837-99ac94a94552"),
      authorId: staff[1]._id, category: "Solo Travel",
      tags: ["Solo Travel", "Women Travel", "Safety", "India"],
      status: "PUBLISHED", featured: true, readTime: 12, views: 7812,
      publishedAt: d(-10), createdAt: d(-14),
    },
    {
      title: "The ₹10,000 Budget That Took Me to Rishikesh, Manali, and Back", slug: "10000-budget-rishikesh-manali",
      excerpt: "Yes, it's possible. Here's exactly how I planned it, what I spent, and what I'd do differently.",
      content: "<p>Full rich text content goes here...</p>",
      coverImage: img("photo-1500530855697-b586d89ba3ee"),
      authorId: rahul._id, category: "Budget Travel",
      tags: ["Budget Travel", "Backpacking", "Manali", "Rishikesh"],
      status: "PUBLISHED", featured: false, readTime: 6, views: 3201,
      publishedAt: d(-7), createdAt: d(-9),
    },
    {
      title: "Monsoon in Meghalaya: The India Nobody Talks About", slug: "monsoon-meghalaya-hidden-india",
      excerpt: "Most people warn you away from Meghalaya in the monsoon. Most people are wrong.",
      content: "<p>Full rich text content goes here...</p>",
      coverImage: img("photo-1441974231531-c6227db76b6e"),
      authorId: staff[0]._id, category: "Destination Guide",
      tags: ["Meghalaya", "Monsoon", "Northeast India", "Hidden Gems"],
      status: "PUBLISHED", featured: false, readTime: 10, views: 2890,
      publishedAt: d(-5), createdAt: d(-7),
    },
  ]);

  // ── coupons ─────────────────────────────────────────────────────────
  await Coupon.insertMany([
    { code: "WELCOME500", description: "Welcome discount for first-time travellers", type: "FIXED", value: 500, minimumAmount: 4999, usageLimit: 1000, usedCount: 234, validFrom: d(-60), validUntil: d(60), active: true, promoted: true, createdAt: d(-60) },
    { code: "ADVENTURE10", description: "10% off on adventure trips", type: "PERCENTAGE", value: 10, minimumAmount: 8000, maximumDiscount: 2000, usageLimit: 500, usedCount: 87, validFrom: d(-30), validUntil: d(30), active: true, promoted: true, createdAt: d(-30) },
    { code: "MONSOON2026", description: "Monsoon sale — flat ₹1500 off", type: "FIXED", value: 1500, minimumAmount: 10000, usageLimit: 200, usedCount: 143, validFrom: d(-15), validUntil: d(45), active: true, createdAt: d(-15) },
  ]);

  // ── leads ───────────────────────────────────────────────────────────
  await Lead.insertMany([
    { name: "Karan Malhotra", phone: "+91 99887 76655", email: "karan.m@example.com", destination: "Spiti Valley Expedition", date: "2026-11-15", noOfPeople: 2, status: "NEW", notes: "Asked about group discounts", createdAt: d(-3) },
    { name: "Ananya Rao", phone: "+91 98123 45678", email: "ananya.rao@example.com", destination: "Kashmir Great Lakes Trek", date: "2026-12-01", noOfPeople: 4, status: "CONTACTED", notes: "Wants a custom departure date", createdAt: d(-6) },
    { name: "Deepak Kumar", phone: "+91 97654 32198", email: "deepak.k@example.com", destination: "Manali Backpacking Adventure", date: "2026-10-25", noOfPeople: 1, status: "NEW", notes: "", createdAt: d(-1) },
  ]);

  // ── summary ─────────────────────────────────────────────────────────
  const counts = {
    users: await User.countDocuments({}),
    captains: await Captain.countDocuments({}),
    destinations: await Destination.countDocuments({}),
    trips: await Trip.countDocuments({}),
    departures: await Departure.countDocuments({}),
    bookings: await Booking.countDocuments({}),
    payments: await Payment.countDocuments({}),
    reviews: await Review.countDocuments({}),
    stories: await Story.countDocuments({}),
    experiences: await Experience.countDocuments({}),
    coupons: await Coupon.countDocuments({}),
    leads: await Lead.countDocuments({}),
  };
  console.log("✅ Seed complete:", counts);
  console.log(`\n👤 Staff login:    ahqaf@editmytrips.com / ${DEFAULT_PASSWORD}`);
  console.log(`👤 Customer logins: rahul.sharma@example.com, vikram.singh@example.com, … / ${DEFAULT_PASSWORD}`);
  console.log(`💡 vikram.singh has a COMPLETED, un-reviewed trip → log in as him to see the post-trip review popup.\n`);
}

async function run() {
  try {
    await seed();
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

run();
