"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminMediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Since we don't have a direct "list all media" endpoint in the plan (Cloudinary handles it),
  // we could just allow upload here and show a message. Or we could fetch recent trips/experiences
  // and extract their images to display a mock library.
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await api.media.upload(file, "editmytrips");
      toast.success("Image uploaded successfully!");
      console.log("Uploaded image:", res.url);
      // In a real app, you'd save this to a local Media collection or just copy URL
      navigator.clipboard.writeText(res.url);
      toast.info("Image URL copied to clipboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground dark:text-muted-foreground">
            Upload images for trips, destinations, and experiences.
          </p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleUpload}
          />
          <Button 
            className="bg-[#FF6B35] hover:bg-[#e85a25] text-foreground"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-12 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900/50">
        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-muted-foreground">
          <Upload className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium mb-1">Upload images to Cloudinary</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
          Click the upload button to select an image from your computer. The image will be uploaded to Cloudinary and the URL will be copied to your clipboard.
        </p>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          Browse Files
        </Button>
      </div>
    </div>
  );
}
