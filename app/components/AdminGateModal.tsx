"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "./Icon";

interface AdminGateModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = "johniscool";

export function AdminGateModal({ onClose, onSuccess }: AdminGateModalProps) {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("boys-trip-admin", "true");
      onSuccess();
      onClose();
    } else {
      setError("Wrong password. Nice try though!");
      setPassword("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/50 transition-colors"
          >
            <Icon name="lucide:x" size={16} className="text-slate-400" />
          </button>
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:coffee" size={32} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">
            Buy John a Coffee
          </h2>
          <p className="text-sm text-slate-500">
            to unlock AI itinerary generation
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showPasswordInput ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 text-center leading-relaxed">
                The AI generation feature is reserved for the trip organizer.
                If you&apos;re John, enter your secret password below!
              </p>
              <button
                onClick={() => setShowPasswordInput(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="lucide:key" size={16} />
                I&apos;m John, let me in!
              </button>
              <button
                onClick={onClose}
                className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
              >
                Maybe next time
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="Enter the secret password"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <Icon name="lucide:alert-circle" size={12} />
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm py-3 rounded-lg transition-colors"
              >
                Unlock AI Generation
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordInput(false);
                  setPassword("");
                  setError("");
                }}
                className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
              >
                Go back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
