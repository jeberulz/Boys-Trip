// Trip date constants and utilities for Cape Town trip
// Feb 27 - March 7, 2025 (9 days)

export const TRIP_START_DATE = new Date("2026-02-27T00:00:00");
export const TRIP_END_DATE = new Date("2026-03-07T23:59:59");

// Total trip days
export const TRIP_TOTAL_DAYS = 9;

/**
 * Calculate which trip day it currently is based on the current date.
 * @returns Day number (1-9) during the trip, or null if before/after trip
 */
export function getTripDay(now: Date = new Date()): number | null {
  // Normalize to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tripStart = new Date(
    TRIP_START_DATE.getFullYear(),
    TRIP_START_DATE.getMonth(),
    TRIP_START_DATE.getDate()
  );
  const tripEnd = new Date(
    TRIP_END_DATE.getFullYear(),
    TRIP_END_DATE.getMonth(),
    TRIP_END_DATE.getDate()
  );

  // Before trip starts
  if (today < tripStart) {
    return null;
  }

  // After trip ends
  if (today > tripEnd) {
    return null;
  }

  // During trip - calculate day number (1-indexed)
  const diffTime = today.getTime() - tripStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Day 1 is the first day
}

/**
 * Get the number of days until the trip starts.
 * @returns Number of days until trip, or 0 if trip has started/ended
 */
export function getDaysUntilTrip(now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tripStart = new Date(
    TRIP_START_DATE.getFullYear(),
    TRIP_START_DATE.getMonth(),
    TRIP_START_DATE.getDate()
  );

  if (today >= tripStart) {
    return 0;
  }

  const diffTime = tripStart.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if the trip has ended.
 */
export function isTripComplete(now: Date = new Date()): boolean {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tripEnd = new Date(
    TRIP_END_DATE.getFullYear(),
    TRIP_END_DATE.getMonth(),
    TRIP_END_DATE.getDate()
  );

  return today > tripEnd;
}

/**
 * Get trip status for display purposes.
 */
export type TripStatus =
  | { status: "pre-trip"; daysUntil: number }
  | { status: "during-trip"; currentDay: number }
  | { status: "post-trip" };

export function getTripStatus(now: Date = new Date()): TripStatus {
  const tripDay = getTripDay(now);

  if (tripDay !== null) {
    return { status: "during-trip", currentDay: tripDay };
  }

  if (isTripComplete(now)) {
    return { status: "post-trip" };
  }

  return { status: "pre-trip", daysUntil: getDaysUntilTrip(now) };
}
