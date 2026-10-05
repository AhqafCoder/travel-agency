"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Destination } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";

export default function AdminDestinationsPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "destinations"],
    queryFn: () => api.adminListDestinations(),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.adminDeleteDestination(deleteId);
      toast.success("Destination deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete destination");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<Destination>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      accessor: (dest) => (
        <div className="flex items-center gap-3">
          {dest.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dest.heroImage}
              alt={dest.name}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-muted/60" />
          )}
          <div>
            <div className="font-medium text-foreground">{dest.name}</div>
            <div className="text-xs text-muted-foreground">
              {dest.state ? `${dest.state}, ` : ""}
              {dest.country}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      sortable: true,
      accessor: (dest) => (
        <span className="font-mono text-xs text-muted-foreground">{dest.slug}</span>
      ),
    },
    {
      key: "bestTime",
      header: "Best Time",
      sortable: false,
    },
    {
      key: "featured",
      header: "Featured",
      sortable: true,
      accessor: (dest) =>
        dest.featured ? (
          <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-600">
            Featured
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/80">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search destinations..."
        primaryAction={
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            asChild
          >
            <Link href="/admin/destinations/new">
              <Plus className="mr-2 h-4 w-4" />
              New Destination
            </Link>
          </Button>
        }
        actions={(dest) => (
          <>
            <Button variant="ghost" size="icon" title="Edit" asChild>
              <Link href={`/admin/destinations/${dest._id}/edit`}>
                <Edit className="h-4 w-4 text-sky-600" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(dest._id)}
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
        title="Delete Destination"
        description="Are you sure you want to delete this destination? Trips associated with this destination may lose their reference."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
