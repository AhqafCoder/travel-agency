"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Destination } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
          {dest.heroImage && (
            <img src={dest.heroImage} alt={dest.name} className="w-10 h-10 rounded-md object-cover" />
          )}
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{dest.name}</div>
            <div className="text-xs text-slate-500">{dest.state || dest.country}</div>
          </div>
        </div>
      )
    },
    {
      key: "region",
      header: "Region",
      sortable: true,
    },
    {
      key: "bestTimeToVisit",
      header: "Best Time",
      sortable: false,
    },
    {
      key: "tripCount",
      header: "Trips",
      sortable: false,
      accessor: (dest) => (
        <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-xs font-medium">
          {/* Mock trip count until aggregated server-side */}
          {Math.floor(Math.random() * 10) + 1} 
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Destinations</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage travel destinations and their content.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.destinations || []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search destinations..."
        primaryAction={
          <Button className="bg-[#FF6B35] hover:bg-[#e85a25] text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Destination
          </Button>
        }
        actions={(dest) => (
          <>
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteId(dest._id)}
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
        title="Delete Destination"
        description="Are you sure you want to delete this destination? Trips associated with this destination may lose their reference."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
