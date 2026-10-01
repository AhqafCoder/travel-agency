"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Coupon } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        <span className="font-mono font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
          {coupon.code}
        </span>
      )
    },
    {
      key: "discount",
      header: "Discount",
      sortable: true,
      accessor: (coupon) => coupon.type === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`
    },
    {
      key: "usage",
      header: "Usage",
      sortable: false,
      accessor: (coupon) => `${coupon.usageCount} / ${coupon.usageLimit || "∞"}`
    },
    {
      key: "expiry",
      header: "Expires",
      sortable: true,
      accessor: (coupon) => coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : "Never"
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      accessor: (coupon) => <StatusBadge status={coupon.isActive ? "ACTIVE" : "INACTIVE"} />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage discount codes and promotions.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.coupons || []}
        isLoading={isLoading}
        searchKey="code"
        searchPlaceholder="Search codes..."
        primaryAction={
          <Button className="bg-[#FF6B35] hover:bg-[#e85a25] text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Coupon
          </Button>
        }
        actions={(coupon) => (
          <>
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteId(coupon._id)}
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
        title="Delete Coupon"
        description="Are you sure you want to delete this coupon? Users will no longer be able to apply it."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
