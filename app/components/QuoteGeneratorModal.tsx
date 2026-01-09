"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Icon } from "./Icon";

interface QuoteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (quote: string) => void;
}

type QuoteType =
  | "motivational"
  | "philosophical"
  | "funny"
  | "life"
  | "friendship"
  | "success";

const quoteTypes: { value: QuoteType; label: string; icon: string }[] = [
  { value: "motivational", label: "Motivational / Inspirational", icon: "lucide:flame" },
  { value: "philosophical", label: "Philosophical / Deep", icon: "lucide:brain" },
  { value: "funny", label: "Funny / Humorous", icon: "lucide:laugh" },
  { value: "life", label: "About Life / Wisdom", icon: "lucide:compass" },
  { value: "friendship", label: "About Friendship", icon: "lucide:users" },
  { value: "success", label: "About Success / Ambition", icon: "lucide:trophy" },
];

const themes = [
  { value: "adventure", label: "Adventure & Travel" },
  { value: "career", label: "Career & Growth" },
  { value: "family", label: "Family & Friends" },
  { value: "love", label: "Love & Relationships" },
  { value: "humor", label: "Humor & Fun" },
  { value: "resilience", label: "Resilience & Strength" },
  { value: "creativity", label: "Creativity & Art" },
  { value: "nature", label: "Nature & Peace" },
];

export function QuoteGeneratorModal({
  isOpen,
  onClose,
  onAccept,
}: QuoteGeneratorModalProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<QuoteType | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const generateQuote = useAction(api.ai.generateQuote);

  if (!isOpen) return null;

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme)
        ? prev.filter((t) => t !== theme)
        : [...prev, theme]
    );
  };

  const handleGenerate = async () => {
    if (!selectedType || selectedThemes.length === 0) {
      setError("Please complete all steps");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await generateQuote({
        quoteType: selectedType,
        themes: selectedThemes,
        customNotes: customNotes || undefined,
      });

      if (response.success) {
        setResult(response.quote);
        setStep(4);
      }
    } catch (err) {
      setError("Failed to generate quote. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      onAccept(result);
      handleClose();
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedType(null);
    setSelectedThemes([]);
    setCustomNotes("");
    setResult(null);
    setError("");
    onClose();
  };

  const canProceedStep1 = selectedType !== null;
  const canProceedStep2 = selectedThemes.length > 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Icon name="lucide:quote" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Find Your Perfect Quote
                </h3>
                <p className="text-xs text-slate-500">
                  {step < 4 ? `Step ${step} of 3` : "Your quote is ready"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Icon name="lucide:x" size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Progress bar */}
          {step < 4 && (
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    s <= step ? "bg-orange-500" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Icon
                  name="lucide:loader-2"
                  size={24}
                  className="text-orange-600 animate-spin"
                />
              </div>
              <p className="text-sm text-slate-600">Finding your perfect quote...</p>
            </div>
          )}

          {/* Step 1: Quote Type */}
          {step === 1 && !isLoading && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                What type of quote resonates with you?
              </p>
              <div className="space-y-2">
                {quoteTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedType === type.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon
                      name={type.icon}
                      size={20}
                      className={
                        selectedType === type.value
                          ? "text-orange-600"
                          : "text-slate-500"
                      }
                    />
                    <span
                      className={`text-sm font-medium ${
                        selectedType === type.value
                          ? "text-orange-700"
                          : "text-slate-700"
                      }`}
                    >
                      {type.label}
                    </span>
                    {selectedType === type.value && (
                      <Icon
                        name="lucide:check"
                        size={18}
                        className="text-orange-600 ml-auto"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Themes */}
          {step === 2 && !isLoading && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                What themes matter to you? (Select at least one)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeToggle(theme.value)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      selectedThemes.includes(theme.value)
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedThemes.includes(theme.value)
                          ? "border-orange-500 bg-orange-500"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedThemes.includes(theme.value) && (
                        <Icon name="lucide:check" size={14} className="text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        selectedThemes.includes(theme.value)
                          ? "text-orange-700 font-medium"
                          : "text-slate-700"
                      }`}
                    >
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Custom Notes */}
          {step === 3 && !isLoading && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Any specific mood or style you&apos;re looking for? (Optional)
              </p>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Something that reflects my love for travel and spontaneous adventures with friends..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
              />

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Your preferences
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {quoteTypes.find((t) => t.value === selectedType)?.label}
                  </span>
                  {selectedThemes.map((theme) => (
                    <span
                      key={theme}
                      className="px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-xs"
                    >
                      {themes.find((t) => t.value === theme)?.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && result && !isLoading && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-6">
                <Icon
                  name="lucide:quote"
                  size={24}
                  className="text-orange-300 mb-3"
                />
                <p className="text-lg text-slate-800 italic leading-relaxed">
                  {result}
                </p>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-2 mt-4">
              <Icon name="lucide:alert-circle" size={16} />
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 flex-shrink-0">
          {step === 1 && (
            <>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <Icon name="lucide:arrow-right" size={16} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="lucide:arrow-left" size={16} />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <Icon name="lucide:arrow-right" size={16} />
              </button>
            </>
          )}

          {step === 3 && !isLoading && (
            <>
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="lucide:arrow-left" size={16} />
                Back
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="lucide:sparkles" size={16} />
                Generate Quote
              </button>
            </>
          )}

          {step === 4 && result && (
            <>
              <button
                onClick={handleTryAgain}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="lucide:refresh-cw" size={16} />
                Try Again
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="lucide:check" size={16} />
                Use This Quote
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
