"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface SuggestActivityFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SuggestActivityForm({
  onClose,
  onSuccess,
}: SuggestActivityFormProps) {
  const suggestActivity = useMutation(api.itinerary.suggestActivity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    day: 1,
    timeSlot: "Morning",
    title: "",
    description: "",
    location: "",
    cost: "",
  });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await suggestActivity(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error suggesting activity:", error);
      alert("Failed to suggest activity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-navy-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-navy-600">
                Suggest Alternative Activity
              </h2>
              <p className="text-navy-500 mt-1">
                Have a better idea? Share it with the group!
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Day and Time Slot */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-navy-600 font-semibold mb-2">
                Which Day? *
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-navy-600 font-semibold mb-2">
                Time Slot *
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-navy-600 font-semibold mb-2">
              Activity Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Sunset Hike at Lion's Head"
              className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-navy-600 font-semibold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the activity in 2-3 sentences..."
              className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-navy-600 font-semibold mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Lion's Head, Signal Hill"
              className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-navy-600 font-semibold mb-2">
              Estimated Cost *
            </label>
            <input
              type="text"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              placeholder="e.g., $0-20, Free"
              className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
            />
            <p className="text-sm text-navy-400 mt-1">
              Estimated cost per person
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-navy-100 hover:bg-navy-200 text-navy-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Suggest Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
