"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
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

  const columns: Column<Trip>[] = [
    {
      key: "title",
      header: "Trip Name",
      sortable: true,
      accessor: (trip) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{trip.title}</div>
          <div className="text-xs text-slate-500">{trip.durationDays} Days • {trip.type}</div>
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
        <p className="text-slate-500 dark:text-slate-400">
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
            key: "type",
            label: "Type",
            options: [
              { label: "Group", value: "GROUP" },
              { label: "Private", value: "PRIVATE" },
              { label: "Honeymoon", value: "HONEYMOON" },
            ]
          }
        ]}
        primaryAction={
          <Button className="bg-[#FF6B35] hover:bg-[#e85a25] text-white" asChild>
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
                <Eye className="h-4 w-4 text-slate-500" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild title="Edit">
              <Link href={`/admin/trips/${trip._id}/edit`}>
                <Edit className="h-4 w-4 text-blue-500" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteId(trip._id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
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
