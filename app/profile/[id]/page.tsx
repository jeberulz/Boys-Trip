"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { ProfilePhoto } from "@/app/components/ProfilePhoto";
import { Icon } from "@/app/components/Icon";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const profile = useQuery(api.profiles.get, {
    id: id as Id<"profiles">,
  });

  if (profile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Icon name="lucide:loader-2" size={20} className="animate-spin" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="pb-20 animate-fade-in">
        <div className="px-6 py-10">
          <Link
            href="/gallery"
            className="mb-6 text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <Icon name="lucide:arrow-left" size={14} />
            Back to Gallery
          </Link>

          <div className="bg-slate-50 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:user-x" size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Profile Not Found
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This profile doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const funFacts = [profile.funFact1, profile.funFact2, profile.funFact3].filter(Boolean);

  return (
    <div className="min-h-screen pb-20 animate-fade-in bg-slate-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 h-72 overflow-hidden">
          <ProfilePhoto
            photoStorageId={profile.photoStorageId}
            photoUrl={profile.photoUrl}
            name={profile.name}
            size="xl"
            className="w-full h-full object-cover object-center blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-50" />
        </div>

        {/* Floating Back Button */}
        <div className="relative z-10 px-6 pt-6">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 hover:bg-white transition-all shadow-sm"
          >
            <Icon name="lucide:arrow-left" size={16} />
            Back
          </Link>
        </div>

        {/* Profile Card */}
        <div className="relative z-10 px-6 pt-24">
          <div className="max-w-xl mx-auto relative">
            {/* Overlapping Avatar */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
              <ProfilePhoto
                photoStorageId={profile.photoStorageId}
                photoUrl={profile.photoUrl}
                name={profile.name}
                size="md"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover object-center"
              />
            </div>

            <div className="relative bg-white rounded-2xl shadow-lg">
              {/* Profile Header */}
              <div className="px-6 pt-28 pb-5 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
                  {profile.name}
                </h1>
                <div className="flex items-center justify-center gap-1.5 text-slate-500">
                  <Icon name="lucide:map-pin" size={14} />
                  <span className="text-sm">{profile.location}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Background */}
                {profile.background && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="lucide:briefcase" size={16} className="text-slate-400" />
                      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Background
                      </h2>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {profile.background}
                    </p>
                  </section>
                )}

                {/* Passions */}
                {profile.passions && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="lucide:heart" size={16} className="text-slate-400" />
                      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Passions
                      </h2>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {profile.passions}
                    </p>
                  </section>
                )}

                {/* Family */}
                {profile.family && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="lucide:users" size={16} className="text-slate-400" />
                      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Family
                      </h2>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {profile.family}
                    </p>
                  </section>
                )}

                {/* Goals */}
                {(profile.shortTermGoal || profile.longTermGoal) && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="lucide:target" size={16} className="text-slate-400" />
                      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Goals
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {profile.shortTermGoal && (
                        <div className="flex gap-3">
                          <Icon name="lucide:zap" size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-slate-400 uppercase">Short-term</span>
                            <p className="text-sm text-slate-600">{profile.shortTermGoal}</p>
                          </div>
                        </div>
                      )}
                      {profile.longTermGoal && (
                        <div className="flex gap-3">
                          <Icon name="lucide:rocket" size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-slate-400 uppercase">Long-term</span>
                            <p className="text-sm text-slate-600">{profile.longTermGoal}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Fun Facts */}
                {funFacts.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="lucide:sparkles" size={16} className="text-slate-400" />
                      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Fun Facts
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {funFacts.map((fact, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-xs font-semibold text-slate-400 mt-0.5">
                            {index + 1}.
                          </span>
                          <p className="text-sm text-slate-600">{fact}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Favorite Quote */}
                {profile.favoriteQuote && (
                  <section className="pt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="lucide:quote" size={16} className="text-slate-400" />
                      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Favorite Quote
                      </h2>
                    </div>
                    <blockquote className="text-sm text-slate-600 italic leading-relaxed border-l-2 border-slate-200 pl-4">
                      &ldquo;{profile.favoriteQuote}&rdquo;
                    </blockquote>
                  </section>
                )}
              </div>
            </div>

            {/* Back Link */}
            <div className="pt-6 text-center">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Icon name="lucide:arrow-left" size={16} />
                Back to The Crew
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
