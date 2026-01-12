"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Icon } from "./Icon";
import { useToast } from "./Toast";
import { useManager } from "./ManagerContext";

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
    commentCount?: number;
    imageUrl?: string;
    externalLink?: string;
    creatorProfileId?: Id<"profiles">;
  };
  onViewDetails: () => void;
  onEdit?: () => void;
}

export function ActivityCard({ activity, onViewDetails, onEdit }: ActivityCardProps) {
  const voteOnActivity = useMutation(api.itinerary.voteOnActivity);
  const { showToast } = useToast();
  const { isManager, profileId } = useManager();
  const [userId, setUserId] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);

  // Determine if user can edit this activity
  const canEdit = isManager ||
    (activity.source === "user" &&
     activity.creatorProfileId !== undefined &&
     activity.creatorProfileId === profileId);

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
      const result = await voteOnActivity({
        activityId: activity._id,
        userId,
        voteType,
      });

      // Show toast based on action
      if (result.action === "removed") {
        showToast("Vote removed");
      } else if (result.action === "updated") {
        showToast(voteType === 1 ? "Changed to upvote" : "Changed to downvote");
      } else {
        showToast(voteType === 1 ? "Upvoted!" : "Downvoted");
      }
    } catch (error) {
      console.error("Error voting:", error);
      showToast("Failed to vote", "error");
    } finally {
      setIsVoting(false);
    }
  };

  const getTimeSlotBadge = (timeSlot: string) => {
    switch (timeSlot) {
      case "Morning":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Afternoon":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "Evening":
        return "bg-violet-100 text-violet-700 border-violet-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getVoteColor = (score: number) => {
    if (score > 0) return "text-emerald-600";
    if (score < 0) return "text-red-500";
    return "text-slate-400";
  };

  const isHot = activity.voteScore >= 5;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow group">
      {/* Content */}
      <div className="flex-1 p-4 flex gap-4">
        {/* Vote Column */}
        <div className="flex flex-col items-center justify-center gap-1 min-w-[32px]">
          <button
            onClick={() => handleVote(1)}
            disabled={isVoting}
            className={`p-1 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 ${
              userVote === 1
                ? "text-emerald-600"
                : "text-slate-400 hover:text-emerald-600"
            }`}
          >
            <Icon name="lucide:thumbs-up" size={18} />
          </button>
          <span className={`text-sm font-bold ${getVoteColor(activity.voteScore)}`}>
            {activity.voteScore}
          </span>
          <button
            onClick={() => handleVote(-1)}
            disabled={isVoting}
            className={`p-1 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 ${
              userVote === -1
                ? "text-red-500"
                : "text-slate-400 hover:text-red-500"
            }`}
          >
            <Icon name="lucide:thumbs-down" size={18} />
          </button>
        </div>

        {/* Image Thumbnail */}
        {activity.imageUrl && (
          <div 
            className="w-24 h-24 rounded-lg bg-slate-100 bg-cover bg-center flex-shrink-0 cursor-pointer hidden sm:block"
            style={{ backgroundImage: `url(${activity.imageUrl})` }}
            onClick={onViewDetails}
          />
        )}

        {/* Details */}
        <div className="flex-1 cursor-pointer" onClick={onViewDetails}>
          {/* Badges */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${getTimeSlotBadge(
                activity.timeSlot
              )}`}
            >
              {activity.timeSlot}
            </span>
            {isHot && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1">
                <Icon name="lucide:flame" size={10} />
                Hot
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-normal text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
            {activity.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {activity.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Icon name="lucide:map-pin" size={12} />
                {activity.location}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="lucide:dollar-sign" size={12} />
                {activity.cost}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-xs text-slate-400 flex items-center gap-1 hover:text-orange-600 transition-colors"
                  title="Edit activity"
                >
                  <Icon name="lucide:pencil" size={12} />
                </button>
              )}
              <button className="text-xs text-slate-400 flex items-center gap-1 hover:text-slate-600 transition-colors">
                <Icon name="lucide:message-square" size={12} />
                {activity.commentCount || 0}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
