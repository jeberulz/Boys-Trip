"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

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
  const { showToast } = useToast();

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on escape key
  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [handleEscapeKey]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
      showToast("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Failed to add comment", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activityDetails) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-t-2xl sm:rounded-2xl p-8 animate-slide-up">
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
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-slate-100 transition-colors z-10 shadow-sm"
        >
          <Icon name="lucide:x" size={16} className="text-slate-600" />
        </button>

        {/* Modal Header */}
        <div className="h-32 bg-slate-100 w-full relative flex-shrink-0">
          {activityDetails.source === "ai" && (
            <div className="absolute top-4 left-4 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border border-purple-200 shadow-sm z-10 flex items-center gap-1">
              <Icon name="lucide:sparkles" size={10} />
              AI Generated
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
          <div className="absolute bottom-4 left-6 right-16 text-slate-900">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide mb-2 ${getTimeSlotBadge(
                activityDetails.timeSlot
              )}`}
            >
              {activityDetails.timeSlot}
            </span>
            <h2 className="text-xl font-bold tracking-tight line-clamp-2">
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
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-emerald-600">
                <Icon name="lucide:thumbs-up" size={14} />
                <span className="text-xs font-semibold">{activityDetails.upvotes}</span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <Icon name="lucide:thumbs-down" size={14} />
                <span className="text-xs font-semibold">{activityDetails.downvotes}</span>
              </div>
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
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {activityDetails.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No comments yet. Be the first to share your thoughts!
                  </p>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="Your name"
                  required
                />
                <div className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="Add a comment..."
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !commentName.trim() || !commentText.trim()}
                    className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    <Icon name="lucide:send" size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
          <button
            onClick={() => {
              onClose();
              onSuggestAlternative();
            }}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1.5"
          >
            <Icon name="lucide:plus" size={16} />
            Suggest Alternative
          </button>
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
