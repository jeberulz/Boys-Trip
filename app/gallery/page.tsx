"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ProfileCard } from "@/app/components/ProfileCard";
import { ProfileCardSkeleton } from "@/app/components/ProfileCardSkeleton";
import { Icon } from "@/app/components/Icon";

export default function GalleryPage() {
  const profiles = useQuery(api.profiles.list);

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <div className="px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              The Crew
            </h2>
{profiles === undefined ? (
              <div className="h-4 bg-slate-200 rounded animate-pulse w-48 mt-2" />
            ) : (
              <p className="text-sm text-slate-500 mt-1">
                {profiles.length} legends attending Boys Trip 2026
              </p>
            )}
          </div>
        </div>

        {/* Loading State - Skeleton Cards */}
        {profiles === undefined && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {profiles && profiles.length === 0 && (
          <div className="bg-slate-50 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:users" size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Intros Yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Be the first to share your story!
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Submit Your Intro
              <Icon name="lucide:arrow-right" size={16} />
            </Link>
          </div>
        )}

        {/* Profiles Grid */}
        {profiles && profiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
