"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const profile = useQuery(api.profiles.get, {
    id: params.id as Id<"profiles">,
  });

  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-xl p-12 text-center">
            <h1 className="text-3xl font-bold text-navy-600 mb-4">
              Profile Not Found
            </h1>
            <p className="text-navy-500 mb-6">
              This profile doesn't exist or has been removed.
            </p>
            <Link
              href="/gallery"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex gap-4">
          <Link
            href="/gallery"
            className="text-orange-300 hover:text-orange-400 flex items-center gap-2"
          >
            ← Back to Gallery
          </Link>
          <Link
            href="/"
            className="text-orange-300 hover:text-orange-400 flex items-center gap-2"
          >
            Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header with Photo */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white text-8xl font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {profile.name}
              </h1>
              <p className="text-xl text-white/90 flex items-center gap-2 mt-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {profile.location}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Family */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-navy-600 mb-3 flex items-center gap-2">
                <span className="text-orange-500">👨‍👩‍👦</span> Family
              </h2>
              <p className="text-navy-700 leading-relaxed">{profile.family}</p>
            </section>

            {/* Background */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-navy-600 mb-3 flex items-center gap-2">
                <span className="text-orange-500">📚</span> Background
              </h2>
              <p className="text-navy-700 leading-relaxed">
                {profile.background}
              </p>
            </section>

            {/* Passions */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-navy-600 mb-3 flex items-center gap-2">
                <span className="text-orange-500">❤️</span> Passions & Interests
              </h2>
              <p className="text-navy-700 leading-relaxed">
                {profile.passions}
              </p>
            </section>

            {/* Goals */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-navy-600 mb-4 flex items-center gap-2">
                <span className="text-orange-500">🎯</span> Goals
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-bold text-navy-600 mb-2">
                    Short-term Goal
                  </h3>
                  <p className="text-navy-700">{profile.shortTermGoal}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-bold text-navy-600 mb-2">
                    Long-term Goal
                  </h3>
                  <p className="text-navy-700">{profile.longTermGoal}</p>
                </div>
              </div>
            </section>

            {/* Fun Facts */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-navy-600 mb-4 flex items-center gap-2">
                <span className="text-orange-500">✨</span> Fun Facts
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-navy-50 p-4 rounded-lg">
                  <span className="text-orange-500 font-bold text-lg">1.</span>
                  <p className="text-navy-700 flex-1">{profile.funFact1}</p>
                </div>
                <div className="flex items-start gap-3 bg-navy-50 p-4 rounded-lg">
                  <span className="text-orange-500 font-bold text-lg">2.</span>
                  <p className="text-navy-700 flex-1">{profile.funFact2}</p>
                </div>
                <div className="flex items-start gap-3 bg-navy-50 p-4 rounded-lg">
                  <span className="text-orange-500 font-bold text-lg">3.</span>
                  <p className="text-navy-700 flex-1">{profile.funFact3}</p>
                </div>
              </div>
            </section>

            {/* Favorite Quote */}
            <section className="bg-gradient-to-r from-orange-100 to-orange-50 p-8 rounded-lg border-l-4 border-orange-500">
              <h2 className="text-xl font-bold text-navy-600 mb-3">
                Favorite Quote
              </h2>
              <blockquote className="text-navy-700 text-lg italic leading-relaxed">
                "{profile.favoriteQuote}"
              </blockquote>
            </section>
          </div>
        </div>

        {/* Back to Gallery Button */}
        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            View All Profiles
          </Link>
        </div>
      </div>
    </div>
  );
}
