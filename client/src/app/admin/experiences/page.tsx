"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Experience } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminExperiencesPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "experiences"],
    queryFn: () => api.adminListExperiences(),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.adminDeleteExperience(deleteId);
      toast.success("Experience deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "experiences"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete experience");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<Experience>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      accessor: (exp) => (
        <div className="flex items-center gap-3">
          {exp.images?.[0] && (
            <img src={exp.images[0]} alt={exp.title} className="w-10 h-10 rounded-md object-cover" />
          )}
          <div className="font-medium text-slate-900 dark:text-slate-100">{exp.title}</div>
        </div>
      )
    },
    {
      key: "destination",
      header: "Destination",
      sortable: true,
      accessor: (exp) => exp.destination?.name || "Unknown"
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      accessor: (exp) => `$${exp.price}`
    },
    {
      key: "duration",
      header: "Duration",
      sortable: true,
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Experiences</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage local activities, workshops, and day tours.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.experiences || []}
        isLoading={isLoading}
        searchKey="title"
        searchPlaceholder="Search experiences..."
        primaryAction={
          <Button className="bg-[#FF6B35] hover:bg-[#e85a25] text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Experience
          </Button>
        }
        actions={(exp) => (
          <>
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteId(exp._id)}
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
        title="Delete Experience"
        description="Are you sure you want to delete this experience? This cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
