import { Trip } from "@/server/models/Trip";
import { Departure } from "@/server/models/Departure";
import { Destination } from "@/server/models/Destination";
import { Experience } from "@/server/models/Experience";
import { Story } from "@/server/models/Story";
import { Review } from "@/server/models/Review";
import { User } from "@/server/models/User";
import { Booking } from "@/server/models/Booking";
import type {
  Trip as TripDTO,
  TripDeparture as DepartureDTO,
  Destination as DestinationDTO,
  Experience as ExperienceDTO,
  Story as StoryDTO,
  Review as ReviewDTO,
  User as UserDTO,
} from "@/types";
import { connectDB } from "@/server/db/mongoose";
import DOMPurify from "isomorphic-dompurify";

/** Server components bypass route handlers — make sure Mongo is connected. */
async function ensureDB() {
  await connectDB();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** JSON round-trip: ObjectId→string, Date→ISO — safe for RSC props and JSON APIs. */
function plain<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const DESTINATION_FIELDS = "name slug state heroImage";

/** Attach `destination`/`captain` aliases so components can use trip.destination?.name. */
function aliasTrip(doc: Record<string, unknown>) {
  return { ...doc, destination: doc.destinationId, captain: doc.captainId };
}

export interface TripListParams {
  search?: string;
  tripType?: string;
  difficulty?: string;
  destination?: string;
  minPrice?: string;
  maxPrice?: string;
  minDuration?: string;
  maxDuration?: string;
  featured?: string;
  trending?: string;
  sort?: string;
  page?: string;
  pageSize?: string;
}

/** Paginated published trips. */
export async function listTripsPublic(params: TripListParams): Promise<{ data: TripDTO[]; meta: { total: number; page: number; pageSize: number; totalPages: number } }> {
  await ensureDB();
  const filter: Record<string, unknown> = { status: "PUBLISHED" };

  if (params.search) {
    const rx = escapeRegExp(params.search);
    filter.$or = [
      { title: { $regex: rx, $options: "i" } },
      { shortDescription: { $regex: rx, $options: "i" } },
      { description: { $regex: rx, $options: "i" } },
    ];
  }
  if (params.tripType) filter.tripType = params.tripType;
  if (params.difficulty) filter.difficulty = params.difficulty;
  if (params.destination) filter.destinationId = params.destination;
  if (params.featured === "true") filter.featured = true;
  if (params.trending === "true") filter.trending = true;

  const priceRange: Record<string, number> = {};
  if (params.minPrice) priceRange.$gte = Number(params.minPrice);
  if (params.maxPrice) priceRange.$lte = Number(params.maxPrice);
  if (Object.keys(priceRange).length > 0) filter.basePrice = priceRange;

  const durationRange: Record<string, number> = {};
  if (params.minDuration) durationRange.$gte = Number(params.minDuration);
  if (params.maxDuration) durationRange.$lte = Number(params.maxDuration);
  if (Object.keys(durationRange).length > 0) filter.durationDays = durationRange;

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { basePrice: 1 },
    price_desc: { basePrice: -1 },
    rating: { rating: -1 },
    popular: { reviewCount: -1 },
  };
  const sortOptions = sortMap[params.sort ?? "newest"] ?? sortMap.newest;

  const pageNum = Math.max(1, Number(params.page) || 1);
  const pageSizeNum = Math.min(50, Math.max(1, Number(params.pageSize) || 12));

  const [docs, total] = await Promise.all([
    Trip.find(filter)
      .sort(sortOptions)
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("destinationId", DESTINATION_FIELDS)
      .lean(),
    Trip.countDocuments(filter),
  ]);

  return {
    data: plain<TripDTO[]>(docs.map(aliasTrip)),
    meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) },
  };
}

export async function getFeaturedTripsPublic(limit = 6): Promise<TripDTO[]> {
  await ensureDB();
  const docs = await Trip.find({ status: "PUBLISHED", featured: true })
    .populate("destinationId", DESTINATION_FIELDS)
    .limit(limit)
    .lean();
  return plain<TripDTO[]>(docs.map(aliasTrip));
}

export async function getTrendingTripsPublic(limit = 6): Promise<TripDTO[]> {
  await ensureDB();
  const docs = await Trip.find({ status: "PUBLISHED", trending: true })
    .populate("destinationId", DESTINATION_FIELDS)
    .limit(limit)
    .lean();
  return plain<TripDTO[]>(docs.map(aliasTrip));
}

