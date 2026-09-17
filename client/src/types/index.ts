// ─────────────────────────────────────────────
// editmytrips — Shared TypeScript Types
// All interfaces mirror the MongoDB models.
// ─────────────────────────────────────────────

// ── Enums ────────────────────────────────────

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "OPERATIONS"
  | "EDITOR"
  | "FINANCE"
  | "CAPTAIN"
  | "CUSTOMER";

export type TripType =
  | "Adventure"
  | "Cultural"
  | "Wildlife"
  | "Beach"
  | "Pilgrimage"
  | "Backpacking"
  | "Luxury"
  | "Road Trip"
  | "Trek"
  | "Workation";

export type TripDifficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";

export type TripStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type DepartureStatus =
  | "DRAFT"
  | "ACTIVE"
  | "CLOSED"
  | "CANCELLED"
  | "COMPLETED";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod =
  | "UPI"
  | "CARD"
  | "NET_BANKING"
  | "WALLET"
  | "EMI"
  | "COD";

export type CouponType = "PERCENTAGE" | "FIXED";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type StoryStatus = "DRAFT" | "PUBLISHED";

export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "PUBLISH"
  | "UNPUBLISH"
  | "REFUND"
  | "CANCEL"
  | "ROLE_CHANGE"
  | "LOGIN"
  | "APPROVE"
  | "REJECT";

export type NotificationChannel = "EMAIL" | "WHATSAPP" | "SMS" | "PUSH";

export type NotificationTemplate =
  | "BOOKING_CONFIRMED"
  | "PAYMENT_RECEIVED"
  | "TRIP_REMINDER"
  | "CANCELLATION"
  | "REFUND_INITIATED"
  | "DEPARTURE_REMINDER"
  | "WELCOME";

// ── User ─────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Destination ───────────────────────────────

