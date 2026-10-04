"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Story } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminStoriesPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stories"],
    queryFn: () => api.adminListStories(),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.adminDeleteStory(deleteId);
      toast.success("Story deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "stories"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete story");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<Story>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      accessor: (story) => (
        <div className="flex items-center gap-3">
          {story.coverImage && (
            <img src={story.coverImage} alt={story.title} className="w-10 h-10 rounded-md object-cover" />
          )}
          <div className="font-medium text-slate-900 dark:text-slate-100">{story.title}</div>
        </div>
      )
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      accessor: (story) => story.author?.name || "Unknown"
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (story) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          story.status === "PUBLISHED"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
        }`}>
          {story.status === "PUBLISHED" ? "Published" : "Draft"}
        </span>
      )
    },
    {
      key: "publishedAt",
      header: "Date",
      sortable: true,
      accessor: (story) => story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : "-"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stories</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage blog posts, travel guides, and customer stories.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        searchKey="title"
        searchPlaceholder="Search stories..."
        primaryAction={
          <Button className="bg-[#FF6B35] hover:bg-[#e85a25] text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Story
          </Button>
        }
        actions={(story) => (
          <>
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteId(story._id)}
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
        title="Delete Story"
        description="Are you sure you want to delete this story? This cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
