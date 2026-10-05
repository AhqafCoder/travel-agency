"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Experience } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";

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
          {exp.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={exp.images[0]}
              alt={exp.title}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-muted/60" />
          )}
          <div>
            <div className="font-medium text-foreground">{exp.title}</div>
            <div className="text-xs text-muted-foreground">{exp.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: "destination",
      header: "Destination",
      sortable: true,
      accessor: (exp) => exp.destination?.name || "—",
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      accessor: (exp) => `₹${exp.price.toLocaleString()}`,
    },
    {
      key: "duration",
      header: "Duration",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (exp) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            exp.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {exp.status}
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
        searchKey="title"
        searchPlaceholder="Search experiences..."
        primaryAction={
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            asChild
          >
            <Link href="/admin/experiences/new">
              <Plus className="mr-2 h-4 w-4" />
              New Experience
            </Link>
          </Button>
        }
        actions={(exp) => (
          <>
            <Button variant="ghost" size="icon" title="Edit" asChild>
              <Link href={`/admin/experiences/${exp._id}/edit`}>
                <Edit className="h-4 w-4 text-sky-600" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(exp._id)}
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
        title="Delete Experience"
        description="Are you sure you want to delete this experience? This cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
