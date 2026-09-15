// Shared enums for the GetSet Junction domain.
// Keep in sync with client/src/types/index.ts.

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  OPERATIONS = "OPERATIONS",
  EDITOR = "EDITOR",
  FINANCE = "FINANCE",
  CAPTAIN = "CAPTAIN",
  CUSTOMER = "CUSTOMER",
}

export enum TripStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum DepartureStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  UPI = "UPI",
  CARD = "CARD",
  NET_BANKING = "NET_BANKING",
  WALLET = "WALLET",
  EMI = "EMI",
  COD = "COD",
}

export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum StoryStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
}

export const TRIP_TYPES = [
  "Adventure",
  "Cultural",
  "Wildlife",
  "Beach",
  "Pilgrimage",
  "Backpacking",
  "Luxury",
  "Road Trip",
  "Trek",
  "Workation",
] as const;

export const TRIP_DIFFICULTIES = [
  "Easy",
  "Moderate",
  "Challenging",
  "Extreme",
] as const;