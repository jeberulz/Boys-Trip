"use client";

import Link from "next/link";
import { Icon } from "./Icon";
import { ProfilePhoto } from "./ProfilePhoto";
import { Id } from "@/convex/_generated/dataModel";

interface ProfileCardProps {
  profile: {
    _id: Id<"profiles">;
    name: string;
    location: string;
    photoStorageId?: Id<"_storage">;
    photoUrl?: string;
    passions?: string;
    background?: string;
  };
  variant?: "default" | "compact";
}

export function ProfileCard({ profile, variant = "default" }: ProfileCardProps) {
  const preview = profile.passions || profile.background || "";

  if (variant === "compact") {
    return (
      <Link
        href={`/profile/${profile._id}`}
        className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group block"
      >
        <div className="flex items-center gap-3 mb-3">
          <ProfilePhoto
            photoStorageId={profile.photoStorageId}
            photoUrl={profile.photoUrl}
            name={profile.name}
            size="sm"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="text-sm font-medium text-slate-900">{profile.name}</h4>
            <p className="text-xs text-slate-500">{profile.location}</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {preview}
        </p>
      </Link>
    );
  }

  return (
    <Link
      href={`/profile/${profile._id}`}
      className="group block h-full"
    >
      <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
        {/* Photo Section with Gradient Overlay */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <ProfilePhoto
            photoStorageId={profile.photoStorageId}
            photoUrl={profile.photoUrl}
            name={profile.name}
            size="xl"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Location Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 shadow-sm">
              <Icon name="lucide:map-pin" size={12} className="text-orange-500" />
              {profile.location}
            </span>
          </div>

          {/* Arrow Indicator */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 shadow-sm">
            <Icon name="lucide:arrow-up-right" size={16} className="text-slate-700" />
          </div>

          {/* Name on Photo */}
          <div className="absolute bottom-3 left-4 right-4">
            <h4 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
              {profile.name}
            </h4>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {preview && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {preview}
            </p>
          )}

          {/* View Profile Link */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              View Profile
            </span>
            <div className="flex items-center gap-1 text-orange-500 group-hover:gap-2 transition-all duration-300">
              <span className="text-xs font-semibold">Details</span>
              <Icon name="lucide:chevron-right" size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