export interface Destination {
  _id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  description: string;
  heroImage: string;
  gallery: string[];
  bestTime: string;
  latitude?: number;
  longitude?: number;
  featured: boolean;
  tripCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ── Captain ───────────────────────────────────

export interface Captain {
  _id: string;
  userId: string;
  user?: User;
  bio: string;
  rating: number;
  reviewCount: number;
  tripsLed: number;
  specializations: TripType[];
  languages: string[];
  experience: number; // years
  avatar: string;
  documents: string[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── Itinerary Day ─────────────────────────────

export interface ItineraryDay {
  _id: string;
  tripId: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals: ("Breakfast" | "Lunch" | "Dinner")[];
  stay?: string;
  transport?: string;
  distance?: string;
  highlights?: string[];
}

// ── Trip ──────────────────────────────────────

export interface Trip {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  destinationId: string;
  destination?: Destination;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  discountedPrice?: number;
  tripType: TripType;
  difficulty: TripDifficulty;
  minAge: number;
  maxGroupSize: number;
  status: TripStatus;
  featured: boolean;
  trending: boolean;
  coverImage: string;
  gallery: string[];
  inclusions: string[];
  exclusions: string[];
  faqs: { question: string; answer: string }[];
  itinerary?: ItineraryDay[];
  captainId?: string;
  captain?: Captain;
  rating?: number;
  reviewCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Trip Departure ────────────────────────────

export interface TripDeparture {
  _id: string;
  tripId: string;
  trip?: Trip;
  startDate: Date;
  endDate: Date;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  price: number;
  meetingPoint: string;
  meetingTime: string;
  status: DepartureStatus;
  captainId?: string;
  captain?: Captain;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Experience ────────────────────────────────

export interface Experience {
  _id: string;
  title: string;
  slug: string;
  destinationId: string;
  destination?: Destination;
  description: string;
  duration: string; // e.g. "3 hours"
  price: number;
  capacity: number;
  hostId?: string;
  host?: User;
  images: string[];
  category: string;
  highlights: string[];
  status: "ACTIVE" | "INACTIVE";
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ── Booking Traveller ─────────────────────────

export interface BookingTraveller {
  _id: string;
  bookingId: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  specialRequirements?: string;
  idType?: "AADHAAR" | "PASSPORT" | "PAN" | "DRIVING_LICENSE";
  idNumber?: string;
}

// ── Booking ───────────────────────────────────

export interface Booking {
  _id: string;
  bookingNumber: string; // EMT10023
  userId: string;
  user?: User;
  tripId: string;
  trip?: Trip;
  departureId: string;
  departure?: TripDeparture;
  travellers: BookingTraveller[];
  travellersCount: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  notes?: string;
  cancelReason?: string;
  payments?: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

// ── Payment ───────────────────────────────────

export interface Payment {
  _id: string;
  bookingId: string;
  booking?: Booking;
  provider: "RAZORPAY" | "MANUAL";
  orderId: string; // Razorpay order_id
  transactionId?: string; // Razorpay payment_id
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  razorpaySignature?: string;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ── Coupon ────────────────────────────────────

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  type: CouponType;
  value: number; // percentage or fixed INR amount
  minimumAmount: number;
  maximumDiscount?: number; // cap for percentage coupons
  usageLimit: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  active: boolean;
  applicableTripIds?: string[]; // empty = all trips
  createdAt: Date;
  updatedAt: Date;
}

// ── Review ────────────────────────────────────

export interface Review {
  _id: string;
  userId: string;
  user?: User;
  tripId: string;
  trip?: Trip;
  bookingId: string;
  rating: number; // 1–5
  title?: string;
  content: string;
  images?: string[];
  status: ReviewStatus;
  verifiedBooking: boolean;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Story ─────────────────────────────────────

export interface Story {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // rich HTML from Tiptap
  coverImage: string;
  authorId: string;
  author?: User;
  category: string;
  tags: string[];
  status: StoryStatus;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  readTime?: number; // minutes
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Media ─────────────────────────────────────

export interface Media {
  _id: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // bytes
  width?: number;
  height?: number;
  altText?: string;
  folder: string; // e.g. "trips", "destinations"
  uploadedById: string;
  uploadedBy?: User;
  createdAt: Date;
}

// ── Audit Log ─────────────────────────────────

export interface AuditLog {
  _id: string;
  adminId: string;
  admin?: User;
  action: AuditAction;
  entity: string; // "Trip", "Booking", etc.
  entityId: string;
  entityName?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ── Notification ──────────────────────────────

export interface Notification {
  _id: string;
  userId: string;
  user?: User;
  channel: NotificationChannel;
  template: NotificationTemplate;
  subject?: string;
  body: string;
  status: "QUEUED" | "SENT" | "FAILED";
  sentAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ── UI / Page Helpers ─────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TripFilters {
  search?: string;
  tripType?: TripType;
  difficulty?: TripDifficulty;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  featured?: boolean;
  trending?: boolean;
  sort?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
}

export interface BookingFormData {
  departureId: string;
  travellersCount: number;
  travellers: Omit<BookingTraveller, "_id" | "bookingId">[];
  couponCode?: string;
  addOns?: string[];
  agreeToTerms: boolean;
}

export interface PriceCalculation {
  basePrice: number;
  subtotal: number;
  couponDiscount: number;
  tax: number;
  total: number;
  pricePerPerson: number;
  travellersCount: number;
}

// ── Admin Stats ───────────────────────────────

export interface DashboardStats {
  revenue: {
    total: number;
    thisMonth: number;
    trend: number; // percentage change
  };
  bookings: {
    total: number;
    thisMonth: number;
    trend: number;
    pending: number;
    confirmed: number;
  };
  trips: {
    total: number;
    published: number;
    draft: number;
  };
  departures: {
    upcoming: number;
    active: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
    trend: number;
  };
}

export interface RevenueChartData {
  month: string;
  revenue: number;
  bookings: number;
}
