"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Experience } from "@/types";
import { Button } from "@/components/ui/button";
import {
  FormField,
  adminInputClass,
} from "@/components/admin/FormPage";
import { ImageUploader } from "@/components/admin/ImageUploader";

const experienceSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  destinationId: z.string().min(1, "Pick a destination"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  duration: z.string().min(2, "Duration is required"),
  price: z.number().min(0),
  capacity: z.number().min(1),
  category: z.string().min(2, "Category is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  highlights: z.array(z.object({ value: z.string() })),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export function ExperienceForm({ initialData }: { initialData?: Experience }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);

  const { data: destData } = useQuery({
    queryKey: ["admin", "destinations"],
    queryFn: () => api.adminListDestinations({ pageSize: "100" }),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          destinationId: initialData.destinationId,
          description: initialData.description,
          duration: initialData.duration,
          price: initialData.price,
          capacity: initialData.capacity || 10,
          category: initialData.category,
          status: initialData.status,
          highlights: (initialData.highlights ?? []).map((h) => ({ value: h })),
        }
      : {
          title: "",
          slug: "",
          destinationId: "",
          description: "",
          duration: "",
          price: 0,
          capacity: 10,
          category: "",
          status: "ACTIVE",
          highlights: [{ value: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "highlights",
  });

  const autoSlug = () => {
    if (initialData) return;
    const title = getValues("title");
    if (title) {
      setValue("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const onSubmit = async (values: ExperienceFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        images,
        highlights: values.highlights.map((h) => h.value).filter(Boolean),
      };
      if (initialData) {
        await api.admin.experiences.update(initialData._id, payload);
        toast.success("Experience updated");
      } else {
        await api.admin.experiences.create(payload);
        toast.success("Experience created");
      }
      router.push("/admin/experiences");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Title" required error={errors.title?.message}>
          <input
            {...register("title", { onBlur: autoSlug })}
            placeholder="e.g. Sunrise Hot Air Balloon Ride"
            className={adminInputClass}
          />
        </FormField>

        <FormField label="Slug" required error={errors.slug?.message}>
          <input {...register("slug")} className={adminInputClass} />
        </FormField>

        <FormField label="Destination" required error={errors.destinationId?.message}>
          <select
            {...register("destinationId")}
            className={adminInputClass}
            defaultValue={initialData?.destinationId || ""}
          >
            <option value="" disabled className="bg-popover">
              Select destination
            </option>
            {(destData?.data ?? []).map((d) => (
              <option key={d._id} value={d._id} className="bg-popover">
                {d.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Category" required error={errors.category?.message}>
          <input
            {...register("category")}
            placeholder="e.g. Adventure, Food, Culture"
            className={adminInputClass}
          />
        </FormField>

        <FormField label="Duration" required error={errors.duration?.message}>
          <input
            {...register("duration")}
            placeholder='e.g. "3 hours" or "Full day"'
            className={adminInputClass}
          />
        </FormField>

        <FormField label="Status">
          <select {...register("status")} className={adminInputClass}>
            <option value="ACTIVE" className="bg-popover">Active</option>
            <option value="INACTIVE" className="bg-popover">Inactive</option>
          </select>
        </FormField>

        <FormField label="Price (₹)" required error={errors.price?.message}>
          <input {...register("price", { valueAsNumber: true })} type="number" min={0} className={adminInputClass} />
        </FormField>

        <FormField label="Capacity" error={errors.capacity?.message}>
          <input {...register("capacity", { valueAsNumber: true })} type="number" min={1} className={adminInputClass} />
        </FormField>
      </div>

      <FormField label="Description" required error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={5}
          placeholder="Describe the experience…"
          className={adminInputClass}
        />
      </FormField>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Highlights
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: "" })}
            className="border-border text-foreground hover:bg-muted/60"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`highlights.${i}.value` as const)}
                placeholder="e.g. Panoramic views of the valley at sunrise"
                className={adminInputClass}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(i)}
                className="shrink-0 text-muted-foreground hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <ImageUploader
        label="Images"
        value={images}
        onChange={setImages}
        folder="experiences"
      />

      <div className="flex justify-end border-t border-border pt-5">
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
          {isSubmitting ? "Saving…" : initialData ? "Save Changes" : "Create Experience"}
        </Button>
      </div>
    </form>
  );
}
