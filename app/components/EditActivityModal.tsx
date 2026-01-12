"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Icon } from "./Icon";

interface Activity {
  _id: Id<"activities">;
  day: number;
  timeSlot: string;
  title: string;
  description: string;
  location: string;
  cost: string;
  imageUrl?: string;
  externalLink?: string;
}

interface EditActivityModalProps {
  activity: Activity;
  profileId: Id<"profiles">;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditActivityModal({
  activity,
  profileId,
  onClose,
  onSuccess,
}: EditActivityModalProps) {
  const updateActivity = useMutation(api.itinerary.updateActivity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: activity.day,
    timeSlot: activity.timeSlot,
    title: activity.title,
    description: activity.description,
    location: activity.location,
    cost: activity.cost,
    imageUrl: activity.imageUrl || "",
    externalLink: activity.externalLink || "",
  });

  // Pre-populate form when activity changes
  useEffect(() => {
    setFormData({
      day: activity.day,
      timeSlot: activity.timeSlot,
      title: activity.title,
      description: activity.description,
      location: activity.location,
      cost: activity.cost,
      imageUrl: activity.imageUrl || "",
      externalLink: activity.externalLink || "",
    });
  }, [activity]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "day" ? Number(value) : value,
    }));
    // Clear error when user makes changes
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateActivity({
        activityId: activity._id,
        editorProfileId: profileId,
        updates: {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          cost: formData.cost,
          day: formData.day,
          timeSlot: formData.timeSlot,
          imageUrl: formData.imageUrl || undefined,
          externalLink: formData.externalLink || undefined,
        },
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating activity:", err);
      setError(err instanceof Error ? err.message : "Failed to update activity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Edit Activity
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon name="lucide:x" size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day and Time Slot */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Day
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Time Slot
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 transition-colors"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Activity Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Shark Cage Diving"
              className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:border-orange-500 outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Why should we do this?"
              className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:border-orange-500 outline-none resize-none transition-colors"
            />
          </div>

          {/* Location and Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Gansbaai"
                className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Est. Cost
              </label>
              <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                placeholder="e.g. $150"
                className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:border-orange-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:border-orange-500 outline-none transition-colors"
            />
          </div>

          {/* External Link */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              External Link (optional)
            </label>
            <input
              type="url"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleChange}
              placeholder="https://example.com/activity"
              className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:border-orange-500 outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-3 rounded-lg font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="lucide:loader-2" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
