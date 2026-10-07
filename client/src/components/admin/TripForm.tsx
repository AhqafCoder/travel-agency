"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Trip, Destination } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DeparturesManager } from "@/components/admin/DeparturesManager";

  const tripSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  shortDescription: z.string().min(10),
  description: z.string().min(10),
  destinationId: z.string().min(1, "Destination is required"),
  tripType: z.enum(["Adventure", "Cultural", "Wildlife", "Beach", "Pilgrimage", "Backpacking", "Luxury", "Road Trip", "Trek", "Workation"]),
  difficulty: z.enum(["Easy", "Moderate", "Challenging", "Extreme"]),
  durationDays: z.number().min(1),
  basePrice: z.number().min(0),
  maxGroupSize: z.number().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean(),
  trending: z.boolean(),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  itinerary: z.array(
    z.object({
      dayNumber: z.number(),
      title: z.string(),
      description: z.string(),
      activities: z.array(z.string()),
      meals: z.array(z.enum(["Breakfast", "Lunch", "Dinner"])),
      stay: z.string().optional(),
      transport: z.string().optional(),
      distance: z.string().optional(),
      highlights: z.array(z.string()),
    })
  ),
});

type TripFormValues = z.infer<typeof tripSchema>;

interface TripFormProps {
  initialData?: Trip;
  isEdit?: boolean;
}

