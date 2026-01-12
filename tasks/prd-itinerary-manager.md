# PRD: Itinerary Manager Role & Edit/Delete Functionality

## Introduction

Add the ability for designated "itinerary managers" to edit and delete activities in the trip itinerary. Currently, activities (both AI-generated and user-suggested) cannot be modified after creation. This feature introduces a manager role tied to user profiles, giving selected crew members control over curating and maintaining the final itinerary.

## Goals

- Allow up to 2 designated profiles to be assigned as "itinerary managers" (John + one other)
- Enable managers to edit any activity (AI or user-submitted)
- Enable managers to delete any activity with cascading removal of votes/comments
- Allow activity creators to edit their own user-suggested activities
- Show edit attribution ("Last edited by [name]") for transparency
- Maintain the open voting/commenting experience for non-managers

## User Stories

### US-001: Add manager role to profile schema
**Description:** As a developer, I need to store a manager role on profiles so the system knows who can edit/delete activities.

**Acceptance Criteria:**
- [ ] Add `isItineraryManager` boolean field to profiles table (default: false)
- [ ] Run `npx convex dev` to apply schema changes
- [ ] Existing profiles default to non-manager
- [ ] Typecheck passes

---

### US-002: Create manager designation UI in profile
**Description:** As an admin, I want to mark specific profiles as itinerary managers so they can manage the itinerary.

**Acceptance Criteria:**
- [ ] Add "Itinerary Manager" toggle/badge visible on profile view
- [ ] Only existing admins (localStorage `boys-trip-admin`) can toggle this setting
- [ ] Enforce maximum of 2 managers - show warning if limit reached
- [ ] Toggle persists to database via mutation
- [ ] Visual indicator shows manager status on profile
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-003: Add tracking fields to activities schema
**Description:** As a developer, I need to track who created and last edited an activity.

**Acceptance Criteria:**
- [ ] Add `creatorProfileId` (optional Id<"profiles">) field to activities table for user-suggested activities
- [ ] Add `lastEditedBy` (optional string) field to activities table
- [ ] Add `lastEditedAt` (optional number/timestamp) field to activities table
- [ ] Existing activities have these fields as undefined
- [ ] Update `suggestActivity` mutation to accept and store `creatorProfileId`
- [ ] Typecheck passes

---

### US-004: Create edit activity mutation
**Description:** As a developer, I need a backend mutation that allows authorized users to update activity details.

**Acceptance Criteria:**
- [ ] Create `updateActivity` mutation in `convex/itinerary.ts`
- [ ] Accepts: activityId, updated fields (title, description, location, cost, timeSlot, day, imageUrl, externalLink), editorProfileId
- [ ] Validates that editorProfileId is EITHER a manager OR the activity's creator (for user-suggested activities)
- [ ] AI-generated activities can only be edited by managers
- [ ] Updates `lastEditedBy` with editor's name and `lastEditedAt` with current timestamp
- [ ] Returns updated activity
- [ ] Typecheck passes

---

### US-005: Create delete activity mutation
**Description:** As a developer, I need a backend mutation that allows managers to delete activities with cascading cleanup.

**Acceptance Criteria:**
- [ ] Create `deleteActivity` mutation in `convex/itinerary.ts`
- [ ] Accepts: activityId, deleterProfileId
- [ ] Validates that deleterProfileId belongs to a manager profile
- [ ] Deletes all votes associated with the activity
- [ ] Deletes all comments associated with the activity
- [ ] Deletes the activity itself
- [ ] Returns success confirmation
- [ ] Typecheck passes

---

### US-006: Add edit button to ActivityCard for authorized users
**Description:** As an itinerary manager or activity creator, I want to see an edit button on activity cards I can modify.

**Acceptance Criteria:**
- [ ] Edit icon/button visible to managers (on all activities) and creators (on their own user-suggested activities)
- [ ] Authorization checked via profile lookup (not just localStorage)
- [ ] Button opens edit modal (US-008)
- [ ] Unauthorized users do not see edit controls
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-007: Add delete button to ActivityCard for managers
**Description:** As an itinerary manager, I want to delete activities that are no longer relevant.

