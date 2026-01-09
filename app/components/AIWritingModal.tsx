"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Icon } from "./Icon";

interface AIWritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  fieldName: string;
  fieldLabel: string;
  onAccept: (text: string) => void;
}

type ActionType = "expand" | "rewrite" | "shorten" | "custom";

export function AIWritingModal({
  isOpen,
  onClose,
  currentText,
  fieldName,
  fieldLabel,
  onAccept,
}: AIWritingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");
  const improveText = useAction(api.ai.improveText);

  if (!isOpen) return null;

  const handleAction = async (action: ActionType) => {
    if (action === "custom" && !customPrompt.trim()) {
      setError("Please enter your instructions");
      return;
    }

    if (!currentText.trim()) {
      setError("Please write something first before using AI assistance");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await improveText({
        text: currentText,
        action,
        customPrompt: action === "custom" ? customPrompt : undefined,
        fieldName,
      });

      if (response.success) {
        setResult(response.text);
      }
    } catch (err) {
      setError("Failed to generate. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      onAccept(result);
      onClose();
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setError("");
  };

  const handleClose = () => {
    setResult(null);
    setError("");
    setCustomPrompt("");
    onClose();
  };

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
                <Icon name="lucide:sparkles" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  AI Writing Assistant
                </h3>
                <p className="text-xs text-slate-500">Improving: {fieldLabel}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Icon name="lucide:x" size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
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
              <p className="text-sm text-slate-600">Working on it...</p>
            </div>
          )}

          {/* Result State */}
          {result && !isLoading && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  AI Suggestion
                </label>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4">
                  <p className="text-slate-800 whitespace-pre-wrap">{result}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Original
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-slate-600 whitespace-pre-wrap text-sm">
                    {currentText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Options State */}
          {!result && !isLoading && (
            <>
              {/* Current Text Preview */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Your Current Text
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-slate-700 whitespace-pre-wrap text-sm">
                    {currentText || (
                      <span className="text-slate-400 italic">
                        No text yet - write something first
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                  Quick Actions
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleAction("expand")}
                    disabled={!currentText.trim()}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      name="lucide:expand"
                      size={24}
                      className="text-slate-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Expand
                    </span>
                    <span className="text-xs text-slate-500">Add detail</span>
                  </button>
                  <button
                    onClick={() => handleAction("rewrite")}
                    disabled={!currentText.trim()}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      name="lucide:refresh-cw"
                      size={24}
                      className="text-slate-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Rewrite
                    </span>
                    <span className="text-xs text-slate-500">Fresh take</span>
                  </button>
                  <button
                    onClick={() => handleAction("shorten")}
                    disabled={!currentText.trim()}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      name="lucide:shrink"
                      size={24}
                      className="text-slate-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Shorten
                    </span>
                    <span className="text-xs text-slate-500">Be concise</span>
                  </button>
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Or give custom instructions
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Make it more professional and add specific achievements..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                />
                <button
                  onClick={() => handleAction("custom")}
                  disabled={!customPrompt.trim() || !currentText.trim()}
                  className="mt-3 w-full px-4 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="lucide:wand-2" size={16} />
                  Generate with Custom Prompt
                </button>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <Icon name="lucide:alert-circle" size={16} />
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 flex-shrink-0">
          {result ? (
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
                Use This Text
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="w-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
