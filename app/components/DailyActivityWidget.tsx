"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Icon } from "./Icon";
import { ActivityCard } from "./ActivityCard";
import { getTripStatus } from "@/app/lib/tripDates";

interface DailyActivityWidgetProps {
  onActivityClick: (activityId: Id<"activities">) => void;
}

export function DailyActivityWidget({ onActivityClick }: DailyActivityWidgetProps) {
  const tripStatus = getTripStatus();

  // During trip: fetch current day's activities
  // Pre-trip: fetch Day 1 as preview
  const dayToFetch = tripStatus.status === "during-trip"
    ? tripStatus.currentDay
    : tripStatus.status === "pre-trip"
      ? 1
      : null;

  const activities = useQuery(
    api.itinerary.getActivitiesByDay,
    dayToFetch !== null ? { day: dayToFetch } : "skip"
  );

  // Pre-trip state: countdown
  if (tripStatus.status === "pre-trip") {
    return (
      <div className="px-6 py-12 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Icon name="lucide:calendar-clock" size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight uppercase">
              Countdown
            </h3>
          </div>

          {/* Countdown Display */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-600 mb-4">
              <span className="text-3xl font-bold">{tripStatus.daysUntil}</span>
            </div>
            <p className="text-lg font-medium text-slate-900 mb-2">
              {tripStatus.daysUntil === 1 ? "day" : "days"} until Cape Town
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Feb 27 — March 7, 2025
            </p>
          </div>

          {/* Day 1 Preview */}
          {activities && activities.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Day 1 Preview
                </p>
                <Link
                  href="/itinerary"
                  className="text-xs text-orange-600 font-medium hover:underline"
                >
                  View Full Itinerary
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.slice(0, 2).map((activity) => (
                  <ActivityCard
                    key={activity._id}
                    activity={activity}
                    onViewDetails={() => onActivityClick(activity._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Post-trip state: trip complete
  if (tripStatus.status === "post-trip") {
    return (
      <div className="px-6 py-12 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Icon name="lucide:check-circle" size={16} className="text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight uppercase">
              Trip Complete
            </h3>
          </div>

          {/* Complete Message */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <Icon name="lucide:party-popper" size={32} />
            </div>
            <p className="text-lg font-medium text-slate-900 mb-2">
              What an incredible trip!
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Cape Town 2025 is one for the books.
            </p>
            <Link
              href="/itinerary"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Browse Trip Memories
              <Icon name="lucide:arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // During trip state: today's schedule
  return (
    <div className="px-6 py-12 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon name="lucide:sun" size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight uppercase">
              Today&apos;s Schedule
            </h3>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
              Day {tripStatus.currentDay}
            </span>
          </div>
          <Link
            href="/itinerary"
            className="text-xs text-orange-600 font-medium hover:underline"
          >
            View Full Itinerary
          </Link>
        </div>

        {/* Loading state */}
        {activities === undefined && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {activities && activities.length === 0 && (
          <div className="text-center py-8 bg-white rounded-xl border border-slate-200">
            <Icon name="lucide:calendar-x" size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-2">
              No activities planned for today yet.
            </p>
            <Link
              href="/itinerary"
              className="text-sm text-orange-600 font-medium hover:underline"
            >
              Suggest an activity →
            </Link>
          </div>
        )}

        {/* Activities grid */}
        {activities && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
                onViewDetails={() => onActivityClick(activity._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
