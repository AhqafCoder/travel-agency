"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StoryForm } from "@/components/admin/StoryForm";
import { FormPage } from "@/components/admin/FormPage";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditStoryPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stories", id],
    queryFn: () => api.admin.stories.get(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const story = (data as any)?.data ?? data;

  return (
    <FormPage title="Edit Story" backHref="/admin/stories">
      <StoryForm initialData={story} />
    </FormPage>
  );
}
