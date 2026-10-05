"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { FormPage } from "@/components/admin/FormPage";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditExperiencePage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "experiences", id],
    queryFn: () => api.admin.experiences.get(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const experience = (data as any)?.data ?? data;

  return (
    <FormPage title="Edit Experience" backHref="/admin/experiences">
      <ExperienceForm initialData={experience} />
    </FormPage>
  );
}
