"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { ImageGallery } from "@/app/components/ImageGallery";
import { RoomCard } from "@/app/components/RoomCard";
import { useToast } from "@/app/components/Toast";
import { Id } from "@/convex/_generated/dataModel";

interface Profile {
  _id: Id<"profiles">;
  name: string;
  photoStorageId?: Id<"_storage">;
  photoUrl?: string;
}

interface Room {
  _id: Id<"rooms">;
  name: string;
  description: string;
  bedType: string;
  capacity: number;
  features: string[];
  imageUrl?: string;
  assignedProfile?: Profile | null;
}

export default function AccommodationPage() {
  const accommodation = useQuery(api.accommodation.get);
  const rooms = useQuery(api.accommodation.getRooms);
  const unassignedProfiles = useQuery(api.accommodation.getUnassignedProfiles);
  const stats = useQuery(api.accommodation.getStats);
  const seedAccommodation = useMutation(api.accommodation.seed);
  const assignRoom = useMutation(api.accommodation.assignRoom);
  const unassignRoom = useMutation(api.accommodation.unassignRoom);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "gallery">("overview");
  const [isSeeding, setIsSeeding] = useState(false);
  const [loadingRoomId, setLoadingRoomId] = useState<Id<"rooms"> | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Seed accommodation data if not exists
  useEffect(() => {
    if (accommodation === null && !isSeeding) {
      handleSeed();
    }
  }, [accommodation]);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedAccommodation();
      showToast("Accommodation details loaded!");
    } catch (error) {
      console.error("Error seeding accommodation:", error);
      showToast("Failed to load accommodation", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAssign = async (roomId: Id<"rooms">, profileId: Id<"profiles">) => {
    setLoadingRoomId(roomId);
    try {
      await assignRoom({ roomId, profileId });
      showToast("Room assigned successfully!");
    } catch (error) {
      console.error("Error assigning room:", error);
      showToast("Failed to assign room", "error");
    } finally {
      setLoadingRoomId(null);
    }
  };

  const handleUnassign = async (roomId: Id<"rooms">) => {
    setLoadingRoomId(roomId);
    try {
      await unassignRoom({ roomId });
      showToast("Room assignment removed");
    } catch (error) {
      console.error("Error unassigning room:", error);
      showToast("Failed to remove assignment", "error");
    } finally {
      setLoadingRoomId(null);
    }
  };

  // Loading state
  if (accommodation === undefined || isSeeding) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="lucide:loader-2" size={32} className="text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:home" size={32} className="text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No Accommodation Found</h2>
          <p className="text-sm text-slate-500 mb-4">Unable to load accommodation details.</p>
          <button
            onClick={handleSeed}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            Load Accommodation
          </button>
        </div>
      </div>
    );
  }

  const displayedAmenities = showAllAmenities
    ? accommodation.amenities
    : accommodation.amenities.slice(0, 8);

  const amenityIcons: Record<string, string> = {
    Pool: "lucide:waves",
    "Ocean view": "lucide:sunrise",
    "Mountain view": "lucide:mountain",
    Kitchen: "lucide:cooking-pot",
    WiFi: "lucide:wifi",
    "Free parking": "lucide:car",
    "Air conditioning": "lucide:wind",
    Heating: "lucide:thermometer",
    Washer: "lucide:shirt",
    Dryer: "lucide:wind",
    TV: "lucide:tv",
    "BBQ grill": "lucide:flame",
    "Outdoor dining area": "lucide:utensils",
    "Security system": "lucide:shield",
    "Smoke alarm": "lucide:bell",
    "First aid kit": "lucide:heart-pulse",
    "Fire extinguisher": "lucide:flame-kindling",
    "Coffee maker": "lucide:coffee",
    Dishwasher: "lucide:circle-dot",
    Microwave: "lucide:microwave",
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {accommodation.images[0] && (
          <Image
            src={accommodation.images[0].url}
            alt={accommodation.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {/* Rating Badge */}
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                <Icon name="lucide:star" size={14} className="text-yellow-400 fill-yellow-400" />
                {accommodation.rating} ({accommodation.reviewCount} reviews)
              </span>
              <a
                href={accommodation.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5A5F]/90 backdrop-blur-sm rounded-full text-sm font-medium text-white hover:bg-[#FF5A5F] transition-colors"
              >
                <Icon name="lucide:external-link" size={14} />
                View on Airbnb
              </a>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              {accommodation.name}
            </h1>
            <p className="text-lg text-white/90 mb-4">{accommodation.tagline}</p>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <Icon name="lucide:map-pin" size={16} />
                {accommodation.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="lucide:users" size={16} />
                {accommodation.guests} guests
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="lucide:bed-double" size={16} />
                {accommodation.bedrooms} bedrooms
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="lucide:bath" size={16} />
                {accommodation.bathrooms} bathrooms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-[73px] z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Overview", icon: "lucide:home" },
              { id: "rooms", label: "Rooms", icon: "lucide:bed-double" },
              { id: "gallery", label: "Gallery", icon: "lucide:image" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
                {tab.id === "rooms" && stats && (
                  <span className="ml-1 px-2 py-0.5 bg-slate-100 rounded-full text-xs">
                    {stats.assignedRooms}/{stats.totalRooms}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Check-in/Check-out Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Icon name="lucide:log-in" size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Check-in</p>
                    <p className="text-lg font-semibold text-slate-900">{accommodation.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
                    <Icon name="lucide:log-out" size={24} className="text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Check-out</p>
                    <p className="text-lg font-semibold text-slate-900">{accommodation.checkOut}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon name="lucide:calendar-days" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Duration</p>
                    <p className="text-lg font-semibold text-slate-900">Feb 27 - Mar 7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Assignment Status */}
            {stats && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Room Assignments</h3>
                    <p className="text-white/80 text-sm">
                      {stats.assignedRooms} of {stats.totalRooms} rooms assigned
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{stats.assignedRooms}/{stats.totalRooms}</p>
                    <p className="text-white/80 text-sm">{stats.totalCapacity} total capacity</p>
                  </div>
                </div>
                <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${(stats.assignedRooms / stats.totalRooms) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => setActiveTab("rooms")}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  Manage room assignments
                  <Icon name="lucide:arrow-right" size={16} />
                </button>
              </div>
            )}

            {/* Highlights */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Property Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accommodation.highlights.map((highlight: { icon: string; title: string; description: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={highlight.icon} size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{highlight.title}</h3>
                      <p className="text-sm text-slate-600">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About this place</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {accommodation.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">What this place offers</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {displayedAmenities.map((amenity: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Icon
                        name={amenityIcons[amenity] || "lucide:check-circle"}
                        size={20}
                        className="text-slate-500"
                      />
                      <span className="text-sm text-slate-700">{amenity}</span>
                    </div>
                  ))}
                </div>
                {accommodation.amenities.length > 8 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-4 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {showAllAmenities
                      ? "Show less"
                      : `Show all ${accommodation.amenities.length} amenities`}
                  </button>
                )}
              </div>
            </div>

            {/* House Rules */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">House Rules</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <ul className="space-y-3">
                  {accommodation.houseRules.map((rule: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <Icon
                        name="lucide:info"
                        size={16}
                        className="text-slate-400 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm text-slate-600">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Location</h2>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <Icon name="lucide:map-pin" size={20} className="text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">{accommodation.address}</p>
                      <p className="text-sm text-slate-500 mt-1">{accommodation.location}</p>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(accommodation.address + ", " + accommodation.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group cursor-pointer block"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                      <Icon name="lucide:map" size={32} className="text-slate-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      View on Google Maps
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click to open in new tab
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Room Assignments</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Assign guests to rooms for the trip
                </p>
              </div>
              {unassignedProfiles && unassignedProfiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon name="lucide:users" size={16} />
                  {unassignedProfiles.length} unassigned
                </div>
              )}
            </div>

            {/* Unassigned Guests Banner */}
            {unassignedProfiles && unassignedProfiles.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Icon name="lucide:alert-circle" size={20} className="text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">
                      {unassignedProfiles.length} guest{unassignedProfiles.length > 1 ? "s" : ""} still need{unassignedProfiles.length === 1 ? "s" : ""} a room
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {unassignedProfiles.slice(0, 5).map((profile: Profile) => (
                        <Link
                          key={profile._id}
                          href={`/profile/${profile._id}`}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-full text-xs font-medium text-slate-700 hover:bg-amber-100 transition-colors"
                        >
                          {profile.name}
                        </Link>
                      ))}
                      {unassignedProfiles.length > 5 && (
                        <span className="px-2 py-1 text-xs text-amber-700">
                          +{unassignedProfiles.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Room Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms?.map((room: Room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  availableProfiles={unassignedProfiles || []}
                  onAssign={handleAssign}
                  onUnassign={handleUnassign}
                  isLoading={loadingRoomId === room._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Photo Gallery</h2>
            <ImageGallery images={accommodation.images} propertyName={accommodation.name} />
          </div>
        )}
      </div>
    </div>
  );
}
