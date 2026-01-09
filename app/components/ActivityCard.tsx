"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ActivityCardProps {
  activity: {
    _id: Id<"activities">;
    day: number;
    timeSlot: string;
    title: string;
    description: string;
    location: string;
    cost: string;
    source: string;
    voteScore: number;
    upvotes: number;
    downvotes: number;
  };
  onViewDetails: () => void;
}

export function ActivityCard({ activity, onViewDetails }: ActivityCardProps) {
  const voteOnActivity = useMutation(api.itinerary.voteOnActivity);
  const [userId, setUserId] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);

  // Get or create user ID from localStorage
  useEffect(() => {
    let id = localStorage.getItem("boys-trip-user-id");
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("boys-trip-user-id", id);
    }
    setUserId(id);
  }, []);

  const userVote = useQuery(
    api.itinerary.getUserVote,
    userId ? { activityId: activity._id, userId } : "skip"
  );

  const handleVote = async (voteType: number) => {
    if (!userId || isVoting) return;

    setIsVoting(true);
    try {
      await voteOnActivity({
        activityId: activity._id,
        userId,
        voteType,
      });
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const getTimeSlotColor = (timeSlot: string) => {
    switch (timeSlot) {
      case "Morning":
        return "bg-amber-100 text-amber-700";
      case "Afternoon":
        return "bg-blue-100 text-blue-700";
      case "Evening":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getVoteScoreColor = (score: number) => {
    if (score > 0) return "text-green-600";
    if (score < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-navy-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getTimeSlotColor(
                activity.timeSlot
              )}`}
            >
              {activity.timeSlot}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                activity.source === "ai"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {activity.source === "ai" ? "AI Generated" : "User Suggested"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-navy-600">{activity.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-navy-600 text-sm mb-3 line-clamp-2">
        {activity.description}
      </p>

      {/* Details */}
      <div className="space-y-1 mb-4 text-sm">
        <div className="flex items-center gap-2 text-navy-500">
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
          <span>{activity.location}</span>
        </div>
        <div className="flex items-center gap-2 text-navy-500">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">{activity.cost}</span>
        </div>
      </div>

      {/* Footer with Voting and Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-navy-100">
        {/* Voting */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote(1)}
            disabled={isVoting}
            className={`p-1.5 rounded-lg transition-all ${
              userVote === 1
                ? "bg-green-100 text-green-600"
                : "hover:bg-green-50 text-gray-500 hover:text-green-600"
            } disabled:opacity-50`}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <span
            className={`font-bold text-lg min-w-[2rem] text-center ${getVoteScoreColor(
              activity.voteScore
            )}`}
          >
            {activity.voteScore}
          </span>

          <button
            onClick={() => handleVote(-1)}
            disabled={isVoting}
            className={`p-1.5 rounded-lg transition-all ${
              userVote === -1
                ? "bg-red-100 text-red-600"
                : "hover:bg-red-50 text-gray-500 hover:text-red-600"
            } disabled:opacity-50`}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1 transition-colors"
        >
          View Details
          <svg
            className="w-4 h-4"
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
        </button>
      </div>
    </div>
  );
}
