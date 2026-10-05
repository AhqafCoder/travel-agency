"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Story, StoryStatus } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  FormField,
  adminInputClass,
} from "@/components/admin/FormPage";
import { ImageUploader } from "@/components/admin/ImageUploader";

const storySchema = z.object({
  title: z.string().min(5, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(2, "Category is required"),
  tags: z.string().optional(),
  featured: z.boolean(),
  publish: z.boolean(),
});

type StoryFormValues = z.infer<typeof storySchema>;

export function StoryForm({ initialData }: { initialData?: Story }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string[]>(
    initialData?.coverImage ? [initialData.coverImage] : []
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          excerpt: initialData.excerpt,
          content: initialData.content,
          category: initialData.category,
          tags: (initialData.tags ?? []).join(", "),
          featured: initialData.featured,
          publish: initialData.status === "PUBLISHED",
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          category: "Travel",
          tags: "",
          featured: false,
          publish: false,
        },
  });

  const autoSlug = () => {
    if (initialData) return;
    const title = getValues("title");
    if (title) {
      setValue("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const onSubmit = async (values: StoryFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: Partial<Story> = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        tags: values.tags
          ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        coverImage: coverImage[0] ?? "",
        featured: values.featured,
        status: (values.publish ? "PUBLISHED" : "DRAFT") as StoryStatus,
        publishedAt: values.publish
          ? (initialData?.publishedAt ?? new Date())
          : undefined,
      };
      if (initialData) {
        await api.admin.stories.update(initialData._id, payload);
        toast.success("Story updated");
      } else {
        await api.admin.stories.create(payload);
        toast.success("Story created");
      }
      router.push("/admin/stories");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save story");
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
            placeholder="e.g. Chasing Waterfalls in Meghalaya"
            className={adminInputClass}
          />
        </FormField>

        <FormField label="Slug" required error={errors.slug?.message}>
          <input {...register("slug")} className={adminInputClass} />
        </FormField>

        <FormField label="Category" required error={errors.category?.message}>
          <input {...register("category")} placeholder="e.g. Travel, Guide" className={adminInputClass} />
        </FormField>

        <FormField label="Tags" hint="Comma-separated">
          <input {...register("tags")} placeholder="himalayas, trekking, winter" className={adminInputClass} />
        </FormField>
      </div>

      <FormField label="Excerpt" required error={errors.excerpt?.message}>
        <textarea
          {...register("excerpt")}
          rows={2}
          placeholder="Short summary shown on cards…"
          className={adminInputClass}
        />
      </FormField>

      <FormField label="Content" required error={errors.content?.message} hint="HTML or plain paragraphs">
        <textarea
          {...register("content")}
          rows={12}
          placeholder="Write the story…"
          className={`${adminInputClass} font-mono text-[13px] leading-relaxed`}
        />
      </FormField>

      <ImageUploader
        label="Cover image"
        value={coverImage}
        onChange={setCoverImage}
        folder="stories"
        single
      />

      <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
                Featured
              </label>
            )}
          />
          <Controller
            control={control}
            name="publish"
            render={({ field }) => (
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
                {field.value ? "Published" : "Draft"}
              </label>
            )}
          />
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
          {isSubmitting ? "Saving…" : initialData ? "Save Changes" : "Create Story"}
        </Button>
      </div>
    </form>
  );
}
