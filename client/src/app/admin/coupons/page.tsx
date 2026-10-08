"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Coupon } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CouponDialog } from "@/components/admin/CouponDialog";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => api.adminListCoupons(),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.adminDeleteCoupon(deleteId);
      toast.success("Coupon deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete coupon");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      header: "Code",
      sortable: true,
      accessor: (coupon) => (
        <span className="rounded bg-muted px-2 py-1 font-mono font-semibold text-orange-600">
          {coupon.code}
        </span>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      sortable: true,
      accessor: (coupon) =>
        coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `₹${coupon.value.toLocaleString()}`,
    },
    {
      key: "usage",
      header: "Usage",
      sortable: false,
      accessor: (coupon) => `${coupon.usedCount} / ${coupon.usageLimit || "∞"}`,
    },
    {
      key: "validUntil",
      header: "Valid Until",
      sortable: true,
      accessor: (coupon) =>
        coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : "Never",
    },
    {
      key: "active",
      header: "Status",
      sortable: true,
      accessor: (coupon) => (
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              coupon.active
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {coupon.active ? "Active" : "Inactive"}
          </span>
          {coupon.promoted && (
            <span
              title="Suggested publicly on the booking page"
              className="rounded-full bg-orange-500/15 px-2 py-1 text-xs font-medium text-orange-400"
            >
              Suggested
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        searchKey="code"
        searchPlaceholder="Search codes..."
        primaryAction={
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => {
              setEditingCoupon(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Coupon
          </Button>
        }
        actions={(coupon) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              title="Edit"
              onClick={() => {
                setEditingCoupon(coupon);
                setDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4 text-sky-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(coupon._id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </>
        )}
      />

      <CouponDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coupon={editingCoupon}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Coupon"
        description="Are you sure you want to delete this coupon? Users will no longer be able to apply it."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
