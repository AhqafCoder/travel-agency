import type { User, Trip, Destination, Experience, Story, Booking, Review, Coupon, TripDeparture, PaginationMeta, DashboardStats, RevenueChartData } from "@/types";

// ─────────────────────────────────────────────
// Client API layer — talks to the Express server
// at NEXT_PUBLIC_API_URL (default http://localhost:4000/api).
// ─────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const TOKEN_KEY = "emt_token";
const USER_KEY = "emt_user";

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

interface AuthResponse {
  token: string;
  user: User;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Get the stored JWT (client side only). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(USER_KEY);
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; isFormData?: boolean } = {}
): Promise<T> {
  const { method = "GET", body, isFormData = false } = options;
  const headers: Record<string, string> = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
    cache: "no-store",
  });

  let json: ApiEnvelope<T>;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(`Unexpected response (${res.status})`, res.status);
  }

  if (!res.ok || !json.success) {
    if (res.status === 401) {
      // Auto-clear stale token
      setToken(null);
      setStoredUser(null);
    }
    throw new ApiError(json.error ?? `Request failed (${res.status})`, res.status);
  }
  return json.data as T;
}

/** Paginated request — returns both data[] and meta */
async function requestPaginated<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<PaginatedData<T>> {
  const { method = "GET", body } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const json = (await res.json()) as ApiEnvelope<T[]>;
  if (!res.ok || !json.success) {
    throw new ApiError(json.error ?? `Request failed (${res.status})`, res.status);
  }
  return {
    data: (json.data ?? []) as T[],
    meta: (json as { meta?: PaginationMeta }).meta ?? { total: 0, page: 1, pageSize: 20, totalPages: 1 },
  };
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────
export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  register(input: { name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/register", { method: "POST", body: input });
  },
  login(input: { email: string; password: string }): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/login", { method: "POST", body: input });
  },
  me(): Promise<User> {
    return request<User>("/auth/me");
  },

  // ── Public Trips ─────────────────────────────────────────────────────────
  trips: {
    list(params?: URLSearchParams | Record<string, string>): Promise<PaginatedData<Trip>> {
      const qs = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params ?? {}).toString();
      return requestPaginated<Trip>(`/trips${qs ? `?${qs}` : ""}`);
    },
    get(slug: string): Promise<Trip> {
      return request<Trip>(`/trips/${slug}`);
    },
    featured(): Promise<Trip[]> {
      return request<Trip[]>("/trips/featured");
    },
    search(q: string): Promise<Trip[]> {
      return request<Trip[]>(`/trips/search?q=${encodeURIComponent(q)}`);
    },
  },

  // ── Public Destinations ────────────────────────────────────────────────
  destinations: {
    list(): Promise<Destination[]> {
      return request<Destination[]>("/destinations");
    },
    get(slug: string): Promise<Destination> {
      return request<Destination>(`/destinations/${slug}`);
    },
  },

  // ── Public Experiences ─────────────────────────────────────────────────
  experiences: {
    list(): Promise<Experience[]> {
      return request<Experience[]>("/experiences");
    },
    get(slug: string): Promise<Experience> {
      return request<Experience>(`/experiences/${slug}`);
    },
  },

  // ── Public Stories ─────────────────────────────────────────────────────
  stories: {
    list(): Promise<Story[]> {
      return request<Story[]>("/stories");
    },
    get(slug: string): Promise<Story> {
      return request<Story>(`/stories/${slug}`);
    },
  },

  // ── Public Enquiry Leads ──────────────────────────────────────────────
  leads: {
    submit(input: {
      name: string;
      phone: string;
      email: string;
      destination: string;
      date: string;
      noOfPeople: number;
      notes?: string;
    }): Promise<{ success: boolean; message: string; lead: any }> {
      return request("/leads", { method: "POST", body: input });
    },
  },

  // ── Media (Cloudinary) ────────────────────────────────────────────────
  media: {
    async upload(file: File, folder = "general"): Promise<{ url: string; publicId: string }> {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      return request<{ url: string; publicId: string }>("/media/upload", {
        method: "POST",
        body: fd,
        isFormData: true,
      });
    },
    async delete(publicId: string): Promise<void> {
      await request(`/media/${encodeURIComponent(publicId)}`, { method: "DELETE" });
    },
  },

  // ── Admin ─────────────────────────────────────────────────────────────
  admin: {
    // Dashboard
    stats(): Promise<DashboardStats & { recentBookings: any[]; revenueChart: RevenueChartData[] }> {
      return request("/admin/stats");
    },

    // Trips
    trips: {
      list(params?: Record<string, string>): Promise<PaginatedData<Trip>> {
        const qs = new URLSearchParams(params ?? {}).toString();
        return requestPaginated<Trip>(`/admin/trips${qs ? `?${qs}` : ""}`);
      },
      get(id: string): Promise<Trip> {
        return request<Trip>(`/admin/trips/${id}`);
      },
      create(data: Partial<Trip>): Promise<Trip> {
        return request<Trip>("/admin/trips", { method: "POST", body: data });
      },
      update(id: string, data: Partial<Trip>): Promise<Trip> {
        return request<Trip>(`/admin/trips/${id}`, { method: "PATCH", body: data });
      },
      delete(id: string): Promise<void> {
        return request(`/admin/trips/${id}`, { method: "DELETE" });
      },
      setStatus(id: string, status: string): Promise<Trip> {
        return request<Trip>(`/admin/trips/${id}/status`, { method: "PATCH", body: { status } });
      },
      departures: {
        list(tripId: string): Promise<TripDeparture[]> {
          return request<TripDeparture[]>(`/admin/trips/${tripId}/departures`);
        },
        create(tripId: string, data: Partial<TripDeparture>): Promise<TripDeparture> {
          return request<TripDeparture>(`/admin/trips/${tripId}/departures`, { method: "POST", body: data });
        },
      },
      departure: {
        update(depId: string, data: Partial<TripDeparture>): Promise<TripDeparture> {
          return request<TripDeparture>(`/admin/departures/${depId}`, { method: "PATCH", body: data });
        },
        delete(depId: string): Promise<void> {
          return request(`/admin/departures/${depId}`, { method: "DELETE" });
        },
      },
    },

    // Destinations
    destinations: {
      list(params?: Record<string, string>): Promise<PaginatedData<Destination>> {
        const qs = new URLSearchParams(params ?? {}).toString();
        return requestPaginated<Destination>(`/admin/destinations${qs ? `?${qs}` : ""}`);
      },
      get(id: string): Promise<Destination> {
        return request<Destination>(`/admin/destinations/${id}`);
      },
      create(data: Partial<Destination>): Promise<Destination> {
        return request<Destination>("/admin/destinations", { method: "POST", body: data });
      },
      update(id: string, data: Partial<Destination>): Promise<Destination> {
        return request<Destination>(`/admin/destinations/${id}`, { method: "PATCH", body: data });
      },
      delete(id: string): Promise<void> {
        return request(`/admin/destinations/${id}`, { method: "DELETE" });
      },
    },

    // Experiences
    experiences: {
      list(params?: Record<string, string>): Promise<PaginatedData<Experience>> {
        const qs = new URLSearchParams(params ?? {}).toString();
        return requestPaginated<Experience>(`/admin/experiences${qs ? `?${qs}` : ""}`);
      },
      get(id: string): Promise<Experience> {
        return request<Experience>(`/admin/experiences/${id}`);
      },
      create(data: Partial<Experience>): Promise<Experience> {
        return request<Experience>("/admin/experiences", { method: "POST", body: data });
      },
      update(id: string, data: Partial<Experience>): Promise<Experience> {
        return request<Experience>(`/admin/experiences/${id}`, { method: "PATCH", body: data });
      },
      delete(id: string): Promise<void> {
        return request(`/admin/experiences/${id}`, { method: "DELETE" });
      },
    },

    // Stories
    stories: {
      list(params?: Record<string, string>): Promise<PaginatedData<Story>> {
        const qs = new URLSearchParams(params ?? {}).toString();
        return requestPaginated<Story>(`/admin/stories${qs ? `?${qs}` : ""}`);
      },
      get(id: string): Promise<Story> {
        return request<Story>(`/admin/stories/${id}`);
      },
      create(data: Partial<Story>): Promise<Story> {
        return request<Story>("/admin/stories", { method: "POST", body: data });
      },
      update(id: string, data: Partial<Story>): Promise<Story> {
        return request<Story>(`/admin/stories/${id}`, { method: "PATCH", body: data });
      },
      delete(id: string): Promise<void> {
        return request(`/admin/stories/${id}`, { method: "DELETE" });
      },
    },

    // Bookings
    bookings: {
      list(params?: Record<string, string>): Promise<PaginatedData<Booking>> {
        const qs = new URLSearchParams(params ?? {}).toString();
        return requestPaginated<Booking>(`/admin/bookings${qs ? `?${qs}` : ""}`);
      },
      get(id: string): Promise<Booking> {
        return request<Booking>(`/admin/bookings/${id}`);
      },
      updateStatus(id: string, bookingStatus: string, cancelReason?: string): Promise<Booking> {
        return request<Booking>(`/admin/bookings/${id}/status`, {
          method: "PATCH",
          body: { bookingStatus, cancelReason },
        });
      },
    },

    // Reviews
    reviews: {
      list(params?: Record<string, string>): Promise<PaginatedData<Review>> {
        const qs = new URLSearchParams(params ?? {}).toString();
        return requestPaginated<Review>(`/admin/reviews${qs ? `?${qs}` : ""}`);
      },
      updateStatus(id: string, status: string, adminNote?: string): Promise<Review> {
        return request<Review>(`/admin/reviews/${id}/status`, {
          method: "PATCH",
          body: { status, adminNote },
        });
      },
      delete(id: string): Promise<void> {
        return request(`/admin/reviews/${id}`, { method: "DELETE" });
      },
    },

    // Coupons
    coupons: {
      list(params?: Record<string, string>): Promise<PaginatedData<Coupon>> {
        const qs = new URLSearchParams(params ?? {}).toString();
        return requestPaginated<Coupon>(`/admin/coupons${qs ? `?${qs}` : ""}`);
      },
      create(data: Partial<Coupon>): Promise<Coupon> {
        return request<Coupon>("/admin/coupons", { method: "POST", body: data });
      },
      update(id: string, data: Partial<Coupon>): Promise<Coupon> {
        return request<Coupon>(`/admin/coupons/${id}`, { method: "PATCH", body: data });
      },
      delete(id: string): Promise<void> {
        return request(`/admin/coupons/${id}`, { method: "DELETE" });
      },
    },

    // Leads
    leads: {
      list(params?: Record<string, string>): Promise<PaginatedData<any>> {
        const qs = new URLSearchParams(params ?? {}).toString();
        return requestPaginated<any>(`/admin/leads${qs ? `?${qs}` : ""}`);
      },
      get(id: string): Promise<any> {
        return request<any>(`/admin/leads/${id}`);
      },
      update(id: string, data: { status?: string; notes?: string }): Promise<any> {
        return request<any>(`/admin/leads/${id}`, { method: "PATCH", body: data });
      },
      delete(id: string): Promise<void> {
        return request(`/admin/leads/${id}`, { method: "DELETE" });
      },
    },
  },

  // ── Flattened Admin API Aliases ───────────────────────────────────────
  adminGetDashboardStats(): Promise<DashboardStats & { recentBookings: any[]; revenueChart: RevenueChartData[] }> {
    return request("/admin/stats");
  },
  adminListTrips(params?: Record<string, string>): Promise<PaginatedData<Trip>> {
    return this.admin.trips.list(params);
  },
  adminGetTrip(id: string): Promise<Trip> {
    return this.admin.trips.get(id);
  },
  adminCreateTrip(data: Partial<Trip>): Promise<Trip> {
    return this.admin.trips.create(data);
  },
  adminUpdateTrip(id: string, data: Partial<Trip>): Promise<Trip> {
    return this.admin.trips.update(id, data);
  },
  adminDeleteTrip(id: string): Promise<void> {
    return this.admin.trips.delete(id);
  },
  adminListDestinations(params?: Record<string, string>): Promise<PaginatedData<Destination>> {
    return this.admin.destinations.list(params);
  },
  adminDeleteDestination(id: string): Promise<void> {
    return this.admin.destinations.delete(id);
  },
  adminListExperiences(params?: Record<string, string>): Promise<PaginatedData<Experience>> {
    return this.admin.experiences.list(params);
  },
  adminDeleteExperience(id: string): Promise<void> {
    return this.admin.experiences.delete(id);
  },
  adminListStories(params?: Record<string, string>): Promise<PaginatedData<Story>> {
    return this.admin.stories.list(params);
  },
  adminDeleteStory(id: string): Promise<void> {
    return this.admin.stories.delete(id);
  },
  adminListCoupons(params?: Record<string, string>): Promise<PaginatedData<Coupon>> {
    return this.admin.coupons.list(params);
  },
  adminDeleteCoupon(id: string): Promise<void> {
    return this.admin.coupons.delete(id);
  },
  adminListLeads(params?: Record<string, string>): Promise<PaginatedData<any>> {
    return this.admin.leads.list(params);
  },
  adminDeleteLead(id: string): Promise<void> {
    return this.admin.leads.delete(id);
  },
  adminListBookings(params?: Record<string, string>): Promise<PaginatedData<Booking>> {
    return this.admin.bookings.list(params);
  },
  adminListCustomers(): Promise<{ users: User[] }> {
    return request<{ users: User[] }>("/admin/customers");
  },
  adminListReviews(params?: Record<string, string>): Promise<PaginatedData<Review>> {
    return this.admin.reviews.list(params);
  },
  adminDeleteReview(id: string): Promise<void> {
    return this.admin.reviews.delete(id);
  },
  adminUpdateReview(id: string, data: Partial<Review>): Promise<Review> {
    return request<Review>(`/admin/reviews/${id}/status`, { method: "PATCH", body: data });
  },
};