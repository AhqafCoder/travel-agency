"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Story } from "@/types";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";

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
          {story.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={story.coverImage}
              alt={story.title}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-muted/60" />
          )}
          <div>
            <div className="font-medium text-foreground">{story.title}</div>
            <div className="text-xs text-muted-foreground">{story.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      accessor: (story) => story.author?.name || "—",
    },
    {
      key: "views",
      header: "Views",
      sortable: true,
      accessor: (story) => story.views?.toLocaleString() ?? "0",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (story) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            story.status === "PUBLISHED"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {story.status === "PUBLISHED" ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "publishedAt",
      header: "Date",
      sortable: true,
      accessor: (story) =>
        story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        searchKey="title"
        searchPlaceholder="Search stories..."
        primaryAction={
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            asChild
          >
            <Link href="/admin/stories/new">
              <Plus className="mr-2 h-4 w-4" />
              New Story
            </Link>
          </Button>
        }
        actions={(story) => (
          <>
            <Button variant="ghost" size="icon" title="Edit" asChild>
              <Link href={`/admin/stories/${story._id}/edit`}>
                <Edit className="h-4 w-4 text-sky-600" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(story._id)}
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
        title="Delete Story"
        description="Are you sure you want to delete this story? This cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
