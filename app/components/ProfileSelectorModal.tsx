"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Icon } from "./Icon";
import { ProfilePhoto } from "./ProfilePhoto";
import { useManager } from "./ManagerContext";
import { Id } from "@/convex/_generated/dataModel";

interface ProfileSelectorModalProps {
  onClose: () => void;
}

export function ProfileSelectorModal({ onClose }: ProfileSelectorModalProps) {
  const profiles = useQuery(api.profiles.list);
  const { profileId, setProfileId } = useManager();

  const handleSelectProfile = (id: Id<"profiles">) => {
    setProfileId(id);
    onClose();
  };

  const handleClearSelection = () => {
    setProfileId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Select Your Profile
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose your profile to enable editing features
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Icon name="lucide:x" size={18} />
          </button>
        </div>

        {/* Profile List */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {profiles === undefined ? (
            <div className="flex items-center justify-center py-8">
              <Icon name="lucide:loader-2" size={20} className="animate-spin text-slate-400" />
            </div>
          ) : profiles.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No profiles found</p>
          ) : (
            <div className="space-y-2">
              {profiles.map((profile) => (
                <button
                  key={profile._id}
                  onClick={() => handleSelectProfile(profile._id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    profileId === profile._id
                      ? "bg-orange-50 border-2 border-orange-200"
                      : "bg-slate-50 hover:bg-slate-100 border-2 border-transparent"
                  }`}
                >
                  <ProfilePhoto
                    photoStorageId={profile.photoStorageId}
                    photoUrl={profile.photoUrl}
                    name={profile.name}
                    size="sm"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {profile.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {profile.location}
                    </p>
                  </div>
                  {profileId === profile._id && (
                    <div className="flex items-center gap-1.5 text-orange-600">
                      <Icon name="lucide:check-circle" size={18} />
                      <span className="text-xs font-medium">Selected</span>
                    </div>
                  )}
                  {profile.isItineraryManager && profileId !== profile._id && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-semibold">
                      <Icon name="lucide:crown" size={10} />
                      Manager
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {profileId && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleClearSelection}
              className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
