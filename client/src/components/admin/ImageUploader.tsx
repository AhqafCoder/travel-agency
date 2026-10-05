"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  /** Current image URL(s) — controlled. */
  value: string[];
  onChange: (urls: string[]) => void;
  /** Upload destination folder on Cloudinary, e.g. "trips", "destinations". */
  folder?: string;
  /** Allow only one image (rendered larger). */
  single?: boolean;
  label?: string;
  className?: string;
}

/**
 * Cloudinary-backed image picker. Uploads through the server's
 * POST /api/media/upload endpoint and returns secure URLs.
 */
export function ImageUploader({
  value,
  onChange,
  folder = "general",
  single = false,
  label,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const res = await api.media.upload(file, folder);
        uploaded.push(res.url);
      }
      onChange(single ? [uploaded[0]] : [...value, ...uploaded]);
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    const [img] = next.splice(index, 1);
    onChange([img, ...next]);
  };

  return (
    <div className={className}>
      {label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}

      <div
        className={cn(
          "flex flex-wrap gap-3",
          single && "flex-col sm:flex-row sm:items-start"
        )}
      >
        {value.map((url, i) => (
          <div
            key={url + i}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border bg-muted/60",
              single ? "h-32 w-full sm:w-56" : "h-24 w-32"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />

            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1.5 top-1.5 rounded-lg bg-black/60 p-1.5 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
              aria-label="Remove image"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            {!single && i !== 0 && (
              <button
                type="button"
                onClick={() => makeCover(i)}
                className="absolute bottom-1.5 left-1.5 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-semibold text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-orange-600"
              >
                Make cover
              </button>
            )}
            {!single && i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-lg bg-orange-600/90 px-2 py-1 text-[10px] font-semibold text-foreground">
                <Star className="h-2.5 w-2.5" /> Cover
              </span>
            )}
          </div>
        ))}

        {/* Upload tile */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-orange-500/40 hover:text-orange-600 disabled:opacity-50",
            single ? "h-32 w-full sm:w-56" : "h-24 w-32"
          )}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">
            {uploading ? "Uploading…" : "Upload"}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={!single}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-1.5 text-[11px] text-muted-foreground/80">
        Images upload to Cloudinary{single ? "" : " — first image becomes the cover"}.
      </p>
    </div>
  );
}
