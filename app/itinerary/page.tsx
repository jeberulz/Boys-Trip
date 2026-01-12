"use client";

import { useState, useEffect } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ActivityCard } from "@/app/components/ActivityCard";
import { ActivityModal } from "@/app/components/ActivityModal";
import { SuggestActivityForm } from "@/app/components/SuggestActivityForm";
import { AdminGateModal } from "@/app/components/AdminGateModal";
import { EditActivityModal } from "@/app/components/EditActivityModal";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { Icon } from "@/app/components/Icon";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/app/components/Toast";
import { ManagerProvider, useManager } from "@/app/components/ManagerContext";

// Activity type for edit modal
interface EditableActivity {
  _id: Id<"activities">;
  day: number;
  timeSlot: string;
  title: string;
  description: string;
  location: string;
  cost: string;
  imageUrl?: string;
  externalLink?: string;
}

function ItineraryContent() {
  const itinerary = useQuery(api.itinerary.getItinerary);
  const generateItinerary = useAction(api.itinerary.generateItinerary);
  const deleteActivity = useMutation(api.itinerary.deleteActivity);
  const { showToast } = useToast();
  const { profileId } = useManager();

  const [selectedActivityId, setSelectedActivityId] = useState<Id<"activities"> | null>(null);
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingActivity, setEditingActivity] = useState<EditableActivity | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<Id<"activities"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check admin status on mount
  useEffect(() => {
    const adminStatus = localStorage.getItem("boys-trip-admin");
    setIsAdmin(adminStatus === "true");
  }, []);

  const handleGenerateClick = () => {
    if (!isAdmin) {
      setShowAdminModal(true);
      return;
    }
    handleGenerate();
  };

  const handleGenerate = async () => {
    if (!confirm("This will clear the current itinerary and generate a new one. Continue?")) {
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateItinerary();
      showToast(`Generated ${result.count} activities!`);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      showToast("Failed to generate itinerary", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteActivity = async () => {
    if (!deletingActivityId || !profileId) return;

    setIsDeleting(true);
    try {
      await deleteActivity({
        activityId: deletingActivityId,
        deleterProfileId: profileId,
      });
      showToast("Activity deleted");
      setDeletingActivityId(null);
    } catch (error) {
      console.error("Error deleting activity:", error);
      showToast("Failed to delete activity", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const isEmpty = !itinerary || Object.keys(itinerary).length === 0;

  // Day dates for Feb 27 - March 8, 2026
  const dayDates: Record<number, string> = {
    1: "Feb 27",
    2: "Feb 28",
    3: "March 1",
    4: "March 2",
    5: "March 3",
    6: "March 4",
    7: "March 5",
    8: "March 6",
    9: "March 7",
    10: "March 8",
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Cape Town - 10 Day Itinerary
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              AI-curated activities. Vote for what you want to do.
            </p>
          </div>
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Icon name="lucide:loader-2" size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icon name="lucide:sparkles" size={14} className="text-orange-400" />
                Regenerate with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Empty State */}
        {isEmpty && !isGenerating && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:map" size={32} className="text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              No Itinerary Yet
            </h2>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              Click &quot;Regenerate with AI&quot; to create your Cape Town adventure itinerary!
            </p>
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              <Icon name="lucide:sparkles" size={16} />
              Generate Itinerary
            </button>
          </div>
        )}

        {/* Days */}
        {!isEmpty && (
          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => {
              const dayActivities = itinerary?.[day] || [];
              if (dayActivities.length === 0) return null;

              return (
                <div key={day} className="relative">
                  {/* Sticky Day Header */}
                  <div className="sticky top-[73px] z-30 bg-slate-50 py-3 mb-4 border-b border-slate-200/60 backdrop-blur-sm bg-opacity-95">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-lg font-bold text-slate-900">
                        Day {day}
                      </h2>
                      <span className="text-sm font-medium text-slate-400">
                        {dayDates[day]}
                      </span>
                    </div>
                  </div>

                  {/* Activities Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {dayActivities.map((activity) => (
                      <ActivityCard
                        key={activity._id}
                        activity={{
                          ...activity,
                          commentCount: 0, // Would need to add this to the query
                        }}
                        onViewDetails={() => setSelectedActivityId(activity._id)}
                        onEdit={() => setEditingActivity({
                          _id: activity._id,
                          day: activity.day,
                          timeSlot: activity.timeSlot,
                          title: activity.title,
                          description: activity.description,
                          location: activity.location,
                          cost: activity.cost,
                          imageUrl: activity.imageUrl,
                          externalLink: activity.externalLink,
                        })}
                        onDelete={() => setDeletingActivityId(activity._id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Suggest Button */}
        {!isEmpty && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setShowSuggestForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              <Icon name="lucide:plus" size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedActivityId && (
        <ActivityModal
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
          onSuggestAlternative={() => setShowSuggestForm(true)}
        />
      )}

      {showSuggestForm && (
        <SuggestActivityForm
          onClose={() => setShowSuggestForm(false)}
          onSuccess={() => {
            showToast("Activity suggestion added!");
          }}
        />
      )}

      {showAdminModal && (
        <AdminGateModal
          onClose={() => setShowAdminModal(false)}
          onSuccess={() => {
            setIsAdmin(true);
            showToast("Admin access unlocked!");
          }}
        />
      )}

      {editingActivity && profileId && (
        <EditActivityModal
          activity={editingActivity}
          profileId={profileId}
          onClose={() => setEditingActivity(null)}
          onSuccess={() => {
            showToast("Activity updated!");
          }}
        />
      )}

      {deletingActivityId && (
        <ConfirmDialog
          title="Delete Activity"
          message="Delete this activity? Votes and comments will also be removed."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isDestructive={true}
          isLoading={isDeleting}
          onConfirm={handleDeleteActivity}
          onCancel={() => setDeletingActivityId(null)}
        />
      )}
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <ManagerProvider>
      <ItineraryContent />
    </ManagerProvider>
  );
}
