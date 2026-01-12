"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { ProfileCard } from "@/app/components/ProfileCard";

export default function DashboardPage() {
  const participantCount = useQuery(api.profiles.count);
  const profiles = useQuery(api.profiles.list);
  const itinerary = useQuery(api.itinerary.getItinerary);

  const recentProfiles = profiles?.slice(0, 6) || [];
  const activityCount = itinerary ? Object.values(itinerary).flat().length : 0;

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <div className="px-6 py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Overview of Boys Trip 2026
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            href="/gallery"
            className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Icon name="lucide:users" size={20} className="text-slate-600" />
              </div>
              <Icon name="lucide:arrow-right" size={16} className="text-slate-400" />
            </div>
            <div className="text-2xl font-semibold text-slate-900 mb-1">
              {participantCount !== undefined ? participantCount : "..."}
            </div>
            <div className="text-sm text-slate-500">Participants</div>
          </Link>

          <Link
            href="/itinerary"
            className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon name="lucide:calendar" size={20} className="text-orange-600" />
              </div>
              <Icon name="lucide:arrow-right" size={16} className="text-slate-400" />
            </div>
            <div className="text-2xl font-semibold text-slate-900 mb-1">
              {activityCount}
            </div>
            <div className="text-sm text-slate-500">Activities</div>
          </Link>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Icon name="lucide:map-pin" size={20} className="text-slate-600" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-slate-900 mb-1">
              Cape Town
            </div>
            <div className="text-sm text-slate-500">Feb 27 — March 8</div>
          </div>
        </div>

        {/* Recent Profiles */}
        {recentProfiles.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Recent Additions
              </h2>
              <Link
                href="/gallery"
                className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1"
              >
                View All
                <Icon name="lucide:arrow-right" size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProfiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} variant="compact" />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/submit"
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <Icon name="lucide:user-plus" size={16} />
              Submit Your Intro
            </Link>
            <Link
              href="/itinerary"
              className="flex-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <Icon name="lucide:calendar" size={16} />
              View Itinerary
            </Link>
            <Link
              href="/gallery"
              className="flex-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <Icon name="lucide:users" size={16} />
              Browse Crew
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
