"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TripForm } from "@/components/admin/TripForm";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditTripPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "trips", id],
    queryFn: () => api.adminGetTrip(id),
    enabled: !!id,
  });

  const trip = (data as any)?.data || data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <TripForm initialData={trip} isEdit={true} />
    </div>
  );
}
