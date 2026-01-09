"use client";

import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ActivityCard } from "@/app/components/ActivityCard";
import { ActivityModal } from "@/app/components/ActivityModal";
import { SuggestActivityForm } from "@/app/components/SuggestActivityForm";
import { Id } from "@/convex/_generated/dataModel";

export default function ItineraryPage() {
  const itinerary = useQuery(api.itinerary.getItinerary);
  const generateItinerary = useAction(api.itinerary.generateItinerary);

  const [selectedActivityId, setSelectedActivityId] = useState<Id<"activities"> | null>(null);
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const handleGenerate = async () => {
    if (!confirm("This will clear the current itinerary and generate a new one. Continue?")) {
      return;
    }

    setIsGenerating(true);
    try {
      await generateItinerary();
      // Expand day 1 after generation
      setExpandedDays(new Set([1]));
    } catch (error) {
      console.error("Error generating itinerary:", error);
      alert("Failed to generate itinerary. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const isEmpty = !itinerary || Object.keys(itinerary).length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-orange-300 hover:text-orange-400 flex items-center gap-2 mb-6"
          >
            ← Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-navy-600 mb-2">
                Cape Town - 7 Day Itinerary
              </h1>
              <p className="text-xl text-navy-500">
                AI-curated activities. Vote for what you want to do.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Regenerate with AI
                  </>
                )}
              </button>
              <button
                onClick={() => setShowSuggestForm(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Suggest Activity
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="bg-white rounded-lg shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-navy-600 mb-4">
              No Itinerary Yet
            </h2>
            <p className="text-navy-500 mb-6">
              Click "Regenerate with AI" to create your Cape Town adventure itinerary!
            </p>
          </div>
        ) : (
          /* Day-by-Day Accordion */
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const dayActivities = itinerary?.[day] || [];
              const isExpanded = expandedDays.has(day);
              const topActivity = dayActivities[0];

              return (
                <div
                  key={day}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  {/* Day Header */}
                  <button
                    onClick={() => toggleDay(day)}
                    className="w-full p-6 flex items-center justify-between hover:bg-navy-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {day}
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-bold text-navy-600">
                          Day {day}
                        </h2>
                        <p className="text-navy-500">
                          {dayActivities.length} activities
                          {topActivity && ` • Top: ${topActivity.title}`}
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-navy-400 transition-transform ${
                        isExpanded ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Day Activities */}
                  {isExpanded && (
                    <div className="p-6 pt-0 border-t border-navy-100">
                      {dayActivities.length === 0 ? (
                        <div className="text-center py-8 text-navy-400">
                          <p>No activities for this day yet.</p>
                          <button
                            onClick={() => setShowSuggestForm(true)}
                            className="mt-4 text-orange-500 hover:text-orange-600 font-semibold"
                          >
                            Suggest an activity
                          </button>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          {dayActivities.map((activity) => (
                            <ActivityCard
                              key={activity._id}
                              activity={activity}
                              onViewDetails={() =>
                                setSelectedActivityId(activity._id)
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-navy-200 text-sm">
          <p>
            Vote on activities to help the group decide what to do. The
            highest-voted activities will be prioritized!
          </p>
        </div>
      </div>

      {/* Modals */}
      {selectedActivityId && (
        <ActivityModal
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
        />
      )}

      {showSuggestForm && (
        <SuggestActivityForm
          onClose={() => setShowSuggestForm(false)}
          onSuccess={() => {
            // Optionally expand the day of the new activity
          }}
        />
      )}
    </div>
  );
}
