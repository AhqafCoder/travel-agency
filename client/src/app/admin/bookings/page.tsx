"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Booking, BookingStatus } from "@/types";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const [action, setAction] = useState<{ booking: Booking; status: BookingStatus } | null>(null);
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => api.adminListBookings(),
  });

  const confirmAction = async () => {
    if (!action) return;
    setBusy(true);
    try {
      await api.admin.bookings.updateStatus(action.booking._id, action.status);
      toast.success(`Booking ${action.booking.bookingNumber} → ${action.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking");
    } finally {
      setBusy(false);
      setAction(null);
    }
  };

  const columns: Column<Booking>[] = [
    {
      key: "bookingNumber",
      header: "Ref",
      sortable: true,
      accessor: (booking) => (
        <span className="font-mono text-xs font-semibold text-orange-600">
          {booking.bookingNumber}
        </span>
      ),
    },
    {
      key: "user",
      header: "Customer",
      sortable: true,
      accessor: (booking) => (
        <div>
          <div className="font-medium text-foreground">{booking.user?.name || "Unknown"}</div>
          <div className="text-xs text-muted-foreground">{booking.user?.email || ""}</div>
        </div>
      ),
    },
    {
      key: "trip",
      header: "Trip",
      sortable: true,
      accessor: (booking) => (
        <div>
          <div className="font-medium text-foreground">{booking.trip?.title || "Unknown"}</div>
          <div className="text-xs text-muted-foreground">
            {booking.travellers?.length || booking.travellersCount || 1} traveller(s)
          </div>
        </div>
      ),
    },
    {
      key: "total",
      header: "Amount",
      sortable: true,
      accessor: (booking) => (
        <div>
          <div className="font-semibold">₹{booking.total?.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{booking.paymentStatus}</div>
        </div>
      ),
    },
    {
      key: "bookingStatus",
      header: "Status",
      sortable: true,
      accessor: (booking) => <StatusBadge status={booking.bookingStatus} />,
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        searchKey="bookingNumber"
        searchPlaceholder="Search bookings..."
        filterOptions={[
          {
            key: "bookingStatus",
            label: "Status",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Cancelled", value: "CANCELLED" },
            ],
          },
        ]}
        actions={(booking) => (
          <>
            {booking.bookingStatus === "PENDING" && (
              <Button
                variant="ghost"
                size="icon"
                title="Confirm Booking"
                onClick={() => setAction({ booking, status: "CONFIRMED" })}
              >
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </Button>
            )}
            {booking.bookingStatus !== "CANCELLED" && booking.bookingStatus !== "COMPLETED" && (
              <Button
                variant="ghost"
                size="icon"
                title="Cancel Booking"
                onClick={() => setAction({ booking, status: "CANCELLED" })}
              >
                <XCircle className="h-4 w-4 text-red-600" />
              </Button>
            )}
          </>
        )}
      />

      <ConfirmDialog
        open={!!action}
        onOpenChange={(open) => !open && setAction(null)}
        title={action?.status === "CONFIRMED" ? "Confirm Booking" : "Cancel Booking"}
        description={
          action
            ? `${action.status === "CONFIRMED" ? "Confirm" : "Cancel"} booking ${action.booking.bookingNumber} for ${action.booking.user?.name || "this customer"}?`
            : ""
        }
        onConfirm={confirmAction}
        confirmText={action?.status === "CONFIRMED" ? "Confirm" : "Cancel Booking"}
        variant={action?.status === "CONFIRMED" ? "default" : "destructive"}
        loading={busy}
      />
    </div>
  );
}
