"use client";

export function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm h-full">
      {/* Photo Section Skeleton */}
      <div className="relative h-44 bg-slate-200 animate-pulse" />

      {/* Content Section */}
      <div className="p-4">
        {/* Text skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
        </div>

        {/* Footer skeleton */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-3 bg-slate-200 rounded animate-pulse w-20" />
          <div className="h-3 bg-slate-200 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}
