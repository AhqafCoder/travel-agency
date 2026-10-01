"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Review } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: () => api.adminListReviews(),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.adminDeleteReview(deleteId);
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete review");
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.adminUpdateReview(id, { status });
      toast.success(`Review ${status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    } catch (error: any) {
      toast.error(error.message || `Failed to ${status.toLowerCase()} review`);
    }
  };

  const columns: Column<Review>[] = [
    {
      key: "user",
      header: "User",
      sortable: true,
      accessor: (review) => (
        <div className="flex items-center gap-2">
          <div className="font-medium text-sm">{review.user?.name || "Unknown"}</div>
        </div>
      )
    },
    {
      key: "trip",
      header: "Trip",
      sortable: true,
      accessor: (review) => (
        <div className="text-sm">{review.trip?.title || "Unknown"}</div>
      )
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      accessor: (review) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{review.rating}</span>
          <span className="text-yellow-500 text-xs">★</span>
        </div>
      )
    },
    {
      key: "text",
      header: "Review",
      sortable: false,
      accessor: (review) => (
        <div className="max-w-xs truncate text-xs text-slate-500" title={review.text}>
          {review.text}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (review) => <StatusBadge status={review.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Moderate customer reviews before they appear on the site.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.reviews || []}
        isLoading={isLoading}
        searchKey="text"
        searchPlaceholder="Search reviews..."
        filterOptions={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
            ]
          },
          {
            key: "rating",
            label: "Rating",
            options: [
              { label: "5 Stars", value: "5" },
              { label: "4 Stars", value: "4" },
              { label: "3 Stars", value: "3" },
              { label: "2 Stars", value: "2" },
              { label: "1 Star", value: "1" },
            ]
          }
        ]}
        actions={(review) => (
          <>
            {review.status !== "APPROVED" && (
              <Button 
                variant="ghost" 
                size="icon" 
                title="Approve"
                onClick={() => handleStatusChange(review._id, "APPROVED")}
              >
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </Button>
            )}
            {review.status !== "REJECTED" && (
              <Button 
                variant="ghost" 
                size="icon" 
                title="Reject"
                onClick={() => handleStatusChange(review._id, "REJECTED")}
              >
                <XCircle className="h-4 w-4 text-orange-500" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteId(review._id)}
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
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
