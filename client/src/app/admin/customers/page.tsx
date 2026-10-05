"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { User, UserRole, Booking } from "@/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminInputClass } from "@/components/admin/FormPage";

const ROLES: UserRole[] = [
  "CUSTOMER",
  "EDITOR",
  "OPERATIONS",
  "ADMIN",
  "SUPER_ADMIN",
];

export default function AdminCustomersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState("1");
  const [viewingId, setViewingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customers", page],
    queryFn: () => api.adminListCustomers({ page, pageSize: "20" }),
  });

  const { data: detail } = useQuery({
    queryKey: ["admin", "customers", viewingId],
    queryFn: () => api.admin.customers.get(viewingId!),
    enabled: !!viewingId,
  });

  const updateRole = async (id: string, role: UserRole) => {
    try {
      await api.admin.customers.update(id, { role });
      toast.success(`Role updated to ${role}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    }
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      accessor: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-sm font-medium text-foreground">
            {user.name.charAt(0)}
          </div>
          <div className="font-medium text-foreground">{user.name}</div>
        </div>
      ),
    },
    { key: "email", header: "Email", sortable: true },
    { key: "phone", header: "Phone", sortable: false },
    {
      key: "role",
      header: "Role",
      sortable: true,
      accessor: (user) => (
        <select
          value={user.role}
          onChange={(e) => updateRole(user._id, e.target.value as UserRole)}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md border border-border bg-muted/60 px-2 py-1 text-xs text-foreground outline-none focus:border-orange-500/50"
        >
          {ROLES.map((role) => (
            <option key={role} value={role} className="bg-popover">
              {role}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      accessor: (user) =>
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search customers..."
        filterOptions={[
          {
            key: "role",
            label: "Role",
            options: ROLES.map((r) => ({ label: r, value: r })),
          },
        ]}
        actions={(user) => (
          <Button
            variant="ghost"
            size="icon"
            title="View Profile"
            onClick={() => setViewingId(user._id)}
          >
            <Eye className="h-4 w-4 text-sky-600" />
          </Button>
        )}
      />

      {/* Customer detail */}
      <Dialog open={!!viewingId} onOpenChange={(open) => !open && setViewingId(null)}>
        <DialogContent className="max-w-lg border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              Account details and booking history.
            </DialogDescription>
          </DialogHeader>

          {!detail ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-lg font-bold text-orange-600">
                  {detail.user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{detail.user.name}</p>
                  <p className="text-sm text-muted-foreground">{detail.user.email}</p>
                  {detail.user.phone && (
                    <p className="text-xs text-muted-foreground/80">{detail.user.phone}</p>
                  )}
                </div>
                <span className="ml-auto rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {detail.user.role}
                </span>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bookings ({detail.bookings.length})
                </p>
                {detail.bookings.length === 0 ? (
                  <p className="rounded-lg border border-border/60 bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground/80">
                    No bookings yet.
                  </p>
                ) : (
                  <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                    {detail.bookings.map((b: Booking) => (
                      <div
                        key={b._id}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {(b.tripId as any)?.title || "Trip"}
                          </p>
                          <p className="text-xs text-muted-foreground/80">
                            {b.bookingNumber} •{" "}
                            {new Date(b.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{b.total}</p>
                          <p className="text-xs text-muted-foreground">
                            {b.bookingStatus}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setViewingId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
