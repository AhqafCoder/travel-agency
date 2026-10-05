"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Trash2, Globe, GlobeLock } from "lucide-react";
import Link from "next/link";
import { Trip } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminTripsPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "trips"],
    queryFn: () => api.adminListTrips(),
  });

  const tripsList = Array.isArray(data) ? data : (data as any)?.data || [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.adminDeleteTrip(deleteId);
      toast.success("Trip deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "trips"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete trip");
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublish = async (trip: Trip) => {
    const next = trip.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await api.admin.trips.setStatus(trip._id, next);
      toast.success(next === "PUBLISHED" ? "Trip published" : "Trip unpublished");
      queryClient.invalidateQueries({ queryKey: ["admin", "trips"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update trip status");
    }
  };

  const columns: Column<Trip>[] = [
    {
      key: "title",
      header: "Trip Name",
      sortable: true,
      accessor: (trip) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{trip.title}</div>
          <div className="text-xs text-muted-foreground">{trip.durationDays} Days • {trip.tripType}</div>
        </div>
      )
    },
    {
      key: "destination",
      header: "Destination",
      sortable: true,
      accessor: (trip) => trip.destination?.name || "Unknown"
    },
    {
      key: "basePrice",
      header: "Price",
      sortable: true,
      accessor: (trip) => `$${trip.basePrice}`
    },
    {
      key: "difficulty",
      header: "Difficulty",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (trip) => <StatusBadge status={trip.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trips</h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Manage your travel itineraries, pricing, and content.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={tripsList}
        isLoading={isLoading}
        searchKey="title"
        searchPlaceholder="Search trips..."
        filterOptions={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Archived", value: "ARCHIVED" },
            ]
          },
          {
            key: "tripType",
            label: "Type",
            options: [
              { label: "Adventure", value: "Adventure" },
              { label: "Cultural", value: "Cultural" },
              { label: "Wildlife", value: "Wildlife" },
              { label: "Beach", value: "Beach" },
              { label: "Trek", value: "Trek" },
              { label: "Luxury", value: "Luxury" },
            ]
          }
        ]}
        primaryAction={
          <Button className="bg-[#FF6B35] hover:bg-[#e85a25] text-foreground" asChild>
            <Link href="/admin/trips/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Link>
          </Button>
        }
        actions={(trip) => (
          <>
            <Button variant="ghost" size="icon" asChild title="View Public Page">
              <Link href={`/trips/${trip.slug}`} target="_blank">
                <Eye className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => togglePublish(trip)}
              title={trip.status === "PUBLISHED" ? "Unpublish" : "Publish"}
            >
              {trip.status === "PUBLISHED" ? (
                <GlobeLock className="h-4 w-4 text-amber-600" />
              ) : (
                <Globe className="h-4 w-4 text-emerald-600" />
              )}
            </Button>
            <Button variant="ghost" size="icon" asChild title="Edit">
              <Link href={`/admin/trips/${trip._id}/edit`}>
                <Edit className="h-4 w-4 text-sky-600" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(trip._id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Trip"
        description="Are you sure you want to delete this trip? This action cannot be undone and will remove all associated departures."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
