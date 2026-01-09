"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { ProfileCard } from "@/app/components/ProfileCard";
import { ActivityCard } from "@/app/components/ActivityCard";
import { ActivityModal } from "@/app/components/ActivityModal";
import { SuggestActivityForm } from "@/app/components/SuggestActivityForm";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/app/components/Toast";

export default function Home() {
  const participantCount = useQuery(api.profiles.count);
  const profiles = useQuery(api.profiles.list);
  const featuredEvent = useQuery(api.itinerary.getFeaturedEvent);
  const { showToast } = useToast();

  const [selectedActivityId, setSelectedActivityId] = useState<Id<"activities"> | null>(null);
  const [showSuggestForm, setShowSuggestForm] = useState(false);

  const recentProfiles = profiles?.slice(0, 3) || [];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="px-6 py-20 md:py-32 flex flex-col items-center text-center">
        {/* Intro Count Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          {participantCount !== undefined ? participantCount : "..."} intros submitted
        </span>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter text-slate-900 mb-6 max-w-3xl">
          Cape Town <br />
          <span className="text-slate-400">Feb 27 — March 7</span>
        </h1>

        {/* Subtitle */}
        <p className="leading-relaxed text-lg font-normal text-slate-500 max-w-lg mb-10">
          Get to know the crew before we land. Share your story, set your goals, and prepare for the legendary week ahead.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/submit"
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Submit Your Intro
            <Icon name="lucide:arrow-right" size={16} />
          </Link>
          <Link
            href="/itinerary"
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-3.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            View Itinerary
          </Link>
        </div>
      </div>

      {/* Featured Event Section */}
      {featuredEvent && (
        <div className="px-6 py-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="lucide:star" size={16} className="text-orange-500 fill-orange-500" />
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight uppercase">
                Featured Event
              </h3>
            </div>
            
            <ActivityCard
              activity={featuredEvent}
              onViewDetails={() => setSelectedActivityId(featuredEvent._id)}
            />
            
            <div className="mt-4 flex justify-end">
               <a
                href={featuredEvent.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
               >
                 Get Tickets <Icon name="lucide:external-link" size={12} />
               </a>
            </div>
          </div>
        </div>
      )}

      {/* Recent Additions Section */}
      {recentProfiles.length > 0 && (
        <div className="px-6 py-12 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
            <h3 className="text-sm font-normal text-slate-900 tracking-tight">
              Recent Additions
            </h3>
            <Link
              href="/gallery"
              className="text-xs text-orange-600 font-medium hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {recentProfiles.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                variant="compact"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State - Show when no profiles yet */}
      {recentProfiles.length === 0 && participantCount !== undefined && (
        <div className="px-6 py-12 border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-4xl mx-auto text-center py-8">
            <p className="text-sm text-slate-500 mb-4">
              No intros submitted yet. Be the first to introduce yourself!
            </p>
            <Link
              href="/submit"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Submit Your Intro →
            </Link>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedActivityId && (
        <ActivityModal
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
          onSuggestAlternative={() => setShowSuggestForm(true)}
        />
      )}

      {showSuggestForm && (
        <SuggestActivityForm
          onClose={() => setShowSuggestForm(false)}
          onSuccess={() => {
            showToast("Activity suggestion added!");
          }}
        />
      )}
    </div>
  );
}
