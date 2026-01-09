"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();
  const createProfile = useMutation(api.profiles.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    family: "",
    background: "",
    passions: "",
    shortTermGoal: "",
    longTermGoal: "",
    funFact1: "",
    funFact2: "",
    funFact3: "",
    favoriteQuote: "",
    photoUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createProfile({
        name: formData.name,
        location: formData.location,
        family: formData.family,
        background: formData.background,
        passions: formData.passions,
        shortTermGoal: formData.shortTermGoal,
        longTermGoal: formData.longTermGoal,
        funFact1: formData.funFact1,
        funFact2: formData.funFact2,
        funFact3: formData.funFact3,
        favoriteQuote: formData.favoriteQuote,
        photoUrl: formData.photoUrl || undefined,
      });

      // Redirect to gallery
      router.push("/gallery");
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Failed to submit profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-700 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-orange-300 hover:text-orange-400 flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-6 md:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-navy-600 mb-2">
              Submit Your Intro
            </h1>
            <p className="text-navy-500">
              Share your story with your fellow travelers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-navy-600 font-semibold mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Your full name"
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
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="City, State/Country"
              />
            </div>

            {/* Family */}
            <div>
              <label className="block text-navy-600 font-semibold mb-2">
                Family *
              </label>
              <textarea
                name="family"
                value={formData.family}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your family..."
              />
            </div>

            {/* Background */}
            <div>
              <label className="block text-navy-600 font-semibold mb-2">
                Background *
              </label>
              <textarea
                name="background"
                value={formData.background}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                placeholder="Your education, career, life story..."
              />
            </div>

            {/* Passions */}
            <div>
              <label className="block text-navy-600 font-semibold mb-2">
                Passions & Interests *
              </label>
              <textarea
                name="passions"
                value={formData.passions}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                placeholder="What are you passionate about?"
              />
            </div>

            {/* Goals */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-navy-600 font-semibold mb-2">
                  Short-term Goal *
                </label>
                <textarea
                  name="shortTermGoal"
                  value={formData.shortTermGoal}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  placeholder="Your goal for this year..."
                />
              </div>
              <div>
                <label className="block text-navy-600 font-semibold mb-2">
                  Long-term Goal *
                </label>
                <textarea
                  name="longTermGoal"
                  value={formData.longTermGoal}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  placeholder="Your 5-10 year vision..."
                />
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-navy-600 font-bold text-lg mb-4">
                3 Fun Facts About You
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-navy-600 font-semibold mb-2">
                    Fun Fact #1 *
                  </label>
                  <input
                    type="text"
                    name="funFact1"
                    value={formData.funFact1}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="Something interesting about you..."
                  />
                </div>
                <div>
                  <label className="block text-navy-600 font-semibold mb-2">
                    Fun Fact #2 *
                  </label>
                  <input
                    type="text"
                    name="funFact2"
                    value={formData.funFact2}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="Another fun fact..."
                  />
                </div>
                <div>
                  <label className="block text-navy-600 font-semibold mb-2">
                    Fun Fact #3 *
                  </label>
                  <input
                    type="text"
                    name="funFact3"
                    value={formData.funFact3}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="One more fun fact..."
                  />
                </div>
              </div>
            </div>

            {/* Favorite Quote */}
            <div>
              <label className="block text-navy-600 font-semibold mb-2">
                Favorite Quote *
              </label>
              <textarea
                name="favoriteQuote"
                value={formData.favoriteQuote}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                placeholder="A quote that inspires you..."
              />
            </div>

            {/* Photo URL (Optional) */}
            <div>
              <label className="block text-navy-600 font-semibold mb-2">
                Photo URL (Optional)
              </label>
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-navy-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="https://example.com/your-photo.jpg"
              />
              <p className="text-sm text-navy-400 mt-1">
                Link to a photo of yourself (optional)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Your Intro"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
