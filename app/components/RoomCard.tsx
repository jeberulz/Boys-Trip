"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "./Icon";
import { ProfilePhoto } from "./ProfilePhoto";
import { Id } from "@/convex/_generated/dataModel";

interface Profile {
  _id: Id<"profiles">;
  name: string;
  photoStorageId?: Id<"_storage">;
  photoUrl?: string;
}

interface RoomCardProps {
  room: {
    _id: Id<"rooms">;
    name: string;
    description: string;
    bedType: string;
    capacity: number;
    features: string[];
    imageUrl?: string;
    assignedProfile?: Profile | null;
  };
  availableProfiles: Profile[];
  onAssign: (roomId: Id<"rooms">, profileId: Id<"profiles">) => void;
  onUnassign: (roomId: Id<"rooms">) => void;
  isLoading?: boolean;
}

export function RoomCard({
  room,
  availableProfiles,
  onAssign,
  onUnassign,
  isLoading,
}: RoomCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const featureIcons: Record<string, string> = {
    "En-suite bathroom": "lucide:bath",
    "Ocean view": "lucide:waves",
    "Mountain view": "lucide:mountain",
    "Private balcony": "lucide:door-open",
    "Walk-in closet": "lucide:shirt",
    "Smart TV": "lucide:tv",
    "Garden access": "lucide:flower-2",
    "Patio doors": "lucide:door-open",
    "Desk workspace": "lucide:laptop",
    "City view": "lucide:building-2",
    "USB charging points": "lucide:plug",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Room Image */}
      <div className="relative h-48 overflow-hidden">
        {room.imageUrl ? (
          <Image
            src={room.imageUrl}
            alt={room.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Icon name="lucide:bed-double" size={48} className="text-slate-300" />
          </div>
        )}

        {/* Bed type badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 shadow-sm">
            <Icon name="lucide:bed-double" size={12} className="text-orange-500" />
            {room.bedType}
          </span>
        </div>

        {/* Capacity badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
            <Icon name="lucide:users" size={12} />
            {room.capacity}
          </span>
        </div>

        {/* Assigned profile overlay */}
        {room.assignedProfile && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
            <div className="flex items-center gap-3">
              <ProfilePhoto
                photoStorageId={room.assignedProfile.photoStorageId}
                photoUrl={room.assignedProfile.photoUrl}
                name={room.assignedProfile.name}
                size="sm"
                className="w-10 h-10 rounded-full ring-2 ring-white"
              />
              <div>
                <p className="text-white font-medium text-sm">
                  {room.assignedProfile.name}
                </p>
                <p className="text-white/70 text-xs">Assigned to this room</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Room Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{room.name}</h3>
        <p className={`text-sm text-slate-600 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
          {room.description}
        </p>
        {room.description.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-orange-600 font-medium mt-1 hover:text-orange-700"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Features */}
        <div className="mt-4 flex flex-wrap gap-2">
          {room.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md text-xs text-slate-600"
            >
              <Icon
                name={featureIcons[feature] || "lucide:check"}
                size={12}
                className="text-slate-400"
              />
              {feature}
            </span>
          ))}
          {room.features.length > 4 && (
            <span className="px-2 py-1 text-xs text-slate-500">
              +{room.features.length - 4} more
            </span>
          )}
        </div>

        {/* Assignment Section */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          {room.assignedProfile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Icon name="lucide:check-circle" size={16} />
                <span className="font-medium">Room assigned</span>
              </div>
              <button
                onClick={() => onUnassign(room._id)}
                disabled={isLoading}
                className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
              >
                <Icon name="lucide:user-minus" size={14} />
                Remove
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={isLoading || availableProfiles.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Icon name="lucide:loader-2" size={16} className="animate-spin" />
                    Assigning...
                  </>
                ) : availableProfiles.length === 0 ? (
                  <>
                    <Icon name="lucide:user-x" size={16} />
                    No profiles available
                  </>
                ) : (
                  <>
                    <Icon name="lucide:user-plus" size={16} />
                    Assign guest
                  </>
                )}
              </button>

              {/* Dropdown */}
              {showDropdown && availableProfiles.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-20 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Select a guest
                    </p>
                    {availableProfiles.map((profile) => (
                      <button
                        key={profile._id}
                        onClick={() => {
                          onAssign(room._id, profile._id);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
                      >
                        <ProfilePhoto
                          photoStorageId={profile.photoStorageId}
                          photoUrl={profile.photoUrl}
                          name={profile.name}
                          size="sm"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {profile.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
