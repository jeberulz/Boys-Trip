"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Icon } from "./Icon";

interface ActivityModalProps {
  activityId: Id<"activities">;
  onClose: () => void;
  onSuggestAlternative: () => void;
}

export function ActivityModal({
  activityId,
  onClose,
  onSuggestAlternative,
}: ActivityModalProps) {
  const activityDetails = useQuery(api.itinerary.getActivityDetails, {
    activityId,
  });
  const addComment = useMutation(api.itinerary.addComment);

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({
        activityId,
        userName: commentName.trim(),
        text: commentText.trim(),
      });
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activityDetails) {
    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl p-8">
          <div className="flex items-center gap-2 text-slate-500">
            <Icon name="lucide:loader-2" size={20} className="animate-spin" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const getTimeSlotBadge = (timeSlot: string) => {
    switch (timeSlot) {
      case "Morning":
        return "bg-amber-100 text-amber-700";
      case "Afternoon":
        return "bg-sky-100 text-sky-700";
      case "Evening":
        return "bg-violet-100 text-violet-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col animate-slide-up relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <Icon name="lucide:x" size={16} />
        </button>

        {/* Modal Header */}
        <div className="h-32 bg-slate-100 w-full relative">
          {activityDetails.source === "ai" && (
            <div className="absolute top-4 left-4 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border border-purple-200 shadow-sm z-10 flex items-center gap-1">
              <Icon name="lucide:sparkles" size={10} />
              AI Generated
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
          <div className="absolute bottom-4 left-6 text-slate-900">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide mb-2 ${getTimeSlotBadge(
                activityDetails.timeSlot
              )}`}
            >
              {activityDetails.timeSlot}
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              {activityDetails.title}
            </h2>
          </div>
        </div>

        {/* Modal Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <div className="flex gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Icon name="lucide:map-pin" size={14} className="text-slate-400" />
                <span>{activityDetails.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="lucide:dollar-sign" size={14} className="text-slate-400" />
                <span>{activityDetails.cost}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <span className="text-xs font-semibold text-slate-900">
                {activityDetails.voteScore}
              </span>
              <span className="text-[10px] uppercase text-slate-400 font-medium">
                Votes
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2">
                Description
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activityDetails.description}
              </p>
            </div>

            {/* Comments Section */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Discussion ({activityDetails.comments.length})
              </h4>

              {/* Comments List */}
              <div className="space-y-3 mb-4">
                {activityDetails.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No comments yet.</p>
                ) : (
                  activityDetails.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-slate-50 p-3 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] font-bold text-slate-900">
                          {comment.userName}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Your name"
                  required
                />
                <div className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Add a comment..."
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !commentName.trim() || !commentText.trim()}
                    className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300"
                  >
                    <Icon name="lucide:send" size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onSuggestAlternative();
            }}
            className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
          >
            <Icon name="lucide:plus" size={14} />
            Suggest Alternative
          </button>
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
