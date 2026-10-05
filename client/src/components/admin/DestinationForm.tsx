"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Destination } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  FormField,
  adminInputClass,
} from "@/components/admin/FormPage";
import { ImageUploader } from "@/components/admin/ImageUploader";

const destinationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  state: z.string().optional(),
  country: z.string(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  bestTime: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  featured: z.boolean(),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

export function DestinationForm({ initialData }: { initialData?: Destination }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroImage, setHeroImage] = useState<string[]>(initialData?.heroImage ? [initialData.heroImage] : []);
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery ?? []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          state: initialData.state ?? "",
          country: initialData.country ?? "India",
          description: initialData.description,
          bestTime: initialData.bestTime ?? "",
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          featured: initialData.featured,
        }
      : {
          name: "",
          slug: "",
          state: "",
          country: "India",
          description: "",
          bestTime: "",
          featured: false,
        },
  });

  const autoSlug = () => {
    if (initialData) return; // don't clobber slug on edit
    const name = getValues("name");
    if (name) {
      setValue("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const onSubmit = async (values: DestinationFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        heroImage: heroImage[0] ?? "",
        gallery,
      };
      if (initialData) {
        await api.admin.destinations.update(initialData._id, payload);
        toast.success("Destination updated");
      } else {
        await api.admin.destinations.create(payload);
        toast.success("Destination created");
      }
      router.push("/admin/destinations");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save destination");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name" required error={errors.name?.message}>
          <input
            {...register("name", { onBlur: autoSlug })}
            placeholder="e.g. Spiti Valley"
            className={adminInputClass}
          />
        </FormField>

        <FormField
          label="Slug"
          required
          error={errors.slug?.message}
          hint="URL path — auto-generated from the name"
        >
          <input {...register("slug")} placeholder="spiti-valley" className={adminInputClass} />
        </FormField>

        <FormField label="State" error={errors.state?.message}>
          <input {...register("state")} placeholder="e.g. Himachal Pradesh" className={adminInputClass} />
        </FormField>

        <FormField label="Country" error={errors.country?.message}>
          <input {...register("country")} placeholder="India" className={adminInputClass} />
        </FormField>

        <FormField label="Best time to visit" error={errors.bestTime?.message}>
          <input {...register("bestTime")} placeholder="e.g. May – October" className={adminInputClass} />
        </FormField>

        <FormField label="Coordinates" hint="Optional — used for maps">
          <div className="grid grid-cols-2 gap-3">
            <input {...register("latitude", { valueAsNumber: true })} type="number" step="any" placeholder="Latitude" className={adminInputClass} />
            <input {...register("longitude", { valueAsNumber: true })} type="number" step="any" placeholder="Longitude" className={adminInputClass} />
          </div>
        </FormField>
      </div>

      <FormField
        label="Description"
        required
        error={errors.description?.message}
      >
        <textarea
          {...register("description")}
          rows={5}
          placeholder="What makes this destination special…"
          className={adminInputClass}
        />
      </FormField>

      <ImageUploader
        label="Hero image"
        value={heroImage}
        onChange={setHeroImage}
        folder="destinations"
        single
      />

      <ImageUploader
        label="Gallery"
        value={gallery}
        onChange={setGallery}
        folder="destinations"
      />

      <div className="flex items-center justify-between border-t border-border pt-5">
        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <span className="text-sm text-muted-foreground">Feature on homepage</span>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? "Saving…" : initialData ? "Save Changes" : "Create Destination"}
        </Button>
      </div>
    </form>
  );
}