**Acceptance Criteria:**
- [ ] Delete icon/button visible only to managers
- [ ] Clicking shows confirmation dialog ("Delete this activity? Votes and comments will also be removed.")
- [ ] Confirming calls `deleteActivity` mutation
- [ ] Activity removed from UI in real-time
- [ ] Cancel closes dialog without action
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-008: Create edit activity modal
**Description:** As an itinerary manager, I want a form to edit activity details.

**Acceptance Criteria:**
- [ ] Modal form pre-populated with current activity data
- [ ] Editable fields: title, description, location, cost, day (1-10), timeSlot, imageUrl, externalLink
- [ ] Save button calls `updateActivity` mutation
- [ ] Cancel button closes without saving
- [ ] Loading state while saving
- [ ] Success closes modal; error shows message
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-009: Display "Last edited by" on activity cards
**Description:** As a user, I want to see if an activity was edited and by whom for transparency.

**Acceptance Criteria:**
- [ ] If `lastEditedBy` exists, show "Edited by [name]" text on ActivityCard
- [ ] Subtle styling (smaller text, muted color) so it doesn't dominate
- [ ] Hover/tap shows relative timestamp ("2 hours ago")
- [ ] Activities without edits show nothing extra
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-010: Add manager context provider
**Description:** As a developer, I need a React context to efficiently check manager status across components.

**Acceptance Criteria:**
- [ ] Create `ManagerContext` provider that fetches current user's profile
- [ ] Exposes `isManager` boolean and `managerProfile` object
- [ ] Uses localStorage userId to look up profile
- [ ] Wrap itinerary page with this provider
- [ ] Typecheck passes

---

## Functional Requirements

- FR-1: Add `isItineraryManager` boolean field to profiles schema (default: false)
- FR-2: Maximum of 2 profiles can be designated as managers
- FR-3: Add `creatorProfileId`, `lastEditedBy`, and `lastEditedAt` fields to activities schema
- FR-4: Create `updateActivity` mutation that validates manager OR creator status before allowing edits
- FR-5: Create `deleteActivity` mutation that hard-deletes activity with cascading removal of votes and comments
- FR-6: Edit button visible to managers (all activities) and creators (own activities only)
- FR-7: Delete button visible only to managers
- FR-8: Manager toggle in profile settings, accessible only to admins
- FR-9: Display "Edited by [name]" on modified activities
- FR-10: Confirmation dialog required before deleting an activity

## Non-Goals

- No version history or undo functionality
- No soft-delete or activity recovery (hard delete only)
- No approval workflow for user suggestions (managers can delete if inappropriate)
- No bulk edit/delete operations
- No export/download functionality for the itinerary
- No "lock itinerary" feature to freeze all changes
- No notifications when activities are edited/deleted
- No creator ability to delete their own activities (only managers can delete)

## Design Considerations

- Edit/delete icons should match existing UI style (use existing icon library if present)
- Edit modal can reuse styling from `SuggestActivityForm` component
- "Edited by" text should be subtle (text-gray-500, text-sm) to avoid cluttering cards
- Confirmation dialog should use existing modal patterns from `ActivityModal`
- Manager badge on profiles could use orange accent color for visibility

## Technical Considerations

- Manager status must be checked server-side in mutations (not just client-side)
- Use profile ID (not localStorage userId) for manager verification
- Cascade deletes should happen in a single mutation for consistency
- Consider adding `by_profile` index to votes/comments if performance becomes an issue
- Real-time updates via Convex will automatically reflect changes across clients

## Success Metrics

- Managers can edit an activity in under 3 clicks
- Managers can delete an activity in 2 clicks (+ confirmation)
- All users can see who last edited an activity
- No unauthorized edits (manager validation works correctly)
- Zero orphaned votes/comments after activity deletion

## Open Questions

None - all questions resolved.
