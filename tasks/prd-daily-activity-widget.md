# PRD: Daily Activity Widget

## Introduction

Add a dynamic "Today's Schedule" widget to the landing page that displays the current day's planned activities during the Cape Town trip (Feb 27 — March 7). The widget provides trip participants with an at-a-glance view of what's happening each day, with rich activity cards showing images, voting stats, and external links. Users can click any activity to view full details in a modal.

## Goals

- Display activities for the current trip day automatically based on date
- Show rich activity cards with images, voting stats, cost, and external links
- Allow users to click activities to view full details in an existing modal
- Provide a fallback experience before/after the trip dates
- Position as secondary content below recent profile additions

## User Stories

### US-001: Calculate current trip day
**Description:** As a system, I need to determine which trip day it is (1-7) based on the current date so that the widget displays the correct activities.

**Acceptance Criteria:**
- [ ] Create utility function that calculates trip day from current date
- [ ] Trip starts Feb 27, 2025 (Day 1) and ends March 7, 2025 (Day 9)
- [ ] Returns null if before trip start or after trip end
- [ ] Returns day number (1-9) during the trip
- [ ] Typecheck/lint passes

### US-002: Query activities by current day
**Description:** As a developer, I need to fetch all activities for a specific day so that the widget can display them.

**Acceptance Criteria:**
- [ ] Create or reuse Convex query to fetch activities by day number
- [ ] Include vote counts for each activity
- [ ] Sort activities by time slot (Morning → Afternoon → Evening)
- [ ] Returns empty array if no activities for that day
- [ ] Typecheck/lint passes

### US-003: Create DailyActivityWidget component
**Description:** As a user, I want to see a widget showing today's activities so I know what's planned.

**Acceptance Criteria:**
- [ ] Widget displays section header "Today's Schedule" with current day indicator (e.g., "Day 3")
- [ ] Shows all activities for current day in a vertical list or grid
- [ ] Uses rich activity cards with: image, title, time slot, location, cost, vote count, external link
- [ ] Each card is clickable to open ActivityModal
- [ ] Empty state when no activities exist for the day
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-004: Handle pre-trip state
**Description:** As a user visiting before the trip starts, I want to see a countdown or preview so I stay engaged.

**Acceptance Criteria:**
- [ ] Before Feb 27: Show countdown to trip start (X days to go)
- [ ] Optionally show Day 1 activities as a preview
- [ ] Clear messaging that the trip hasn't started yet
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-005: Handle post-trip state
**Description:** As a user visiting after the trip ends, I want appropriate messaging rather than an empty widget.

**Acceptance Criteria:**
- [ ] After March 7: Show "Trip Complete" or similar message
- [ ] Optionally link to full itinerary to browse past activities
- [ ] Widget doesn't show stale "today's" content
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-006: Integrate widget into landing page
**Description:** As a user, I want to see the daily activity widget on the landing page below the recent additions section.

**Acceptance Criteria:**
- [ ] Widget renders below "Recent Additions" section
- [ ] Consistent styling with existing page sections (padding, max-width, borders)
- [ ] Responsive layout works on mobile and desktop
- [ ] Widget only shows during or near trip dates (or always with appropriate states)
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

### US-007: Activity card click opens modal
**Description:** As a user, I want to click an activity card to see full details so I can learn more and engage.

**Acceptance Criteria:**
- [ ] Clicking activity card opens existing ActivityModal component
- [ ] Modal shows full activity details, comments, and voting
- [ ] Modal close returns to landing page without navigation
- [ ] Reuses existing selectedActivityId state pattern from landing page
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: The system must calculate the current trip day (1-9) based on comparing current date to trip dates (Feb 27 - March 7, 2025)
- FR-2: The system must query and display all activities for the calculated trip day
- FR-3: Activities must be sorted by time slot in order: Morning, Afternoon, Evening
- FR-4: Each activity card must display: image (if available), title, time slot badge, location, cost, vote count, and external link (if available)
- FR-5: Clicking an activity card must open the ActivityModal with that activity's details
- FR-6: Before trip start date, the widget must show a countdown with days remaining
- FR-7: After trip end date, the widget must show a "Trip Complete" state with link to full itinerary
- FR-8: The widget must be positioned below the "Recent Additions" section on the landing page
- FR-9: The widget must be responsive and work on mobile viewports

## Non-Goals

- No ability to add/edit activities from this widget (use itinerary page)
- No day navigation within the widget (shows current day only)
- No push notifications or reminders
- No timezone handling beyond local browser time
- No caching of trip day calculation (recalculates on each render)

## Design Considerations

- **Styling:** Match existing section patterns — light background (`bg-slate-50/50`), subtle top border, consistent padding (`px-6 py-12`)
- **Activity Cards:** Reuse or extend existing `ActivityCard` component to include rich details
- **Time Slot Badges:** Use colored badges for Morning (yellow/amber), Afternoon (orange), Evening (indigo/blue)
- **Vote Display:** Show upvote count with icon, matching itinerary page style
- **Responsive:** Single column on mobile, 2-3 columns on larger screens
- **Empty State:** Friendly message with illustration or icon when no activities

## Technical Considerations

- **Date Calculation:** Use JavaScript Date comparison; trip dates should be constants (consider putting in a config)
- **Convex Query:** The existing `activities` table has `by_day` index — leverage this for efficient queries
- **State Management:** Reuse existing `selectedActivityId` state pattern already in landing page
- **Component Reuse:** Extend or compose with existing `ActivityCard` component
- **Vote Counts:** May need to join/aggregate from `votes` table or add to existing activity queries

## Success Metrics

- Users can see today's activities within 1 scroll on mobile
- Activity cards display all key information without requiring modal open
- Widget correctly transitions between pre-trip, during-trip, and post-trip states
- No performance regression on landing page load time

## Open Questions

- Should the countdown (pre-trip state) show Day 1 activities as a preview, or just the countdown?
- What specific date format should be used for the trip dates (hardcoded 2025, or configurable)?
- Should there be a manual override to view a different day (stretch goal for later)?
- Should the widget be hidden entirely outside of trip dates, or always visible with appropriate state?
