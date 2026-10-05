"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { TripDeparture } from "@/types";

const fmt = (d?: string | Date) => (d ? new Date(d).toLocaleDateString() : "—");

export default function AdminDeparturesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "all-departures"],
    queryFn: () => api.adminListAllDepartures(),
  });

  const columns: Column<TripDeparture>[] = [
    {
      key: "trip",
      header: "Trip",
      sortable: true,
      accessor: (dep) => (
        <div>
          <div className="font-medium text-foreground">
            {(dep.tripId as any)?.title || "Unknown trip"}
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {(dep.tripId as any)?.slug}
          </div>
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Dates",
      sortable: true,
      accessor: (dep) => (
        <span className="text-sm text-foreground">
          {fmt(dep.startDate)} → {fmt(dep.endDate)}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      accessor: (dep) => `₹${dep.price?.toLocaleString()}`,
    },
    {
      key: "seats",
      header: "Seats",
      sortable: false,
      accessor: (dep) => {
        const pct = dep.capacity ? Math.round((dep.bookedSeats / dep.capacity) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {dep.bookedSeats}/{dep.capacity}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (dep) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            dep.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-600"
              : dep.status === "CANCELLED"
              ? "bg-red-500/10 text-red-600"
              : dep.status === "COMPLETED"
              ? "bg-sky-500/10 text-sky-600"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {dep.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        searchPlaceholder="Search departures..."
        filterOptions={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Active", value: "ACTIVE" },
              { label: "Closed", value: "CLOSED" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Cancelled", value: "CANCELLED" },
            ],
          },
        ]}
        actions={(dep) => (
          <Button
            variant="ghost"
            size="icon"
            title="Manage in trip editor"
            asChild
          >
            <a href={`/admin/trips/${(dep.tripId as any)?._id ?? dep.tripId}/edit`}>
              <Link2 className="h-4 w-4 text-sky-600" />
            </a>
          </Button>
        )}
      />
      <p className="text-xs text-muted-foreground/80">
        Tip: create, edit and delete departures from the{" "}
        <span className="text-muted-foreground">Departures tab inside each trip&apos;s editor</span>.
      </p>
    </div>
  );
}
