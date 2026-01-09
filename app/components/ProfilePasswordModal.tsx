"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Icon } from "./Icon";

interface ProfilePasswordModalProps {
  profileId: string;
  profileName: string;
  hasPassword: boolean;
  onClose: () => void;
  onSuccess: (password: string) => void;
}

export function ProfilePasswordModal({
  profileId,
  profileName,
  hasPassword,
  onClose,
  onSuccess,
}: ProfilePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const verifyPassword = useMutation(api.profiles.verifyProfilePassword);

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

  // If profile has no password, allow direct edit
  useEffect(() => {
    if (!hasPassword) {
      onSuccess("");
    }
  }, [hasPassword, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const result = await verifyPassword({
        id: profileId as Id<"profiles">,
        password,
      });

      if (result.success) {
        onSuccess(password);
      } else {
        setError(result.error || "Incorrect password");
        setPassword("");
      }
    } catch {
      setError("Failed to verify password. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Don't render if no password (useEffect will handle redirect)
  if (!hasPassword) {
    return null;
  }

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
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/50 transition-colors"
          >
            <Icon name="lucide:x" size={16} className="text-slate-400" />
          </button>
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:lock" size={32} className="text-slate-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">
            Edit Profile
          </h2>
          <p className="text-sm text-slate-500">
            Enter password to edit {profileName}&apos;s profile
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Profile Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Enter your profile password"
                autoFocus
                disabled={isVerifying}
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
              disabled={isVerifying || !password}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Icon name="lucide:loader-2" size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Icon name="lucide:pencil" size={16} />
                  Continue to Edit
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
