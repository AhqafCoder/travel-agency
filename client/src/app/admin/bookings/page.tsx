"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Booking } from "@/types";

export default function AdminBookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => api.adminListBookings(),
  });

  const columns: Column<Booking>[] = [
    {
      key: "bookingReference",
      header: "Ref",
      sortable: true,
      accessor: (booking) => <span className="font-mono text-xs font-semibold">{booking.bookingReference || booking._id?.slice(-8).toUpperCase()}</span>
    },
    {
      key: "user",
      header: "Customer",
      sortable: true,
      accessor: (booking) => (
        <div>
          <div className="font-medium">{booking.user?.name || "Unknown"}</div>
          <div className="text-xs text-slate-500">{booking.user?.email || ""}</div>
        </div>
      )
    },
    {
      key: "trip",
      header: "Trip",
      sortable: true,
      accessor: (booking) => (
        <div>
          <div className="font-medium">{booking.trip?.title || "Unknown"}</div>
          <div className="text-xs text-slate-500">
            {booking.travellers?.length || 1} traveller(s)
          </div>
        </div>
      )
    },
    {
      key: "totalAmount",
      header: "Amount",
      sortable: true,
      accessor: (booking) => `$${booking.totalAmount}`
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (booking) => <StatusBadge status={booking.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage customer reservations and payment statuses.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.bookings || []}
        isLoading={isLoading}
        searchKey="user" // Need to handle nested search carefully, API should ideally filter
        searchPlaceholder="Search bookings..."
        filterOptions={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Cancelled", value: "CANCELLED" },
              { label: "Completed", value: "COMPLETED" },
            ]
          }
        ]}
        actions={(booking) => (
          <>
            <Button variant="ghost" size="icon" title="View Details">
              <Eye className="h-4 w-4 text-blue-500" />
            </Button>
            {booking.status === "PENDING" && (
              <Button variant="ghost" size="icon" title="Confirm Booking">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </Button>
            )}
            {booking.status !== "CANCELLED" && (
              <Button variant="ghost" size="icon" title="Cancel Booking">
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </>
        )}
      />
    </div>
  );
}
