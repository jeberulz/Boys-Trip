"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function Home() {
  const participantCount = useQuery(api.profiles.count);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Boys Trip 2026
            </h1>
            <div className="h-2 w-32 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-navy-100">
              Adventure Awaits. Brotherhood Begins.
            </p>
          </div>

          {/* Trip Details Card */}
          <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-navy-500 mb-6">
              Trip Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide">
                  Destination
                </h3>
                <p className="text-2xl font-bold text-navy-600">TBD</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide">
                  Date
                </h3>
                <p className="text-2xl font-bold text-navy-600">Coming Soon</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide">
                  Participants
                </h3>
                <p className="text-2xl font-bold text-orange-500">
                  {participantCount !== undefined ? participantCount : "..."}{" "}
                  {participantCount === 1 ? "Traveler" : "Travelers"}
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide">
                  Duration
                </h3>
                <p className="text-2xl font-bold text-navy-600">TBD</p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-navy-600 mb-3">
                Why This Trip?
              </h3>
              <p className="text-navy-600 leading-relaxed">
                This is more than just a getaway—it's a chance to connect,
                share stories, and create lasting memories. Before we embark on
                this adventure together, let's get to know each other better!
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/submit"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Submit Your Intro
            </Link>
            <Link
              href="/gallery"
              className="w-full sm:w-auto bg-white hover:bg-navy-50 text-navy-500 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-navy-500"
            >
              View All Intros
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-navy-200 mt-12 text-sm">
            Share your story, learn about your travel companions, and get ready
            for an unforgettable experience!
          </p>
        </div>
      </div>
    </div>
  );
}
