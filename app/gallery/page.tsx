"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function GalleryPage() {
  const profiles = useQuery(api.profiles.list);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-orange-300 hover:text-orange-400 flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the Crew
          </h1>
          <p className="text-xl text-navy-100">
            {profiles?.length || 0} Travelers Ready for Adventure
          </p>
        </div>

        {profiles === undefined ? (
          <div className="text-center text-white text-xl">Loading...</div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-navy-600 mb-4">
              No Intros Yet
            </h2>
            <p className="text-navy-500 mb-6">
              Be the first to share your story!
            </p>
            <Link
              href="/submit"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Submit Your Intro
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Link
                key={profile._id}
                href={`/profile/${profile._id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden h-full">
                  {/* Photo or Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    {profile.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-6xl font-bold">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-navy-600 mb-2 group-hover:text-orange-500 transition-colors">
                      {profile.name}
                    </h2>
                    <p className="text-navy-500 mb-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {profile.location}
                    </p>

                    {/* Preview snippets */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide">
                          Passions
                        </h3>
                        <p className="text-navy-600 line-clamp-2">
                          {profile.passions}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide">
                          Fun Fact
                        </h3>
                        <p className="text-navy-600 line-clamp-1">
                          {profile.funFact1}
                        </p>
                      </div>
                    </div>

                    {/* View More Button */}
                    <div className="pt-4 border-t border-navy-100">
                      <span className="text-orange-500 font-semibold group-hover:text-orange-600 flex items-center gap-2">
                        View Full Profile
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Add Your Intro Button */}
        {profiles && profiles.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/submit"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Add Your Intro
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
