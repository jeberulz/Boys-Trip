"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Icon } from "@/app/components/Icon";

export default function SubmitPage() {
  const router = useRouter();
  const createProfile = useMutation(api.profiles.create);
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
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

  // Calculate progress based on filled fields
  const totalFields = 11; // All required fields
  const filledFields = [
    formData.name,
    formData.location,
    formData.family,
    formData.background,
    formData.passions,
    formData.shortTermGoal,
    formData.longTermGoal,
    formData.funFact1,
    formData.funFact2,
    formData.funFact3,
    formData.favoriteQuote,
  ].filter(Boolean).length;
  const progress = (filledFields / totalFields) * 100;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let photoStorageId: Id<"_storage"> | undefined;

      if (selectedFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });

        if (!result.ok) {
          throw new Error("Failed to upload photo");
        }

        const { storageId } = await result.json();
        photoStorageId = storageId;
      }

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
        photoStorageId: photoStorageId,
      });

      router.push("/gallery");
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Failed to submit profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20 animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100 sticky top-0 z-40">
        <div
          className="h-full bg-orange-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
            Create your profile
          </h2>
          <p className="text-sm text-slate-500">
            Share a bit about yourself so the crew knows who they&apos;re bunking with.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: The Basics */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
                The Basics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="custom-input"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="custom-input"
                  placeholder="e.g. New York, NY"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Profile Photo (Optional)
              </label>
              <div className="flex items-start gap-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-full border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <Icon name="lucide:user" size={24} className="text-slate-400" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Max 5MB. Leave blank to use your initial.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: About You */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
                About You
              </h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Family
              </label>
              <textarea
                name="family"
                value={formData.family}
                onChange={handleChange}
                required
                rows={2}
                className="custom-input resize-none"
                placeholder="Tell us about your family..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Background
              </label>
              <textarea
                name="background"
                value={formData.background}
                onChange={handleChange}
                required
                rows={3}
                className="custom-input resize-none"
                placeholder="Your education, career, life story..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Passions & Interests
              </label>
              <textarea
                name="passions"
                value={formData.passions}
                onChange={handleChange}
                required
                rows={2}
                className="custom-input resize-none"
                placeholder="What are you passionate about?"
              />
            </div>
          </div>

          {/* Section 3: Goals */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
                Goals
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Short-term Goal
                </label>
                <textarea
                  name="shortTermGoal"
                  value={formData.shortTermGoal}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="custom-input resize-none"
                  placeholder="Your goal for this year..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Long-term Goal
                </label>
                <textarea
                  name="longTermGoal"
                  value={formData.longTermGoal}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="custom-input resize-none"
                  placeholder="Your 5-10 year vision..."
                />
              </div>
            </div>
          </div>

          {/* Section 4: Fun Facts */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                4
              </div>
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
                Fun Facts
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Fun Fact #1
                </label>
                <input
                  type="text"
                  name="funFact1"
                  value={formData.funFact1}
                  onChange={handleChange}
                  required
                  className="custom-input"
                  placeholder="Something interesting about you..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Fun Fact #2
                </label>
                <input
                  type="text"
                  name="funFact2"
                  value={formData.funFact2}
                  onChange={handleChange}
                  required
                  className="custom-input"
                  placeholder="Another fun fact..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Fun Fact #3
                </label>
                <input
                  type="text"
                  name="funFact3"
                  value={formData.funFact3}
                  onChange={handleChange}
                  required
                  className="custom-input"
                  placeholder="One more fun fact..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Favorite Quote
              </label>
              <textarea
                name="favoriteQuote"
                value={formData.favoriteQuote}
                onChange={handleChange}
                required
                rows={2}
                className="custom-input resize-none"
                placeholder="A quote that inspires you..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-8 py-3 rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="lucide:loader-2" size={16} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
