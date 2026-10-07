"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy, RefreshCw, Images } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaAsset {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  createdAt?: string;
}

const FOLDERS = ["", "trips", "destinations", "experiences", "stories", "reviews", "avatars", "general"] as const;

function assetName(publicId: string) {
  return publicId.split("/").slice(2).join("/") || publicId;
}

export default function AdminMediaPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [folder, setFolder] = useState<string>("");
  const [deleteAsset, setDeleteAsset] = useState<MediaAsset | null>(null);

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useInfiniteQuery({
      queryKey: ["admin", "media", folder],
      queryFn: ({ pageParam }) => api.media.list(folder || undefined, pageParam || undefined),
      initialPageParam: "",
      getNextPageParam: (last) => last?.meta?.nextCursor ?? undefined,
    });

  const assets: MediaAsset[] = (data?.pages ?? []).flatMap((p) => p?.data ?? []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const res = await api.media.upload(file, folder || "general");
      toast.success("Image uploaded successfully!");
      try {
        await navigator.clipboard.writeText(res.url);
        toast.info("Image URL copied to clipboard");
      } catch {
        /* clipboard may be blocked — the grid below shows the image anyway */
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteAsset) return;
    try {
      await api.media.delete(deleteAsset.publicId);
      toast.success("Image deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete image");
    } finally {
      setDeleteAsset(null);
    }
  };

  const copyUrl = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      toast.success("URL copied");
    } catch {
      toast.error("Couldn't copy — clipboard unavailable");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Images stored in Cloudinary — copy a URL to use it in trips, stories and experiences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
          <Button
            variant="outline"
            size="icon"
            title="Refresh"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "media"] })}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button
            className="bg-[#FF6B35] hover:bg-[#e85a25] text-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </div>

      {/* Folder filter */}
      <div className="flex flex-wrap items-center gap-2">
        {FOLDERS.map((f) => (
          <button
            key={f || "all"}
            onClick={() => setFolder(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              folder === f
                ? "border-[#FF6B35] bg-[#FF6B35]/10 text-[#e85a25]"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {f || "All folders"}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center text-sm text-red-500">
          Couldn&apos;t load the library — {(error as Error).message}
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
            <Images className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-1">No images here yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
            Upload an image — it lands in the “{folder || "editmytrips"}” Cloudinary folder and appears in this library.
          </p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            Browse Files
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {assets.map((asset) => (
              <div
                key={asset.publicId}
                className="group overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={assetName(asset.publicId)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon" title="Copy URL" className="h-7 w-7 text-white hover:bg-white/20" onClick={() => copyUrl(asset)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" className="h-7 w-7 text-white hover:bg-red-500/70" onClick={() => setDeleteAsset(asset)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-foreground" title={assetName(asset.publicId)}>
                    {assetName(asset.publicId)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {asset.width}×{asset.height} · {(asset.format ?? "").toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteAsset}
        onOpenChange={(open) => !open && setDeleteAsset(null)}
        title="Delete Image"
        description={`This permanently removes “${deleteAsset ? assetName(deleteAsset.publicId) : ""}” from Cloudinary. If it's used on a trip, destination or story, that image will break.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