export function TripForm({ initialData, isEdit }: TripFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string[]>(
    initialData?.coverImage ? [initialData.coverImage] : []
  );
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery ?? []);

  const { data: destData } = useQuery({
    queryKey: ["admin", "destinations"],
    queryFn: () => api.adminListDestinations(),
  });

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: initialData ? {
      title: initialData.title || "",
      slug: initialData.slug || "",
      shortDescription: initialData.shortDescription || "",
      description: initialData.description || "",
      destinationId:
        typeof initialData.destinationId === "string"
          ? initialData.destinationId
          : ((initialData.destinationId as unknown as { _id?: string })?._id ?? ""),
      tripType: initialData.tripType || "Adventure",
      difficulty: initialData.difficulty || "Moderate",
      durationDays: initialData.durationDays || 1,
      basePrice: initialData.basePrice || 0,
      maxGroupSize: initialData.maxGroupSize || 10,
      status: initialData.status || "DRAFT",
      featured: initialData.featured ?? false,
      trending: initialData.trending ?? false,
      inclusions: initialData.inclusions || [],
      exclusions: initialData.exclusions || [],
      itinerary: initialData.itinerary?.length ? initialData.itinerary : [{ dayNumber: 1, title: "", description: "", activities: [], meals: [], highlights: [] }],
    } : {
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      destinationId: "",
      tripType: "Adventure",
      difficulty: "Moderate",
      durationDays: 1,
      basePrice: 0,
      maxGroupSize: 10,
      status: "DRAFT",
      featured: false,
      trending: false,
      inclusions: [],
      exclusions: [],
      itinerary: [{ dayNumber: 1, title: "", description: "", activities: [], meals: [], highlights: [] }],
    },
  });

  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
    control: form.control,
    name: "inclusions" as never,
  });

  const { fields: exclusionFields, append: appendExclusion, remove: removeExclusion } = useFieldArray({
    control: form.control,
    name: "exclusions" as never,
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control: form.control,
    name: "itinerary",
  });

  const onSubmit = async (values: TripFormValues) => {
    try {
      setIsSubmitting(true);
      // Drop itinerary rows the user left blank; auto-slug from title.
      const itinerary = values.itinerary
        .map((day, i) => ({ ...day, dayNumber: i + 1 }))
        .filter((day) => day.title.trim() || day.description.trim());
      const payload = {
        ...values,
        slug: values.slug.trim() || String(values.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        itinerary,
        coverImage: coverImage[0] ?? "",
        gallery,
      };
      if (isEdit && initialData) {
        await api.adminUpdateTrip(initialData._id, payload);
        toast.success("Trip updated successfully");
      } else {
        await api.adminCreateTrip(payload);
        toast.success("Trip created successfully");
        router.push("/admin/trips");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => {
        const first = Object.keys(errors)[0];
        toast.error(`Please fix the highlighted fields${first ? ` (${first})` : ""}`);
      })}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Trip" : "Create New Trip"}</h2>
          <p className="text-slate-500">Fill in the details below to {isEdit ? "update" : "create"} a trip.</p>
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="bg-[#FF6B35] hover:bg-[#e85a25] text-white" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Trip"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger value="basic" className="data-[active]:border-b-2 data-[active]:border-[#FF6B35] data-[active]:text-[#FF6B35] rounded-none px-4 py-2">Basic Info</TabsTrigger>
          <TabsTrigger value="content" className="data-[active]:border-b-2 data-[active]:border-[#FF6B35] data-[active]:text-[#FF6B35] rounded-none px-4 py-2">Content</TabsTrigger>
          <TabsTrigger value="itinerary" className="data-[active]:border-b-2 data-[active]:border-[#FF6B35] data-[active]:text-[#FF6B35] rounded-none px-4 py-2">Itinerary</TabsTrigger>
          <TabsTrigger value="pricing" className="data-[active]:border-b-2 data-[active]:border-[#FF6B35] data-[active]:text-[#FF6B35] rounded-none px-4 py-2">Pricing & Settings</TabsTrigger>
          {isEdit && (
            <TabsTrigger value="departures" className="data-[active]:border-b-2 data-[active]:border-[#FF6B35] data-[active]:text-[#FF6B35] rounded-none px-4 py-2">Departures</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="basic" className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...form.register("title")} placeholder="e.g. Majestic Himalayas" />
              {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input {...form.register("slug")} placeholder="e.g. majestic-himalayas" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Destination</Label>
            <Controller
              control={form.control}
              name="destinationId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination">
                      {destData?.data?.find((d) => d._id === field.value)?.name ?? "Select destination"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {destData?.data?.map((d) => (
                      <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...form.register("description")} rows={5} placeholder="Full description of the trip..." />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-8 max-w-3xl">
          {/* Inclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Inclusions</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => appendInclusion("")}>
                <Plus className="h-4 w-4 mr-2" /> Add Inclusion
              </Button>
            </div>
            {inclusionFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input {...form.register(`inclusions.${index}` as const)} placeholder="e.g. 3 nights 4-star accommodation" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeInclusion(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Exclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Exclusions</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => appendExclusion("")}>
                <Plus className="h-4 w-4 mr-2" /> Add Exclusion
              </Button>
            </div>
            {exclusionFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input {...form.register(`exclusions.${index}` as const)} placeholder="e.g. International flights" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeExclusion(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          {/* Media */}
          <div className="space-y-6 border-t border-border pt-6">
            <ImageUploader
              label="Cover Image"
              value={coverImage}
              onChange={setCoverImage}
              folder="trips"
              single
            />
            <ImageUploader
              label="Gallery"
              value={gallery}
              onChange={setGallery}
              folder="trips"
            />
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-6 max-w-4xl">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Day-by-Day Itinerary</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => appendItinerary({ dayNumber: itineraryFields.length + 1, title: "", description: "", activities: [], meals: [], highlights: [] })}>
              <Plus className="h-4 w-4 mr-2" /> Add Day
            </Button>
          </div>

          <div className="space-y-4">
            {itineraryFields.map((field, index) => (
              <div key={field.id} className="border rounded-xl p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-slate-400 cursor-grab" />
                    Day {index + 1}
                  </h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItinerary(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Day Title</Label>
                    <Input {...form.register(`itinerary.${index}.title` as const)} placeholder="e.g. Arrival in Delhi" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea {...form.register(`itinerary.${index}.description` as const)} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Accommodation (Optional)</Label>
                      <Input {...form.register(`itinerary.${index}.stay` as const)} placeholder="e.g. Taj Palace Hotel" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Base Price (₹)</Label>
              <Input type="number" {...form.register("basePrice", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Duration (Days)</Label>
              <Input type="number" {...form.register("durationDays", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Max Group Size</Label>
              <Input type="number" {...form.register("maxGroupSize", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="trip-featured">Featured</Label>
                <p className="text-xs text-muted-foreground">Shows in the homepage Featured Trips section</p>
              </div>
              <Controller
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <Switch id="trip-featured" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="trip-trending">Trending</Label>
                <p className="text-xs text-muted-foreground">Shows in the homepage Trending This Season section</p>
              </div>
              <Controller
                control={form.control}
                name="trending"
                render={({ field }) => (
                  <Switch id="trip-trending" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Trip Type</Label>
              <Controller
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Cultural">Cultural</SelectItem>
                      <SelectItem value="Wildlife">Wildlife</SelectItem>
                      <SelectItem value="Beach">Beach</SelectItem>
                      <SelectItem value="Pilgrimage">Pilgrimage</SelectItem>
                      <SelectItem value="Backpacking">Backpacking</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="Road Trip">Road Trip</SelectItem>
                      <SelectItem value="Trek">Trek</SelectItem>
                      <SelectItem value="Workation">Workation</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Controller
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Challenging">Challenging</SelectItem>
                      <SelectItem value="Extreme">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </TabsContent>
        {isEdit && initialData && (
          <TabsContent value="departures" className="max-w-3xl">
            <DeparturesManager tripId={initialData._id} />
          </TabsContent>
        )}
      </Tabs>
    </form>
  );
}
