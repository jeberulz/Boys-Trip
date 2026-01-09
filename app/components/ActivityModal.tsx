"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ActivityModalProps {
  activityId: Id<"activities">;
  onClose: () => void;
}

export function ActivityModal({ activityId, onClose }: ActivityModalProps) {
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
      // Keep name for future comments
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activityDetails) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8">
          <div className="text-navy-600">Loading...</div>
        </div>
      </div>
    );
  }

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-navy-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getTimeSlotColor(
                    activityDetails.timeSlot
                  )}`}
                >
                  {activityDetails.timeSlot}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    activityDetails.source === "ai"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {activityDetails.source === "ai"
                    ? "AI Generated"
                    : "User Suggested"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-navy-600">
                {activityDetails.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-navy-400 hover:text-navy-600 transition-colors ml-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className="text-navy-700 leading-relaxed">
              {activityDetails.description}
            </p>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide mb-2">
                Location
              </h3>
              <div className="flex items-center gap-2 text-navy-700">
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{activityDetails.location}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide mb-2">
                Estimated Cost
              </h3>
              <div className="flex items-center gap-2 text-navy-700 font-semibold">
                <svg
                  className="w-5 h-5 text-orange-500"
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
                <span>{activityDetails.cost}</span>
              </div>
            </div>
          </div>

          {/* Vote Tally */}
          <div className="bg-navy-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide mb-2">
              Current Votes
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-navy-700 font-semibold">
                  {activityDetails.upvotes} upvotes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-navy-700 font-semibold">
                  {activityDetails.downvotes} downvotes
                </span>
              </div>
              <div className="ml-auto">
                <span className="text-sm text-navy-500">Score: </span>
                <span
                  className={`text-xl font-bold ${getVoteScoreColor(
                    activityDetails.voteScore
                  )}`}
                >
                  {activityDetails.voteScore}
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-lg font-bold text-navy-600 mb-4">
              Comments ({activityDetails.comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-4">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
                <textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !commentName.trim() || !commentText.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activityDetails.comments.length === 0 ? (
                <p className="text-navy-400 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                activityDetails.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-navy-50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-navy-700">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-navy-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-navy-600 text-sm">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-navy-100">
          <button
            onClick={onClose}
            className="w-full bg-navy-500 hover:bg-navy-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
