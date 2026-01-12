"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Key for storing the current user's profile ID in localStorage
const PROFILE_ID_KEY = "boys-trip-my-profile-id";

interface ManagerProfile {
  _id: Id<"profiles">;
  name: string;
  isItineraryManager?: boolean;
}

interface ManagerContextType {
  isManager: boolean;
  managerProfile: ManagerProfile | null;
  profileId: Id<"profiles"> | null;
  setProfileId: (id: Id<"profiles"> | null) => void;
  isLoading: boolean;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

interface ManagerProviderProps {
  children: ReactNode;
}

export function ManagerProvider({ children }: ManagerProviderProps) {
  const [profileId, setProfileIdState] = useState<Id<"profiles"> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load profile ID from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem(PROFILE_ID_KEY);
    if (storedId) {
      setProfileIdState(storedId as Id<"profiles">);
    }
    setIsInitialized(true);
  }, []);

  // Persist profile ID to localStorage
  const setProfileId = (id: Id<"profiles"> | null) => {
    if (id) {
      localStorage.setItem(PROFILE_ID_KEY, id);
    } else {
      localStorage.removeItem(PROFILE_ID_KEY);
    }
    setProfileIdState(id);
  };

  // Fetch the profile if we have an ID
  const profile = useQuery(
    api.profiles.get,
    profileId ? { id: profileId } : "skip"
  );

  const isLoading = !isInitialized || (profileId !== null && profile === undefined);

  const managerProfile: ManagerProfile | null = profile
    ? {
        _id: profile._id,
        name: profile.name,
        isItineraryManager: profile.isItineraryManager,
      }
    : null;

  const isManager = managerProfile?.isItineraryManager === true;

  return (
    <ManagerContext.Provider
      value={{
        isManager,
        managerProfile,
        profileId,
        setProfileId,
        isLoading,
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
}

export function useManager() {
  const context = useContext(ManagerContext);
  if (context === undefined) {
    throw new Error("useManager must be used within a ManagerProvider");
  }
  return context;
}
