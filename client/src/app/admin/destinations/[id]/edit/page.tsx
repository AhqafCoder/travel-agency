"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { FormPage } from "@/components/admin/FormPage";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditDestinationPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "destinations", id],
    queryFn: () => api.admin.destinations.get(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const destination = (data as any)?.data ?? data;

  return (
    <FormPage
      title="Edit Destination"
      backHref="/admin/destinations"
    >
      <DestinationForm initialData={destination} />
    </FormPage>
  );
}
