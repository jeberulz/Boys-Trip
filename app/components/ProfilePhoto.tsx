"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ProfilePhotoProps {
  photoStorageId?: Id<"_storage">;
  photoUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ProfilePhoto({
  photoStorageId,
  photoUrl,
  name,
  size = "md",
  className = "",
}: ProfilePhotoProps) {
  const storageUrl = useQuery(
    api.photos.getPhotoUrl,
    photoStorageId ? { storageId: photoStorageId } : "skip"
  );

  const sizeClasses = {
    sm: "w-24 h-24 text-3xl",
    md: "w-32 h-32 text-4xl",
    lg: "w-48 h-48 text-6xl",
    xl: "w-full h-full text-8xl",
  };

  // Determine which URL to use (priority: storage > external URL > fallback)
  const imageUrl = storageUrl || photoUrl;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`object-cover ${className}`}
      />
    );
  }

  // Fallback to initial letter
  // If className includes width/height overrides, use proportional text size
  const widthMatch = className.match(/\bw-(\d+)\b/);
  const heightMatch = className.match(/\bh-(\d+)\b/);
  const overrideSize = widthMatch ? parseInt(widthMatch[1]) : heightMatch ? parseInt(heightMatch[1]) : null;
  
  let textSizeClass = sizeClasses[size].split(" ")[2];
  if (overrideSize) {
    // Map width to appropriate text size
    if (overrideSize <= 16) textSizeClass = "text-xl";
    else if (overrideSize <= 24) textSizeClass = "text-2xl";
    else if (overrideSize <= 32) textSizeClass = "text-4xl";
    else if (overrideSize <= 40) textSizeClass = "text-5xl";
    else if (overrideSize <= 48) textSizeClass = "text-5xl";
    else textSizeClass = "text-6xl";
  }
  
  const baseSizeClass = overrideSize ? "" : sizeClasses[size].split(" ").slice(0, 2).join(" ");
  
  return (
    <div
      className={`${baseSizeClass} ${textSizeClass} flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-600 text-white font-bold rounded-full ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