export async function searchTripsPublic(q: string): Promise<TripDTO[]> {
  await ensureDB();
  if (!q.trim()) return [];
  return plain<TripDTO[]>(
    await Trip.find({ status: "PUBLISHED", $text: { $search: q } }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .lean()
  );
}

/** Accepts either a slug or a Mongo id — the client stores both interchangeably. */
export async function getTripBySlugOrId(slugOrId: string): Promise<TripDTO | null> {
  await ensureDB();
  const isId = /^[0-9a-fA-F]{24}$/.test(slugOrId);
  const doc = await Trip.findOne(isId ? { _id: slugOrId } : { slug: slugOrId })
    .populate("destinationId", DESTINATION_FIELDS)
    .populate("captainId")
    .lean();
  return doc ? plain<TripDTO>(aliasTrip(doc as Record<string, unknown>)) : null;
}

export async function getTripsByDestinationPublic(destinationId: string): Promise<TripDTO[]> {
  await ensureDB();
  return plain<TripDTO[]>(
    await Trip.find({ status: "PUBLISHED", destinationId })
      .populate("destinationId", DESTINATION_FIELDS)
      .lean()
  );
}

/** Future departures (ACTIVE/DRAFT) for a trip, or all trips when tripId omitted. */
export async function getUpcomingDepartures(tripId?: string): Promise<DepartureDTO[]> {
  await ensureDB();
  const filter: Record<string, unknown> = {
    status: { $in: ["ACTIVE", "DRAFT"] },
    startDate: { $gte: new Date() },
  };
  if (tripId) filter.tripId = tripId;
  return plain<DepartureDTO[]>(await Departure.find(filter).sort({ startDate: 1 }).lean());
}

export async function listDestinationsPublic(params: { search?: string; featured?: string } = {}): Promise<DestinationDTO[]> {
  await ensureDB();
  const filter: Record<string, unknown> = {};
  if (params.search) {
    const rx = escapeRegExp(params.search);
    filter.$or = [
      { name: { $regex: rx, $options: "i" } },
      { state: { $regex: rx, $options: "i" } },
      { description: { $regex: rx, $options: "i" } },
    ];
  }
  if (params.featured === "true") filter.featured = true;

  const destinations = await Destination.find(filter).sort({ featured: -1, name: 1 }).lean();
  const withCounts = await Promise.all(
    destinations.map(async (dest) => ({
      ...dest,
      tripCount: await Trip.countDocuments({ destinationId: dest._id, status: "PUBLISHED" }),
    }))
  );
  return plain<DestinationDTO[]>(withCounts);
}

export async function getDestinationBySlugPublic(slug: string): Promise<(DestinationDTO & { trips: TripDTO[] }) | null> {
  await ensureDB();
  const destination = await Destination.findOne({ slug }).lean();
  if (!destination) return null;
  const trips = await Trip.find({ destinationId: destination._id, status: "PUBLISHED" })
    .populate("destinationId", DESTINATION_FIELDS)
    .lean();
  return plain({
    ...destination,
    trips: trips.map(aliasTrip),
  });
}

export async function listExperiencesPublic(params: { search?: string; category?: string; destination?: string } = {}): Promise<ExperienceDTO[]> {
  const filter: Record<string, unknown> = { status: "ACTIVE" };
  if (params.search) {
    const rx = escapeRegExp(params.search);
    filter.$or = [
      { title: { $regex: rx, $options: "i" } },
      { description: { $regex: rx, $options: "i" } },
    ];
  }
  if (params.category) filter.category = params.category;
  if (params.destination) filter.destinationId = params.destination;

  return plain<ExperienceDTO[]>(
    await Experience.find(filter)
      .sort({ rating: -1, reviewCount: -1 })
      .populate("destinationId", "name slug state")
      .lean()
  );
}

export async function getExperienceBySlugPublic(slug: string): Promise<ExperienceDTO | null> {
  await ensureDB();
  return plain<ExperienceDTO | null>(
    await Experience.findOne({ slug, status: "ACTIVE" })
      .populate("destinationId", "name slug state")
      .populate("hostId", "name avatar")
      .lean()
  );
}

export async function listStoriesPublic(params: { search?: string; category?: string; featured?: string } = {}): Promise<StoryDTO[]> {
  await ensureDB();
  const filter: Record<string, unknown> = { status: "PUBLISHED" };
  if (params.search) {
    const rx = escapeRegExp(params.search);
    filter.$or = [
      { title: { $regex: rx, $options: "i" } },
      { excerpt: { $regex: rx, $options: "i" } },
    ];
  }
  if (params.category) filter.category = params.category;
  if (params.featured === "true") filter.featured = true;

  const stories = await Story.find(filter).sort({ featured: -1, publishedAt: -1 }).lean();
  const authorIds = [...new Set(stories.map((s) => String(s.authorId)))];
  const authors = await User.find({ _id: { $in: authorIds } }).select("name avatar").lean();
  const authorMap = new Map(authors.map((a) => [String(a._id), a]));

  return plain<StoryDTO[]>(stories.map((s) => ({ ...s, author: authorMap.get(String(s.authorId)) })));
}

export async function getStoryBySlugPublic(
  slug: string,
  { countView = false }: { countView?: boolean } = {}
): Promise<StoryDTO | null> {
  await ensureDB();
  const story = await Story.findOne({ slug, status: "PUBLISHED" }).lean();
  if (!story) return null;
  // Fire-and-forget view counter — only for real page renders, not metadata fetches.
  if (countView) Story.updateOne({ _id: story._id }, { $inc: { views: 1 } }).exec();
  const author = story.authorId ? await User.findById(story.authorId).select("name avatar").lean() : null;
  // Story content is rich HTML rendered with dangerouslySetInnerHTML — sanitize on the way out.
  return plain<StoryDTO>({ ...story, author, content: DOMPurify.sanitize(story.content ?? "") });
}

/** Approved reviews for a trip (newest first) with reviewer name/avatar. */
export async function listApprovedReviews(tripId: string, limit = 50): Promise<ReviewDTO[]> {
  await ensureDB();
  const reviews = await Review.find({ tripId, status: "APPROVED" }).sort({ createdAt: -1 }).limit(limit).lean();
  const userIds = [...new Set(reviews.map((r) => String(r.userId)))];
  const users = await User.find({ _id: { $in: userIds } }).select("name avatar").lean();
  const userMap = new Map(users.map((u) => [String(u._id), u]));
  return plain<ReviewDTO[]>(reviews.map((r) => ({ ...r, user: userMap.get(String(r.userId)) })));
}

/** Most recent approved reviews across all trips — homepage/community sections. */
export async function listRecentApprovedReviews(limit = 6): Promise<ReviewDTO[]> {
  await ensureDB();
  await ensureDB();
  const reviews = await Review.find({ status: "APPROVED" }).sort({ createdAt: -1 }).limit(limit).lean();
  const userIds = [...new Set(reviews.map((r) => String(r.userId)))];
  const tripIds = [...new Set(reviews.map((r) => String(r.tripId)))];
  const [users, trips] = await Promise.all([
    User.find({ _id: { $in: userIds } }).select("name avatar").lean(),
    Trip.find({ _id: { $in: tripIds } }).select("title slug coverImage").lean(),
  ]);
  const userMap = new Map(users.map((u) => [String(u._id), u]));
  const tripMap = new Map(trips.map((t) => [String(t._id), t]));
  return plain<ReviewDTO[]>(reviews.map((r) => ({ ...r, user: userMap.get(String(r.userId)), trip: tripMap.get(String(r.tripId)) })));
}

/** Community page — real travellers derived from bookings. */
export async function listCommunityTravellers(limit = 8): Promise<(UserDTO & { tripCount: number; spent: number })[]> {
  await ensureDB();
  const travellers = await Booking.aggregate([
    { $group: { _id: "$userId", trips: { $sum: 1 }, spent: { $sum: "$total" } } },
    { $sort: { trips: -1 } },
    { $limit: limit },
  ]);
  const users = await User.find({ _id: { $in: travellers.map((t) => t._id) } })
    .select("name avatar createdAt")
    .lean();
  const statMap = new Map(travellers.map((t) => [String(t._id), t]));
  const merged = users
    .map((u) => {
      const stat = statMap.get(String(u._id));
      return { ...u, tripCount: stat?.trips ?? 0, spent: stat?.spent ?? 0 };
    })
    .sort((a, b) => b.tripCount - a.tripCount);
  return plain(merged);
}
